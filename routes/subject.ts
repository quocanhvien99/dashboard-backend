import { Router } from 'express';
import * as subjectController from '../controllers/subject';
import subjectMiddleware from '../middleware/subject';
import auth from '../middleware/auth';

const route = Router();

route.post('/', auth, subjectMiddleware, subjectController.add);
route.get('/', auth, subjectMiddleware, subjectController.list);
route.put('/:id', auth, subjectMiddleware, subjectController.update);
route.get('/:id', auth, subjectMiddleware, subjectController.getsubject);
route.delete('/:id', auth, subjectMiddleware, subjectController.remove);

export default route;
