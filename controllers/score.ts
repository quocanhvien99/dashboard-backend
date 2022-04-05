import { Request, Response } from 'express';
import mysql from 'mysql2';

export function update(req: Request, res: Response) {
	const { uid, cid, score } = req.body;
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;

	sqlCon.query('update class_member set score=? where sid=? and cid=?', [score, uid, cid], (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		return res.json({ msg: 'ok' });
	});
}
export function list(req: Request, res: Response) {
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	const { skip, limit, orderby, sortby, cid } = req.query;
	let query = '';
	query = `select count(*) OVER() as total, score, c.semester, su.name as subjectName from score s, class c, subject su where s.cid=c.id and c.sid=su.id and s.uid=${sqlCon.escape(
		req.session.uid
	)} `;
	if (sortby) query += `order by ${sortby} `;
	if (orderby) query += `${orderby} `;
	if (limit) query += `limit ${parseInt(limit as string)} `;
	if (skip) query += `offset ${parseInt(skip as string)} `;
	sqlCon.query(query, (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		res.json(result);
	});
}
