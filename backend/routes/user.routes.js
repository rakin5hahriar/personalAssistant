import express from 'express';

const userRouter = express.Router();


userRouter.post('/signup', signUp);
userRouter.post('/login', Login);
userRouter.get('/logout', Logout);

export default userRouter;