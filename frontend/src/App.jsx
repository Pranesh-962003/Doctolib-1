import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Doctor from './Pages/Doctor'
import Login from './Pages/Login'
import About from './Pages/About'
import Contact from './Pages/Contact'
import Myprofile from './Pages/Myprofile'
import Myappointment from './Pages/Myappointment'
import Appointment from './Pages/Appointment'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]' >
      <ToastContainer/>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/doctors/:speciality' element={<Doctor/>}/>
        <Route path='/doctors' element={<Doctor/>}/>
        <Route path="/doctors/:speciality" element={<Doctor/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/my-profile' element={<Myprofile/>}/>
        <Route path='/my-appointment' element={<Myappointment/>}/>
        <Route path='/appointment' element={<Appointment/>}/>
        <Route path='/appointment/:docId' element={<Appointment/>}/>
      </Routes>
      <Footer/>
      

    </div>
  )
}

export default App