import React from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { useDispatch } from 'react-redux'
function Login() {
  const dispatch=useDispatch()
    let { register, handleSubmit, formState: { errors } } = useForm()
    let navigate = useNavigate()
    const submitLogin=(userObj)=>{
    axios.post('https://goldenslice.onrender.com/user/login',userObj)
    .then((response)=>{
      if(response.status==201)
      {
        dispatch({ type: 'SET_USER', payload: response.data.payload });
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("userId",response.data.payload.mobileNo)
        navigate('/home')
      }
      else{
        alert(response.data.message)
      }
    })
}
   
  return (
    <div className='row login mt-3'>
      <form className='form d-block mx-auto p-4 col col-9 col-sm-7 col-lg-8 col-xl-7 border shadow mt-3 rounded '  onSubmit={handleSubmit(submitLogin)}>
        <div className='form-floating mb-3'>
          <input type='text' id='mobileNo' className='form-control mt-3 mb-1' placeholder='Mobile No.' {...register('mobileNo', { required: true, pattern: {value:/^[0-9]{10}$/} })}></input>
          <label htmlFor='mobileNo'>Mobile No.</label>
        </div>
        <div className='form-floating mb-3'>
        <input type='password' id='password' className='form-control' placeholder='Password' {...register('password', { required: true })}></input>
          <label htmlFor='password'>Password</label>
        </div>
        <button className='btn btn-dark d-block mx-auto mt-4 mb-2 px-4' type='submit'>Login</button>
        {/* <h6 className='d-inline'>New to GoldenSlice? </h6><NavLink to='/register' className='register text-dark' >Register here</NavLink> */}
      </form>
    </div>
  )
}

export default Login
    