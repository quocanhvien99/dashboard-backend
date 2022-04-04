import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
	const { sqlCon } = req.app.locals;
	sqlCon.query(
		'select role from user where user.id=?', //@ts-ignore
		[req.session.uid],
		(err: any, result: any) => {
			if (err) return res.status(400).json(err);
			if (!result.length) return res.sendStatus(403);
			//@ts-ignore
			if (result[0].role !== 'admin') return res.sendStatus(403);
			next();
		}
	);
};
