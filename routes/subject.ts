import { Router } from 'express';
import * as subjectController from '../controllers/subject';
import subjectMiddleware from '../middleware/subject';

const route = Router();

route.post('/', subjectMiddleware, subjectController.add);
route.get('/', subjectMiddleware, subjectController.list);
route.put('/:id', subjectMiddleware, subjectController.update);
route.get('/:id', subjectMiddleware, subjectController.getsubject);
route.delete('/:id', subjectMiddleware, subjectController.remove);

export default route;
