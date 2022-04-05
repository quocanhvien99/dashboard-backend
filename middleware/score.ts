import { Request, Response, NextFunction } from 'express';
import mysql from 'mysql2';

export const teacher = (req: Request, res: Response, next: NextFunction) => {
	const { cid } = req.body;
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;

	if (req.session.role === 'teacher') {
		sqlCon.query(
			'select * from class where id=? and teacher_id=?',
			//@ts-ignore
			[cid, req.session.uid],
			(err: any, result: any) => {
				if (err) return res.status(400).json(err);
				if (!result.length) return res.sendStatus(403);
				next();
			}
		);
		return;
	}
	res.sendStatus(403);
};
export const student = (req: Request, res: Response, next: NextFunction) => {
	if (req.session.role == 'student') return next();
	res.sendStatus(403);
};
