import { Request, Response } from 'express';
import mysql from 'mysql2';

//head department
export function add(req: Request, res: Response) {
	const { sid, teacher_id, semester } = req.body;
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	sqlCon.query(
		`insert into class(sid, teacher_id, semester) values (?, ?, ?)`,
		[sid, teacher_id, semester],
		(err: any, result: any) => {
			if (err) return res.status(400).json(err);
			res.json({ msg: 'ok' });
		}
	);
}
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
export function listClass(req: Request, res: Response) {
	let { skip, limit, orderby, sortby, sid } = req.query;

	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	let query = '';
	if (req.session.role == 'teacher')
		if (sid)
			query = `select count(*) OVER() as total, c.id, c.semester,u.name as tname from class c, user u where c.teacher_id=u.id and c.sid=${sqlCon.escape(
				sid
			)} `;
		else {
			query = `select count(*) OVER() as total, c.id, c.semester,s.name sname, u.name tname, d.dname dname from class c, subject s, user u, department d where c.teacher_id=${sqlCon.escape(
				//@ts-ignore
				req.session.uid
			)} and c.sid=s.id and c.teacher_id=u.id and s.did=d.id `;
		}
	if (req.session.role == 'student')
		query = `select count(*) OVER() as total, c.id as id, s.name as sname, u.name as tname from class c, subject s, user u, class_member cm where cm.sid=${sqlCon.escape(
			//@ts-ignore
			req.session.uid
		)} and c.sid=s.id and c.teacher_id=u.id and cm.cid=c.id  `;
	if (query.length == 0) return res.sendStatus(403);
	if (sortby) query += `order by ${sortby} `;
	if (orderby) query += `${orderby} `;
	if (limit) query += `limit ${parseInt(limit as string)} `;
	if (skip) query += `offset ${parseInt(skip as string)} `;
	sqlCon.query(query, (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		res.json(result);
	});
}
//class teacher
export function addMember(req: Request, res: Response) {
	const { id } = req.params;
	const { sid } = req.body;
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;

	sqlCon.query('insert into class_member(sid,cid) values (?, ?)', [sid, id], (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		return res.json({ msg: 'ok' });
	});
}
export function removeMember(req: Request, res: Response) {
	const { id, sid } = req.params;
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;

	sqlCon.query('delete from class_member where sid=? and cid=?', [sid, id], (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		return res.json({ msg: 'ok' });
	});
}
export function listMember(req: Request, res: Response) {
	let { orderby, sortby } = req.query;
	let { id } = req.params;

	const sqlCon: mysql.Connection = req.app.locals.sqlCon;

	let query = `select u.id, u.name, u.gender, u.dob, u.phone, cm.score from class_member cm, user u where cm.cid=${id} and cm.sid=u.id `;
	if (sortby) query += `order by ${sortby} `;
	if (orderby) query += `${orderby} `;
	sqlCon.query(query, (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		res.json(result);
	});
}
export function addTime(req: Request, res: Response) {
	const { start, end } = req.body;
	const cid = req.params.id;
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	//ktra trùng lịch dạy
	sqlCon.query(
		'select * from class_time as CT, class as C where CT.cid=C.id and C.teacher_id=? and ((? between CT.start and CT.end) or (? between CT.start and CT.end))',
		//@ts-ignore
		[req.session.uid, start, end],
		(err: any, result: any) => {
			if (err) return res.status(400).json(err);
			if (result.length) return res.status(400).json({ error: 'Trùng lịch dạy' });

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
export function listTime(req: Request, res: Response) {
	let { skip, limit, start, end, orderby, sortby } = req.query;
	let { id } = req.params;

	const sqlCon: mysql.Connection = req.app.locals.sqlCon;

	let query = `select * from class_time where cid=${sqlCon.escape(id)} `;
	if (start) query += `and start >= ${sqlCon.escape(start)} `;
	if (end) query += `and end <= ${end} `;
	if (sortby) query += `order by ${sortby} `;
	if (orderby) query += `${orderby} `;
	if (limit) query += `limit ${parseInt(limit as string)} `;
	if (skip) query += `offset ${parseInt(skip as string)} `;
	sqlCon.query(query, (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		res.json(result);
	});
}
export function removeTime(req: Request, res: Response) {
	const { tid } = req.params;
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	//@ts-ignore
	sqlCon.query('delete from class_time where id=?', [tid], (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		return res.json({ msg: 'ok' });
	});
}
