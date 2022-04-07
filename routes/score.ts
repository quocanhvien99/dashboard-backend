import { Router } from 'express';
import * as scoreController from '../controllers/score';
import * as scoreMiddleware from '../middleware/score';
import auth from '../middleware/auth';

const route = Router();

route.put('/', auth, scoreMiddleware.teacher, scoreController.update);
route.get('/', auth, scoreMiddleware.student, scoreController.list);

export default route;
