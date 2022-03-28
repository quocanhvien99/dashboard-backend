import { Request, Response } from 'express';
import mysql from 'mysql2';

//head department
export function add(req: Request, res: Response) {
	const { sid, teacher_id } = req.body;
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	sqlCon.query(`insert into class(sid, teacher_id) values (?, ?)`, [sid, teacher_id], (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		res.json({ msg: 'ok' });
	});
}
//head department
export function remove(req: Request, res: Response) {
	const { id } = req.params;
	const { sqlCon } = req.app.locals;
	sqlCon.query(
		`delete from class where id=?`,
		//@ts-ignore
		[id, sqlCon.escape(req.session.uid)],
		(err: any, result: any) => {
			if (err) return res.status(400).json(err);
			res.json({ msg: 'ok' });
		}
	);
}
//head department
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
			`update class set ${cols} where id=?`,
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
//class teacher
export function addMember(req: Request, res: Response) {
	const { sid, cid } = req.body;
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;

	sqlCon.query('insert into class_member values (?, ?)', [sid, cid], (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		return res.json({ msg: 'ok' });
	});
}
//class teacher
export function addTime(req: Request, res: Response) {
	const { cid, start, end } = req.body;
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	//ktra trùng lịch dạy
	sqlCon.query(
		'select * from class_time as CT, class as C where CT.cid=C.id and C.teacher_id=? and ((? between C.start and C.end) or (? between C.start and C.end))',
		//@ts-ignore
		[req.session.uid, start, end],
		(err: any, result: any) => {
			if (err) return res.status(400).json(err);
			if (!result.length) return res.status(400).json({ error: 'Trùng lịch dạy' });
			sqlCon.query(
				'insert into class_time(start, end, cid) values (?, ?, ?)',
				[start, end, cid],
				(err: any, result: any) => {
					if (err) return res.status(400).json(err);
					res.json({ msg: 'ok' });
				}
			);
		}
	);
}