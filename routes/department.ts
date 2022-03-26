import { Router } from 'express';
import * as departmentController from '../controllers/department';

const route = Router();

route.post('/', departmentController.add);
route.get('/', departmentController.list);
route.put('/:id', departmentController.update);
route.get('/:id', departmentController.getdepartment);

export default route;
