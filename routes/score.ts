import { Router } from 'express';
import * as scoreController from '../controllers/score';
import * as scoreMiddleware from '../middleware/score';

const route = Router();

route.put('/', scoreMiddleware.teacher, scoreController.update);
route.get('/', scoreMiddleware.student, scoreController.list);

export default route;
