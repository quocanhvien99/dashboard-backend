import { Router } from 'express';
import * as statisticController from '../controllers/statistic';
import auth from '../middleware/auth';

const route = Router();

route.get('/', auth, statisticController.statistic);
route.get('/activity', auth, statisticController.getActivityStatistic);

export default route;
