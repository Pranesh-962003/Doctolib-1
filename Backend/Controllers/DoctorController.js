import doctorModel from "../Models/DoctorModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../Models/AppointmentModel.js"

const changeAvailability = async (req, res) => {

    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })
        res.json({ success: true, message: "Availability Changed" })


    } catch (error) {


        console.log(err)
        res.json({ success: false, message: err.messae })

    }

}


const doctorList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password', '-email'])

        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.messae })
    }
}


// Api for Doctor Login

const loginDoctor = async (req, res) => {
    try {

        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.json({ success: false, messae: "Invalid Credentials" })
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {

            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRETE);
            res.json({ success: true, token })

        } else {
            res.json({ success: false, messae: "Invalid Credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.messae })
    }
}

//API to get Poointmentas for Doctor pannel 

const appointmentsDoctor = async (req, res) => {

    try {

        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }


}

// Api to mark appointment completed

const appointmentComplete = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, { iscompleted: true })
            return res.json({ success: true, message: "Appointment Completed" })

        } else {
            return res.json({ success: false, message: "Mark failed" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}






// Api to cancel appointment completed

const appointmentCancel = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {

            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: "cancelation Completed" })

        } else {
            return res.json({ success: false, message: "cancellation failed" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// api to doc dashboard

const doctorDashboard = async (req, res) => {
    try {
        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.iscompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })


        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latesAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({ success: true, dashData })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// API to get Doctor PRofile

const doctorProfile = async (req, res) => {
    try {

        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}



// APIT to Update Doctor Data

const updateDoctorProfile = async (req, res) => {
    try {
        const { docId, fees, address, available } = req.body

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })


        res.json({ success: true, message: "profile Updated" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


export { changeAvailability, doctorList, loginDoctor, appointmentsDoctor, appointmentCancel, appointmentComplete, doctorDashboard, doctorProfile, updateDoctorProfile }