import { Router } from 'express';
import * as timetableController from '../controllers/timetable';

const route = Router();

route.get('/', timetableController.listTime);

export default route;
