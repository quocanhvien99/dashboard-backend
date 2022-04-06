import { Router } from 'express';
import * as statisticController from '../controllers/statistic';

const route = Router();

route.get('/', statisticController.statistic);
route.get('/activity', statisticController.getActivityStatistic);

export default route;
