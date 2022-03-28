import { Router } from 'express';
import * as classController from '../controllers/class';
import * as classMiddleware from '../middleware/class';

const route = Router();

route.post('/', classMiddleware.headDepartment, classController.add);
route.get('/', classController.listClass);
route.delete('/:id', classMiddleware.headDepartment, classController.remove);
route.put('/:id', classMiddleware.headDepartment, classController.update);
route.post('/:id/member/', classMiddleware.teacher, classController.addMember);
route.get('/:id/member', classMiddleware.teacher, classController.listMember);
route.delete('/:id/member/:sid', classMiddleware.teacher, classController.removeMember);
route.post('/:id/time/', classMiddleware.teacher, classController.addTime);
route.get('/:id/time/', classMiddleware.teacher, classController.listTime);
route.delete('/:id/time/:tid', classMiddleware.teacher, classController.removeTime);

export default route;
