import { NextFunction, Request, Response } from 'express';
import mysql from 'mysql2';

export function teacher(req: Request, res: Response, next: NextFunction) {
	const { id } = req.params;
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	//@ts-ignore
	sqlCon.query('select * from class where id=? and teacher_id=?', [id, req.session.uid], (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		if (!result.length) return res.status(403);

		next();
	});
}
export function headDepartment(req: Request, res: Response, next: NextFunction) {
	const { sid } = req.body;
	const { id } = req.params;
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	const query = sid
		? 'select s.id from subject s, department d where s.id=? and s.did=d.id and d.dhead_id=?'
		: 'select * from class c, subject s, department d where c.id=? and c.sid=s.id and s.did=d.id and d.dhead_id=?';
	const firstParam = sid ? sid : id;
	console.log(query);
	sqlCon.query(
		query,
		[
			firstParam, //@ts-ignore
			req.session.uid,
		],
		(err: any, result: any) => {
			if (err) return res.status(400).json(err);
			if (!result.length) res.sendStatus(403);
			next();
		}
	);
}
