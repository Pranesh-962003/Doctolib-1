import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './Config/Mongodb.js';
import connectClodinary from './Config/Cloudinary.js';
import adminRouter from './Routes/AdminRout.js';
import doctorRouter from './Routes/DoctorRout.js';
import userRouter from './Routes/userRoute.js';

//app config


const app = express();
const port = process.env.PORT || 4000;
connectDB()
connectClodinary();
// middlewares

app.use(express.json())
app.use(cors());

// api endpoint

app.use('/api/admin',adminRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)

app.get('/',(req,res)=>{
    res.send('Api working great')
})

app.listen(port,()=>{
    console.log('working in port ' + port);
    
})