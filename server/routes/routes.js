import express from 'express';
import multer from 'multer';
import { uploadImage, getImage } from '../controller/image-controller.js';

const router = express.Router();
const upload = multer({ dest: 'uploads' })


router.post('/upload', upload.single('file'), uploadImage);
router.get('/file/:fileId', getImage);

export default router;