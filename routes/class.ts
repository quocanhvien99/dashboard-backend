import { Router } from 'express';
import * as classController from '../controllers/class';
import * as classMiddleware from '../middleware/class';
import auth from '../middleware/auth';

const route = Router();

route.post('/', auth, classMiddleware.headDepartment, classController.add);
route.get('/', auth, classController.listClass);
route.delete('/:id', auth, classMiddleware.headDepartment, classController.remove);
route.put('/:id', auth, classMiddleware.headDepartment, classController.update);
route.post('/:id/member/', auth, classMiddleware.teacher, classController.addMember);
route.get('/:id/member', auth, classMiddleware.teacher, classController.listMember);
route.delete('/:id/member/:sid', auth, classMiddleware.teacher, classController.removeMember);
route.post('/:id/time/', auth, classMiddleware.teacher, classController.addTime);
route.get('/:id/time/', auth, classController.listTime);
route.delete('/:id/time/:tid', auth, classMiddleware.teacher, classController.removeTime);

export default route;
