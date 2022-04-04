import { Router } from 'express';
import * as departmentController from '../controllers/department';
import isAdmin from '../middleware/isAdmin';

const route = Router();

route.post('/', isAdmin, departmentController.add);
route.get('/', departmentController.list);
route.put('/:id', isAdmin, departmentController.update);
route.get('/:id', isAdmin, departmentController.getdepartment);
route.delete('/:id', isAdmin, departmentController.remove);

export default route;
