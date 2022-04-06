import { Request, Response, NextFunction } from 'express';
import mysql from 'mysql2';

export default (req: Request, res: Response, next: NextFunction) => {
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	if (!req.session.uid) return next();
	sqlCon.query(
		'insert into activity(uid, endpoint, at) values (?, ?, ?)',
		[req.session.uid, req.path, new Date().toISOString().replace('T', ' ').replace('Z', '')],
		(err: any, result: any) => {
			if (err) return res.status(400).json(err);
			next();
		}
	);
};
