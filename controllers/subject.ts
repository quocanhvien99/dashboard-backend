import { Request, Response } from 'express';
import mysql from 'mysql2';

export function add(req: Request, res: Response) {
	const { name, id, did } = req.body;
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	sqlCon.query(`insert into subject(id, name, did) values (?, ?, ?)`, [id, name, did], (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		res.json({ msg: 'ok' });
	});
}
export function remove(req: Request, res: Response) {
	const { id } = req.params;
	const { sqlCon } = req.app.locals;
	sqlCon.query(
		`delete from subject where id=?`,
		//@ts-ignore
		[id, sqlCon.escape(req.session.uid)],
		(err: any, result: any) => {
			if (err) return res.status(400).json(err);
			res.json({ msg: 'ok' });
		}
	);
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
		sqlCon.query(
			`update subject set ${cols} where id=?`,
			//@ts-ignore
			[id, sqlCon.escape(req.session.uid)],
			(err: any, result: any) => {
				if (err) return res.status(400).json(err);
				return res.json({ msg: 'ok' });
			}
		);
	} else {
		res.json({ msg: 'ok' });
	}
}
export function list(req: Request, res: Response) {
	let { s, skip, limit, orderby, sortby } = req.query;

	const sqlCon: mysql.Connection = req.app.locals.sqlCon;

	let query = `select count(*) OVER() as total, S.id, S.name, D.dname from subject as S, department as D where S.did=D.id and dhead_id=${sqlCon.escape(
		//@ts-ignore
		req.session.uid
	)} `;
	if (s) query += `and name like "${sqlCon.escape(`%${s}%`)}" `;
	if (sortby) query += `order by ${sortby} `;
	if (orderby) query += `${orderby} `;
	if (limit) query += `limit ${parseInt(limit as string)} `;
	if (skip) query += `offset ${parseInt(skip as string)} `;
	sqlCon.query(query, (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		res.json(result);
	});
}
export function getsubject(req: Request, res: Response) {
	const { id } = req.params;
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	sqlCon.query(
		`select S.id, S.name, D.dname as dname from subject as S, department as D where S.id=? and S.did=D.id`,
		[id],
		(err: any, result: any) => {
			if (err) return res.status(400).json(err);
			res.json(result[0]);
		}
	);
}
