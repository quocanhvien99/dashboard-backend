import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

export function singup(req: Request, res: Response) {
	const { email, password, role_id, name } = req.body;
	const sqlCon = req.app.locals.sqlCon;
	const hashedPass = bcrypt.hashSync(password, 10);
	const data = [email, hashedPass, role_id, name];
	sqlCon.query(
		'insert into `user`(email, password, role_id, name) values (?, ?, ?, ?)',
		data,
		(err: any, result: any) => {
			if (err) return res.status(400).json(err);
			res.status(201).json({ msg: 'Thành công' });
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
		'select id, role.name as role from user where id=? and user.role_id=role.id', //@ts-ignore
		[req.session.uid],
		(err: any, result: any) => {
			if (err) return res.status(400).json(err);
			//@ts-ignore
			if (role != 'admin' && id != req.session.uid) {
				return res.sendStatus(403);
			}
			let cols = '';
			for (let key in req.body) {
				if (typeof req.body[key] == 'string') {
					cols += `${key}="${req.body[key]}", `;
					break;
				}
				cols += `${key} = ${req.body[key]}, `;
			}

			cols = cols.slice(0, cols.length - 2);
			sqlCon.query(
				`update user set ${cols} where id=${id}`,
				(err: any, result: any) => {
					if (err) return res.status(400).json(err);
					res.json({ msg: 'ok' });
				}
			);
		}
	);
}
export function list(req: Request, res: Response) {}
