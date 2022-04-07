import { Router } from 'express';
import * as departmentController from '../controllers/department';
import isAdmin from '../middleware/isAdmin';
import auth from '../middleware/auth';

const route = Router();

route.post('/', auth, isAdmin, departmentController.add);
route.get('/', auth, departmentController.list);
route.put('/:id', auth, isAdmin, departmentController.update);
route.get('/:id', auth, isAdmin, departmentController.getdepartment);
route.delete('/:id', auth, isAdmin, departmentController.remove);

export default route;
