import { Request, Response } from 'express';
import mysql from 'mysql2';

export function statistic(req: Request, res: Response) {
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	let query = '';
	if (req.session.role == 'admin') {
		query = `SELECT COUNT(*) total, role from user group by role UNION SELECT COUNT(*) total, 'department' role from department UNION SELECT COUNT(*) total, 'subject' role from subject`;
	}
	if (req.session.role == 'teacher') {
		query = `select count(distinct c.id) as class, count(distinct ct.id) lesson, count(distinct cm.sid, cm.cid) student, ( select sum(duration)/3600 as total_hour from ( SELECT TIMESTAMPDIFF(second,ct.start, ct.end) duration from class_time ct, class c where ct.cid=c.id and c.teacher_id=${req.session.uid} ) as temp ) as total_hour from class c, class_member cm, class_time ct where c.teacher_id=${req.session.uid} and c.id=cm.cid and c.id=ct.cid`;
	}
	if (req.session.role == 'student') {
		query = ``;
	}
	sqlCon.query(query, (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		return res.json(result);
	});
}
export function getActivityStatistic(req: Request, res: Response) {
	const { year } = req.query;
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	sqlCon.query(
		'select year(a.at) year, month(a.at) month, u.role, count(distinct(a.uid)) total from activity a, user u where a.uid=u.id group by year, month, u.role having year=?',
		[year],
		(err: any, result: any) => {
			if (err) return res.status(400).json(err);
			let data: any = { teacher: [], student: [], admin: [] };
			result.map((x: { month: string; role: string; total: number }, i: number) => {
				data[x.role][i] = x.total;
			});
			for (let i = 0; i < 12; i++) {
				data.teacher[i] = data.teacher[i] ? data.teacher[i] : 0;
				data.student[i] = data.student[i] ? data.student[i] : 0;
			}
			res.json(data);
		}
	);
}
