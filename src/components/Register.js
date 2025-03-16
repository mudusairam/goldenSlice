import React ,{useState} from 'react'
import { NavLink } from 'react-router-dom'
import {useForm} from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux' 
function Register() {
  const {register,handleSubmit,formState:{errors}}=useForm()
  let navigate=useNavigate()
  const dispatch=useDispatch()
  const submitRegister=(userObj)=>{
    axios.post('https://goldenslice.onrender.com/user/register',userObj)
    .then((response)=>{
      console.log(response)
      if(response.status==201){
        dispatch({ type: 'SET_USER', payload: response.data.payload });
        localStorage.setItem("userId",response.data.payload.mobileNo)
        navigate('/home')
      }
      else
      console.log(response.message)
    })
    .catch((err)=>console.log(err))
  }
  return (
  <div className='row login mt-3'>
        <form className='form d-block mx-auto p-4 col col-9 col-sm-7 col-lg-8 col-xl-7 border shadow mt-3 rounded' onSubmit={handleSubmit(submitRegister)}>
          <div className='form-floating mb-3'>
            <input type='text' id='mobileNo' className='form-control mt-3 mb-1' placeholder='Mobile No.' {...register('mobileNo', { required: true, pattern: {value:/^[0-9]{10}$/} })}></input>
          <label htmlFor='mobileNo'>Mobile No.</label>
        </div>
        <div className='form-floating mb-3'>
        <input type='password' id='password' className='form-control mt-3 mb-1' placeholder='Password' {...register('password',{required:true,minLength:6})}></input>
          <label htmlFor='password'>Password</label>
        </div>
        <div className='form-floating mb-3'>
        <input type='email' id='email' className='form-control mt-3 mb-1' placeholder='Email' {...register('email',{required:true})}></input>
        <label htmlFor='email'>Email</label>
        </div>
        <button className='btn btn-dark d-block mx-auto mt-4 mb-2 px-4' type='submit'>Register</button>
        </form>
      </div>
  )
}

export default Register