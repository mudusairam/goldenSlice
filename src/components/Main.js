import React from 'react';
import homePic from '../images/image_home.png'
import './Main.css'
import Login from './Login';
import Register from './Register'
import { useState } from 'react';
function Main() {
  
  const [isRegistering, setIsRegistering] = useState(false);

  const handleToggle = () => {
    setIsRegistering(!isRegistering);
  };
  return (
   <div className='main'>
    <div className='row fill'>
        <div className='pizzaPic col-sm-8 col-md-5 col-lg-6 mx-auto align-center my-auto'>
          <img src={homePic} className='w-100' />
        </div>
        <div className='homeText col-sm-12 col-md-7 col-lg-6 mt-3 mx-auto'>
          <h2 className='text-center'>Every slice is a <br></br><span className='fw-bold fw-italic display-1'>"GoldenSlice"</span></h2>
          <div className="details">
      {isRegistering ? <Register /> : <Login />}
      <h6 className="d-inline">
        {isRegistering ? 'Already have an account? ' : 'New to GoldenSlice? '}
      </h6>
      <span 
        className="register text-dark" 
        style={{ cursor: 'pointer', textDecoration: 'underline' }} 
        onClick={handleToggle}
      >
        {isRegistering ? <h6 className='d-inline '>Login here</h6> : <h6 className='d-inline'>Register here</h6>}
      </span>
    </div>
        </div>
      </div>


   </div>
  )
}

export default Main