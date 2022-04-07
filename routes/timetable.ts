import { Router } from 'express';
import * as timetableController from '../controllers/timetable';
import auth from '../middleware/auth';

const route = Router();

route.get('/', auth, timetableController.listTime);

export default route;
