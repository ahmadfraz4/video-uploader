import express from 'express';
import { getCurrentUser, isUsernameExist, loginUser, logout, registerUser } from '../controllers/user.controller.js';
import { deletePost } from '../controllers/video-upload.control.js';
import { auth } from '../middlewares/auth.middleware.js';
let router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/getUser').get(auth,getCurrentUser);
router.route('/logout').get(auth,logout);

router.route('/checkUser').post(isUsernameExist);

export default router