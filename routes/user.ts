import { Router } from 'express';
import * as userController from '../controllers/user';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './public/img/profile');
	},
	filename: (req, file, cb) => {
		//@ts-ignore
		cb(null, req.session.uid + Date.now() + path.extname(file.originalname));
	},
});
const upload = multer({ storage });
const route = Router();

route.post('/login', userController.login);
route.get('/logout', userController.logout);
route.post('/', userController.singup);
route.get('/', userController.list);
route.put('/:id', upload.single('profile_pic'), userController.update);
route.get('/:id', userController.getuser);

export default route;