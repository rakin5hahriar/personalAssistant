import express from 'express';
import { 
    getAllUsers, 
    getUserById, 
    updatePassword, 
    deleteUser, 
    getUserStats, 
    searchUsers, 
    updatePreferences,
    getCurrentUser,
    uploadUserImage
} from '../controllers/user.controllers.js';
import isAuth from '../middlewares/isAuth.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

// All user routes require authentication
userRouter.use(isAuth);

// User management routes
userRouter.get('/current', getCurrentUser);               // GET /api/users/current
userRouter.get('/stats', getUserStats);                    // GET /api/users/stats
userRouter.put('/password', updatePassword);              // PUT /api/users/password
userRouter.delete('/delete-account', deleteUser);         // DELETE /api/users/delete-account
userRouter.put('/preferences', updatePreferences);        // PUT /api/users/preferences
userRouter.post('/upload-image', upload.single('image'), uploadUserImage);  // POST /api/users/upload-image

// Admin routes (you might want to add admin middleware later)
userRouter.get('/all', getAllUsers);                      // GET /api/users/all
userRouter.get('/search', searchUsers);                   // GET /api/users/search?query=...
userRouter.get('/:id', getUserById);                      // GET /api/users/:id

export default userRouter;
