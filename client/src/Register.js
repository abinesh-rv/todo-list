import React, { useState,useEffect } from 'react'
import {RiTodoLine} from "react-icons/ri";
import {LuEye,LuEyeOff} from "react-icons/lu"
import {Link, useNavigate} from "react-router-dom"
import { Toaster, toast } from 'react-hot-toast';
import Cookie from "js-cookie"


function Register() {

  const navigate = useNavigate()

  useEffect(() => {
    if(Cookie.get("user")){
       navigate("/")
    }
})


  const [showPass,setshowPass] = useState(false)
  const [showConfirmPass,setshowConfirmPass] = useState(false)


  useEffect(() => {
    if(Cookie.get("user")){
      navigate("/")
    }
  })

  const initialForm = {
    username:"",
    email:"",
    password:"",
    confirmPassword:""
  }
  
  const [value,setvalue] = useState(initialForm)

  const handleSubmit = async (e) => {

    e.preventDefault()

    const {username,password,email} = value

    const toastError = {
      position:"bottom-right",
      duration:2000,
    }

    if(handleValidation()){ 
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/register`,{
        method:"POST",
        headers:{"Content-Type" : "application/json"},
        body:JSON.stringify({
          username,email,password
        })
      })
      const data =await res.json()
      if(!data.status){
        toast.error(data.msg,toastError)
      }
      else{
        const user = JSON.stringify(data.user)
        Cookie.set("user",user)
        navigate("/")
      }
    }
  }

  const toastError = {
    position:"bottom-right",
    duration:"4000"
  }
   
  const handleValidation = () => {
    const {username,password,confirmPassword} = value
    if(password.length < 6 ){
      toast.error("password length must be greater than 5",toastError)
      return false
    }
    else if(password !== confirmPassword){

      toast.error("password and confirm password must be same",toastError)
      return false
    }
    else if(username.length < 3 ){
      toast.error("username length must be greater than 2",toastError)
      return false
    }
    return true
    
  }

  const handleShow = (e) => {
    const id = e.currentTarget.id
    if(id === "confirmPassIcon"){
      setshowConfirmPass(!showConfirmPass)
    }else{
      setshowPass(!showPass)
    }
  }

  const handleChange = (e) => {
    setvalue({...value,[e.target.name]:e.target.value})
  }


  return (
    <div className='h-[100vh] bg-[#070b21]'>
    <div className='pt-[100px] p-5'>
      <div className='md:w-[500px] mx-auto  rounded-md  py-10 bg-cyan-700'>
      <div className="flex items-center justify-center mb-4  text-[2.1rem]">
        <RiTodoLine size="40 "/>
        <div className='font-thin'>RV-Todo</div>
      </div>
      <form className='flex flex-col md:mx-24 mx-12 gap-6 text-gray-300' onSubmit={handleSubmit}>
       <input type="text" name='username' required placeholder='username' className='rounded-md px-4 py-2 text-slate-800  border-2 ' onChange={(e) =>handleChange(e)}/>
       <input type="text" name='email' required placeholder='email' className='rounded-md px-4 py-2 text-slate-800  border-2 ' onChange={(e) =>handleChange(e)}/>
       <div className='rounded-md px-4 py-2 text-slate-800 bg-white border-2  flex justify-between items-center hover:ring-black hover:ring-1 hover:border-transparent'>
       <input type={showPass ? "text" : "password"} name='password' className=' focus:outline-none' required placeholder='password'  onChange={(e) =>handleChange(e)}/>
       <span id="PassIcon" className='text-cyan-700 cursor-pointer hover:text-black' onClick={(e) => handleShow(e)}>{showPass ? <LuEyeOff size={20}/> : <LuEye size={20}/>}</span>
       </div>
       <div className='rounded-md px-4 py-2 text-slate-800 bg-white border-2  flex justify-between   hover:ring-black hover:ring-1 hover:border-transparent'>
       <input type={showConfirmPass ? "text" : "password"} name='confirmPassword'   className=' focus:outline-none' required placeholder='confirm password'  onChange={(e) =>handleChange(e)}/>
       <span id="confirmPassIcon" className='text-cyan-700 cursor-pointer hover:text-black' onClick={(e) => handleShow(e)}>{showConfirmPass ? <LuEyeOff size={20}/> : <LuEye size={20}/>}</span>
       </div>
       <button type="submit" className='uppercase text-lg bg-white rounded-md py-1 tracking-wide text-black hover:bg-black hover:text-white transition ease-in-out duration-300' >create user</button>
      </form>
      <div className='text-center mt-5'>Already have an account? <Link to="/login" className='uppercase text-lg tracking-wide hover:text-dark  transition ease-in-out duration-300'>login</Link></div>
    </div>
     <Toaster/>
    </div>
    </div>
  )
}

export default Register