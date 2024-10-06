// backend/src/routes/userRoutes.ts

import express from 'express';
import multer from 'multer';
import { addUser, getAllUser, getUser, updateUser } from '../controllers/userController';

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PNG, JPG, JPEG, and PDF are allowed.'));
    }
  },
});

// Routes
router.post(
  '/',
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'appointmentLetter', maxCount: 1 },
  ]),
  addUser
);

router.get('/:id', getUser);

router.get('/users/getall', getAllUser);

router.put(
  '/:id',
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'appointmentLetter', maxCount: 1 },
  ]),
  updateUser
);

export default router;
