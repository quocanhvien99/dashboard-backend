import { Router } from 'express';
import * as userController from '../controllers/user';

const route = Router();

route.post('/login', userController.login);
route.post('/', userController.singup);
route.put('/:id', userController.update);

export default route;
