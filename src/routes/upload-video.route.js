import express from 'express';
import { VideoUpload, getData, getAllPost, getVideoData, deletePost,getAuthorPost } from '../controllers/video-upload.control.js';
import {upload} from '../middlewares/multer.middleware.js';
import { auth } from '../middlewares/auth.middleware.js';
let router = express.Router();

router.route('/video').post(auth,upload.fields([{name : 'video', maxCount : 1}]),VideoUpload)
router.route('/get-all-video').get(getAllPost)
router.route('/get-video-data/:id').get(getVideoData);
router.route('/get-video1/:id').get(getData)
router.route('/delete-post/:id').delete(auth,deletePost);
router.route('/getAuthorPost').get(auth,getAuthorPost);

export default router;