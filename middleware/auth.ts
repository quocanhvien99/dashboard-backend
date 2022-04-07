import { Request, Response, NextFunction } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
	if (!req.session.uid) return res.sendStatus(401);
	next();
};
