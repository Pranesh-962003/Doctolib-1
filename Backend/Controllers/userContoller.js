import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../Models/UserModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../Models/DoctorModel.js'
import appointmentModel from '../Models/AppointmentModel.js'

//  API TO REGISTER

const registerUser = async (req, res) => {


    try {

        const { name, email, password } = req.body

        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing details in form" })
        }
        // validating email format

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Mail is not Proper" })
        }

        // validating password

        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a strong Password" })
        }

        //  hassing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name, email, password: hashedPassword
        }


        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETE)

        res.json({ success: true, token })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}



// API for USer Login

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User Dose not Exist" });

        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETE)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "invalid password" })
        }

    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })


    }


}


// get profile
const getProfile = async (req, res) => {
    try {

        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        return res.json({ success: true, userData })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// api to update user
const updateProfile = async (req, res) => {
    try {

        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file


        if (!name || !phone || !address || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if(imageFile){
            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId,{image:imageURL})
        }

        res.json({success:true,message:"Profile Updated"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}



// API to book appointment

const bookappointment = async (req, res)=>{
    try {
        
        const {userId, docId, slotDate, slotTime}= req.body

        const docData = await doctorModel.findById(docId).select('-password')

        if(!docData.available){
            return res.json({success:false, message:"Doctor Not Availabel"})
        }


        let slots_booked = docData.slots_booked

        // CHECKING FOR SLOTS AVAILABILITY
       if(slots_booked[slotDate]){
        if(slots_booked[slotDate].includes(slotTime)){
            return res.json({success:false, message:"Slot is already taken"})
         }else{
            slots_booked[slotDate].push(slotTime)
         }
       } else{
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
       }

        const userData = await userModel.findById(userId).select('-password')
        delete docData.slots_booked


        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount:docData.fees,
            slotTime,
            slotDate,
            date: Date.now()


        }

        const newAppointment = new appointmentModel(appointmentData)

        await newAppointment.save()

        // Save new slots data in doctors data
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true, message:"Appointment Booked"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}



// API to user appointmesnts for frontend

const listAppointments = async (req, res) =>{

    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({userId})

        res.json({success:true, appointments})
        
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }


}

// API to cancel Appointment

const cancelAppointment = async(req,res) =>{

    try {

        const {userId, appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)


        //Verify appointment cancel
        if(appointmentData.userId !== userId){
            return res.json({success:false, message:"un authorised action"})
        }


        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

        // releasing doctors Slots

        const {docId, slotDate, slotTime} = appointmentData

        const doctorData = await doctorModel.findById(docId)


        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e=>e !==slotTime)

        await doctorModel.findByIdAndUpdate(docId, {slots_booked})

        res.json({success:true, message:"Appointmen Cancelled"})

        
    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })
        
    }

}

// const razorpayInstance = new razorpay(
//     {
//         key_id:'',
//         key_secret:''
//     }
// )

// // API to make payment for appointment

// const paymentRazorpay = async(req,res)=>{



// }




export { registerUser, loginUser, getProfile, updateProfile, bookappointment, listAppointments, cancelAppointment }