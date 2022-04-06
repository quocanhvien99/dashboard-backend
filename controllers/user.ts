import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import mysql from 'mysql2';

export function singup(req: Request, res: Response) {
	const { email } = req.body;

	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	sqlCon.query(`select * from user where email=?`, email, (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		if (result.length != 0) return res.status(400).json({ msg: 'Tài khoản đã tồn tại' });

		const hashedPass = bcrypt.hashSync(req.body.password, 10);
		let fields: string[] = [];
		let values: string[] = [];
		for (const [key, value] of Object.entries(req.body)) {
			if (!value) continue;
			fields.push(key);
			if (key == 'password') {
				values.push(sqlCon.escape(hashedPass));
				continue;
			}
			values.push(sqlCon.escape(value));
		}
		if (req.file) {
			fields.push('profile_pic');
			values.push(sqlCon.escape(`/img/profile/${req.file.filename}`));
		}
		fields.push('create_at');
		values.push(sqlCon.escape(new Date().toISOString().replace('T', ' ').replace('Z', '')));
		sqlCon.query(`insert into user(${fields.join(',')}) values (${values.join(',')})`, (err: any, result: any) => {
			if (err) return res.status(400).json(err);
			res.status(201).json({ msg: 'ok' });
		});
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
		req.session.uid = result[0].id;
		req.session.role = result[0].role;
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
	if (req.session.role != 'admin' && id != req.session.uid) {
		return res.sendStatus(403);
	}
	const sqlCon = req.app.locals.sqlCon;
	let cols = '';
	if (req.file) {
		cols += `profile_pic="/img/profile/${req.file.filename}", `;
	}
	for (let key in req.body) {
		let value: string;
		//change password
		if (key == 'oldPassword') continue;
		if (key == 'password') {
			const { oldPassword, password } = req.body;
			if (
				req.session.role !== 'admin' && //@ts-ignore
				(id !== req.session.uid || !bcrypt.compareSync(oldPassword, result[0].password))
			) {
				return res.status(403).json({ msg: 'Thông tin không chính xác!' });
			}
			value = sqlCon.escape(bcrypt.hashSync(password, 10));
		} else {
			value = sqlCon.escape(req.body[key]);
		}

		cols += `${key}=${value}, `;
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
export function list(req: Request, res: Response) {
	let { s, skip, limit, orderby, sortby, role } = req.query;

	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	let query = 'select count(*) OVER() as total,user.* from user ';
	if (role || s) query += 'where ';
	//if (s) query += `match(name, email, phone) against (${sqlCon.escape(s)}) `;
	if (s) query += `name like (${sqlCon.escape(`%${s}%`)}) `;
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
	if (req.session.role != 'admin' && id != req.session.uid) {
		return res.sendStatus(403);
	}
	sqlCon.query(
		`select id, name, dob, email, phone, gender, profile_pic, role, address, city, state, country, zip from user where id=?`,
		[id],
		(err: any, result: any) => {
			if (err) return res.status(400).json(err);
			res.json(result[0]);
		}
	);
}
export function removeuser(req: Request, res: Response) {
	const { id } = req.params;
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	if (req.session.role != 'admin' && id != req.session.uid) {
		return res.sendStatus(403);
	}
	sqlCon.query(`delete from user where id=?`, [id], (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		res.json({ msg: 'ok' });
	});
}
