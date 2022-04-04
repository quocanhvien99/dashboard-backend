import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
	if (req.session.role !== 'admin') return res.sendStatus(403);
	next();
};
