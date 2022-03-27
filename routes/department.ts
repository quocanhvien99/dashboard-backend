import { Router } from 'express';
import * as departmentController from '../controllers/department';
import checkAdmin from '../middleware/checkAdmin';

const route = Router();

route.post('/', checkAdmin, departmentController.add);
route.get('/', checkAdmin, departmentController.list);
route.put('/:id', checkAdmin, departmentController.update);
route.get('/:id', checkAdmin, departmentController.getdepartment);

export default route;
