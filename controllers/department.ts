import { Request, Response } from 'express';
import mysql from 'mysql2';

export function add(req: Request, res: Response) {
	const { dname, dhead_id } = req.body;
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	sqlCon.query(`insert into department(dname, dhead_id) values (?, ?)`, [dname, dhead_id], (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		res.json({ msg: 'ok' });
	});
}
export function remove(req: Request, res: Response) {
	const { id } = req.params;
	const { sqlCon } = req.app.locals;
	sqlCon.query(`delete from department where id=?`, [id], (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		res.json({ msg: 'ok' });
	});
}
export function update(req: Request, res: Response) {
	const { id } = req.params;
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	let cols = '';
	for (let key in req.body) {
		cols += `${key}=${sqlCon.escape(req.body[key])}, `;
	}

	cols = cols.slice(0, cols.length - 2);
	if (cols.length !== 0) {
		sqlCon.query(`update department set ${cols} where id=${sqlCon.escape(id)}`, (err: any, result: any) => {
			if (err) return res.status(400).json(err);
			return res.json({ msg: 'ok' });
		});
	} else {
		res.json({ msg: 'ok' });
	}
}
export function list(req: Request, res: Response) {
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	if (req.session.role == 'admin') {
		let { s, skip, limit, orderby, sortby } = req.query;
		let query =
			'select count(*) OVER() as total, D.id as id, dname, U.name as dhead from department as D left join user as U on D.dhead_id=U.id ';
		if (s) query += `where D.name like "${sqlCon.escape(`%${s}%`)}" `;
		if (sortby) query += `order by ${sortby} `;
		if (orderby) query += `${orderby} `;
		if (limit) query += `limit ${parseInt(limit as string)} `;
		if (skip) query += `offset ${parseInt(skip as string)} `;
		sqlCon.query(query, (err: any, result: any) => {
			if (err) return res.status(400).json(err);
			res.json(result);
		});
	} else if (req.session.role == 'teacher') {
		sqlCon.query('select * from department where dhead_id=?', [req.session.uid], (err: any, result: any) => {
			if (err) return res.status(400).json(err);
			res.json(result);
		});
	} else {
		res.sendStatus(403);
	}
}
export function getdepartment(req: Request, res: Response) {
	const { id } = req.params;
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	sqlCon.query(
		`select dname, U.name as dhead, D.* from user as U, department as D where D.id=? and D.dhead_id=U.id`,
		[id],
		(err: any, result: any) => {
			if (err) return res.status(400).json(err);
			res.json(result[0]);
		}
	);
}
