import { Request, Response } from 'express';

export function add(req: Request, res: Response) {
	const { dname, dhead_id } = req.body;
	const { sqlCon } = req.app.locals;
	sqlCon.query(
		`insert into department(dname, dhead_id) values (${dname}, ${dhead_id})`,
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
		`delete from department where id=${id}`,
		(err: any, result: any) => {
			if (err) return res.status(400).json(err);
			res.json({ msg: 'ok' });
		}
	);
}
export function update(req: Request, res: Response) {
	const { id } = req.params;
	const sqlCon = req.app.locals.sqlCon;
	let cols = '';
	for (let key in req.body) {
		if (typeof req.body[key] == 'string') {
			cols += `${key}="${req.body[key]}", `;
			break;
		}
		cols += `${key} = ${req.body[key]}, `;
	}

	cols = cols.slice(0, cols.length - 2);
	sqlCon.query(
		`update user set ${cols} where id=${id}`,
		(err: any, result: any) => {
			if (err) return res.status(400).json(err);
			res.json({ msg: 'ok' });
		}
	);
}
export function list(req: Request, res: Response) {
	let { skip, limit, s } = req.query;
	const sqlCon = req.app.locals.sqlCon;
	skip = skip ? skip : '0';
}
