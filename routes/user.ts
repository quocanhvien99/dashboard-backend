import { Router } from 'express';
import * as userController from '../controllers/user';
import multer from 'multer';
import path from 'path';
import auth from '../middleware/auth';

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public/img/profile');
	},
	filename: (req, file, cb) => {
		//@ts-ignore
		cb(null, Math.round(Math.random() * 1000) + Date.now() + path.extname(file.originalname));
	},
});
const upload = multer({ storage });
const route = Router();

route.post('/login', userController.login);
route.get('/logout', userController.logout);
route.post('/', upload.single('profile_pic'), userController.singup);
route.get('/', auth, userController.list);
route.put('/:id', auth, upload.single('profile_pic'), userController.update);
route.get('/:id', auth, userController.getuser);
route.delete('/:id', auth, userController.removeuser);
route.post('/forget', userController.forgetPassword);
route.post('/reset', userController.resetPassword);

export default route;
