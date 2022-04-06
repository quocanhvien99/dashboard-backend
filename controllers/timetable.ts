import { Request, Response } from 'express';
import mysql from 'mysql2';

export function listTime(req: Request, res: Response) {
	let { skip, limit, start, end } = req.query;

	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	let query = '';
	if (req.session.role == 'teacher')
		query = `select c.id cid, s.name sname, ct.start, ct.end from class_time ct, class c, subject s where ct.cid=c.id and c.teacher_id=${req.session.uid} and c.sid=s.id `;
	if (req.session.role == 'student')
		query = `select c.id cid, s.name sname, ct.start, ct.end from class_time ct, class c, class_member cm, subject s where cm.sid=${req.session.uid} and cm.cid=c.id and c.id=ct.cid and c.sid=s.id `;

	if (start) query += `and start >= ${sqlCon.escape(start)} `;
	if (end) query += `and end <= ${end} `;
	if (limit) query += `limit ${parseInt(limit as string)} `;
	if (skip) query += `offset ${parseInt(skip as string)} `;
	sqlCon.query(query, (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		res.json(result);
	});
}
