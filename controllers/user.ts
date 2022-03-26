import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

export function singup(req: Request, res: Response) {
	const { email, password, role_id, name } = req.body;
	const sqlCon = req.app.locals.sqlCon;
	const hashedPass = bcrypt.hashSync(password, 10);
	const data = [email, hashedPass, role_id, name];
	sqlCon.query(
		`select * from user where email=?`,
		email,
		(err: any, result: any) => {
			if (err) return res.status(400).json(err);
			if (result.length != 0) return res.json({ msg: 'Tài khoản đã tồn tại' });
			sqlCon.query(
				'insert into `user`(email, password, role_id, name) values (?, ?, ?, ?)',
				data,
				(err: any, result: any) => {
					if (err) return res.status(400).json(err);
					res.status(201).json({ msg: 'Thành công' });
				}
			);
		}
	);
}
export function login(req: Request, res: Response) {
	const { email, password } = req.body;
	const sqlCon = req.app.locals.sqlCon;
	sqlCon.query(
		'select role.name as role, user.* from user, role where email=? and user.role_id=role.id ',
		[email],
		(err: any, result: any) => {
			if (err) return res.status(400).json(err);
			if (
				result.length == 0 ||
				!bcrypt.compareSync(password, result[0].password)
			) {
				return res
					.status(400)
					.json({ msg: 'Thông tin đăng nhập không chính xác.' });
			}
			//@ts-ignore
			req.session.uid = result[0].id;
			res.json({ msg: 'ok' });
		}
	);
}
export function update(req: Request, res: Response) {
	const { id } = req.params;
	if (!id) return res.json({});
	const sqlCon = req.app.locals.sqlCon;
	sqlCon.query(
		'select user.id, role.name as role from user, role where user.id=? and user.role_id=role.id', //@ts-ignore
		[req.session.uid],
		(err: any, result: any) => {
			if (err) return res.status(400).json(err);
			//@ts-ignore
			if (result[0].role != 'admin' && id != req.session.uid) {
				return res.sendStatus(403);
			}
			let cols = '';
			if (req.file) {
				cols += `profile_pic="${req.file.destination.slice(2)}", `;
			}
			for (let key in req.body) {
				if (typeof req.body[key] == 'string') {
					cols += `${key}="${req.body[key]}", `;
					break;
				}
				cols += `${key} = ${req.body[key]}, `;
			}

			cols = cols.slice(0, cols.length - 2);
			if (cols.length !== 0) {
				sqlCon.query(
					`update user set ${cols} where id=${id}`,
					(err: any, result: any) => {
						if (err) return res.status(400).json(err);
						res.json({ msg: 'ok' });
					}
				);
			}
		}
	);
}
export function list(req: Request, res: Response) {
	let { s, skip, limit, orderby, sortby, role_id } = req.query;
	let query =
		'select role.name as role, user.* from user, role where user.role_id=role.id ';
	if (s)
		query += `, match(user.name, user.email, user.mobile) against ("${s}") `;
	if (role_id) query += `, user.role_id="${role_id}" `;
	if (limit) query += `limit ${limit} `;
	if (skip) query += `offset ${skip} `;
	if (orderby) query += `order by user.${orderby} `;
	if (sortby) query += `${sortby} `;

	const sqlCon = req.app.locals.sqlCon;
	sqlCon.query(query, (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		res.json(result);
	});
}
export function getuser(req: Request, res: Response) {
	const { id } = req.params;
	const sqlCon = req.app.locals.sqlCon;
	sqlCon.query(`select * from user where id`, (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		res.json(result);
	});
}
