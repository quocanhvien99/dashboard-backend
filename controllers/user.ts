import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import mysql from 'mysql2';

export function singup(req: Request, res: Response) {
	const { email, password, role, name } = req.body;
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	const hashedPass = bcrypt.hashSync(password, 10);
	const data = [email, hashedPass, role, name];
	sqlCon.query(`select * from user where email=?`, email, (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		if (result.length != 0) return res.status(400).json({ msg: 'Tài khoản đã tồn tại' });
		sqlCon.query(
			'insert into `user`(email, password, role, name) values (?, ?, ?, ?)',
			data,
			(err: any, result: any) => {
				if (err) return res.status(400).json(err);
				res.status(201).json({ msg: 'ok' });
			}
		);
	});
}
export function login(req: Request, res: Response) {
	const { email, password } = req.body;
	const sqlCon = req.app.locals.sqlCon;
	sqlCon.query('select * from user where email=? ', [email], (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		if (result.length == 0 || !bcrypt.compareSync(password, result[0].password)) {
			return res.status(400).json({ msg: 'Thông tin đăng nhập không chính xác.' });
		}
		//@ts-ignore
		req.session.uid = result[0].id;
		res.json(result[0]);
	});
}
export function logout(req: Request, res: Response) {
	req.session.destroy((err) => {
		return res.status(400).json(err);
	});
	res.json({ msg: 'ok' });
}
export function update(req: Request, res: Response) {
	const { id } = req.params;
	if (!id) return res.json({});
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	sqlCon.query(
		'select id, role from user where id=?', //@ts-ignore
		[req.session.uid],
		async (err: any, result: any) => {
			if (err) return res.status(400).json(err);
			//@ts-ignore
			if (result[0].role != 'admin' && id != req.session.uid) {
				return res.sendStatus(403);
			}
			let cols = '';
			if (req.file) {
				cols += `profile_pic="/img/${req.file.filename}", `;
			}
			for (let key in req.body) {
				cols += `${key}=${sqlCon.escape(req.body[key])}, `;
			}
			cols = cols.slice(0, cols.length - 2);
			if (cols.length !== 0) {
				sqlCon.query(`update user set ${cols} where id=${sqlCon.escape(id)}`, (err: any, result: any) => {
					if (err) return res.status(400).json(err);
					return res.json({ msg: 'ok' });
				});
			} else {
				res.json({ msg: 'ok' });
			}
		}
	);
}
export function list(req: Request, res: Response) {
	let { s, skip, limit, orderby, sortby, role } = req.query;

	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	let query = 'select * from user ';
	if (role || s) query += 'where ';
	if (s) query += `match(name, email, phone) against (${sqlCon.escape(s)}) `;
	if (role && s) query += 'and ';
	if (role) query += `role=${sqlCon.escape(role)} `;
	if (sortby) query += `order by ${sortby} `;
	if (orderby) query += `${orderby} `;
	if (limit) query += `limit ${parseInt(limit as string)} `;
	if (skip) query += `offset ${parseInt(skip as string)} `;

	sqlCon.query(query, (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		res.json(result);
	});
}
export function getuser(req: Request, res: Response) {
	const { id } = req.params;
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	sqlCon.query(`select * from user where id=?`, [id], (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		res.json(result[0]);
	});
}
