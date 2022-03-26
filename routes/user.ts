import { Router } from 'express';
import * as userController from '../controllers/user';
import multer from 'multer';

const upload = multer({ dest: '../public/img' });
const route = Router();

route.post('/login', userController.login);
route.post('/', userController.singup);
route.get('/', userController.list);
route.put('/:id', upload.single('profile_pic'), userController.update);

export default route;
