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
		cols += `${key} = "${req.body[key]}", `;
	}

	cols = cols.slice(0, cols.length - 2);
	if (cols.length !== 0) {
		sqlCon.query(
			`update user set ${cols} where id=${id}`,
			(err: any, result: any) => {
				if (err) return res.status(400).json(err);
			}
		);
	}
	res.json({ msg: 'ok' });
}
export function list(req: Request, res: Response) {
	let { s, skip, limit, orderby, sortby } = req.query;
	let query =
		'select D.id as id, dname, U.name as dhead from department as D left join user as D on D.dhead_id=U.id ';
	if (s) query += `where D.name like "%${s}%" `;
	if (limit) query += `limit ${limit} `;
	if (skip) query += `offset ${skip} `;
	if (orderby) query += `order by ${orderby} `;
	if (sortby) query += `${sortby} `;

	const sqlCon = req.app.locals.sqlCon;
	sqlCon.query(query, (err: any, result: any) => {
		if (err) return res.status(400).json(err);
		res.json(result);
	});
}
export function getdepartment(req: Request, res: Response) {
	const { id } = req.params;
	const sqlCon = req.app.locals.sqlCon;
	sqlCon.query(
		`select D.id as id, dname, U.name as dhead, C.name as cname, C.id as cid from user as U, department as D, course as C where D.id=${id} and D.dhead_id=U.id and D.id=C.did`,
		(err: any, result: any) => {
			if (err) return res.status(400).json(err);
			res.json(result[0]);
		}
	);
}
