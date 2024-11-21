import express from 'express'
import { registerUser, loginUser, getProfile, updateProfile, bookappointment ,listAppointments , cancelAppointment} from '../Controllers/userContoller.js'
import authUser from '../Middlewares/authUser.js';
import upload from '../Middlewares/Multer.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookappointment)
userRouter.get('/appointments',authUser,listAppointments)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)

export default userRouter;