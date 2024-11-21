import express from "express";
import { addDoctor, allDoctors, loginAdmin , appointmentsAdmin, appointmentCancel, adminDashboard} from "../Controllers/AdminController.js";
import upload from "../Middlewares/Multer.js";
import authAdmin from "../Middlewares/AuthAdmin.js";
import { changeAvailability,  } from "../Controllers/DoctorController.js";


const adminRouter = express.Router();

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availability',authAdmin,changeAvailability)
adminRouter.get('/appointments',authAdmin,appointmentsAdmin)
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel)
adminRouter.get('/dashboard',authAdmin,adminDashboard)


export default adminRouter