import { Request, Response, NextFunction } from 'express';
import mysql from 'mysql2';

export default (req: Request, res: Response, next: NextFunction) => {
	const { did } = req.body;
	const { id } = req.params;
	if (!did && !id) return next();
	const sqlCon: mysql.Connection = req.app.locals.sqlCon;
	const query = did
		? 'select id from department where id=? and dhead_id=?'
		: 'select S.id from subject as S, department as D where S.id=? and D.dhead_id=?';
	const firstParam = did ? did : id;
	sqlCon.query(
		query,
		//@ts-ignore
		[firstParam, req.session.uid],
		(err: any, result: any) => {
			if (err) return res.status(400).json(err);
			if (!result.length) return res.sendStatus(403);
			next();
		}
	);
};
