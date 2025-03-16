import React from 'react'
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from "react-router-dom";

import { FiShoppingCart } from "react-icons/fi";
import { FaCircleUser } from "react-icons/fa6";
import { BiFoodTag } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import './Home.css';
import { IoSettingsSharp } from "react-icons/io5";
import { ImProfile } from "react-icons/im";
import { FaHistory } from "react-icons/fa";
import  HomeBanner from '../images/home_banner_image.png'
import { RiStarFill } from "react-icons/ri";
function Home() {
  //const user = useSelector(state => state.user);
  let navigate = useNavigate()
  const [products, setProducts] = useState([]);
  const user=localStorage.getItem("userId")
  const fetchProducts = async (cat) => {
    try {
      
       const response = await axios.get(`https://goldenslice.onrender.com/get-products/${cat}`);
      
      setProducts(response.data.payload);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts("all"); // Calling initially for all products
  }, []);

  const addToCart = async (product) => {
   
    try {
      // Send a POST request to the backend to add the product to the cart
      const response = await axios.post('https://goldenslice.onrender.com/product/add-to-cart', {
     // Assuming user has _id property
        userId:user,
        productId: product.productId,
        productName: product.productName,
        price: product.price,
        discountPrice: Math.floor(product.price*70/100),
        category: product.category,
        quantity:1
      });
      console.log(response)
      console.log('Product added to cart:', response.data);
      alert('Product added to cart');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      alert('Error adding product to cart');
    }
  };
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(!show);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate('/');
  };

  const [activeFilter, setActiveFilter] = useState("all");

  const handleClick = (filter) => {
    setActiveFilter(filter);
    fetchProducts(filter);
  };

  return (
    <div className='container mb-5'>
    <nav className='text-end align-center fs-3 border border-dark rounded px-3 mb-1 bg-dark text-white'>
      {/*{user ? <span>Welcome User..!</span> : <span>Please log in</span>}*/}
      
      
      {/* <NavLink to='/cart'>Cart
      <FiShoppingCart className='text-dark '/>
      </NavLink>  */}
        <h6 className='d-inline me-2 ms-3'>Welcome User..!</h6>
      <FaCircleUser onClick={handleShow} style={{ cursor: 'pointer' }}/>
      
     
       
      
       {show && (
        <div className="dropdown-menu show position-absolute mt-2 me-3 border-dark" style={{ right: 0 }}>
           {user ? <span className='dropdown-item fw-bold mb-2'>{user}</span> : <span>Please log in</span>}
      
           <h6 className="dropdown-item"><ImProfile className='me-2 fs-5'/>Profile</h6>
           <h6><NavLink to="/cart" className="dropdown-item text-decoration-none text-dark"><FiShoppingCart className='me-2 fs-5'/>Go To Cart
           </NavLink></h6>
            <h6><NavLink to="/orders" className="dropdown-item text-decoration-none text-dark"><FaHistory className='me-2 fs-5'/>My Orders
            </NavLink></h6> 

          <h6 className="dropdown-item"><IoSettingsSharp className='me-2 fs-5 '/>Settings</h6>
          <button className='btn btn-danger mx-3 my-2 d-block mx-auto' onClick={handleLogout}>Logout</button>
        </div>
      )}
      
    </nav>
    <img src={HomeBanner} className='w-100'/>
    {/* <video width="100%" autoPlay loop muted>
        <source src={HomeBanner} type="video/mp4" />
    </video> */}

    {/* <div className='row border rounded mx-4 p-4 mx-auto border-dark shadow'>
          <div className='col col-md-6'>
          <p className='text-center fs-2 quote'>
            You can't buy happiness, but you can buy GoldenSlice pizza... and that's still cheaper than Gold!
            </p>
            </div>
      </div> */}
    <div className="container mt-4 mb-5">
    <div className='d-flex gap-3 mb-3'>
      <button 
        onClick={() => handleClick("all")} 
        className={`btn ${activeFilter === "all" ? "bg-dark text-white" : "border-dark"}`}
      >
        All Items
      </button>

      <button 
        onClick={() => handleClick("veg")} 
        className={`btn ${activeFilter === "veg" ? "bg-success text-white" : "border-success"}`}
      >
        <BiFoodTag className={`${activeFilter === "veg" ? "bg-success text-white" : "border-success text-success"} me-2 align-middle`}/>
        Veg
      </button>

      <button 
        onClick={() => handleClick("nonVeg")} 
        className={`btn ${activeFilter === "nonVeg" ? "bg-danger text-white" : "border-danger"}`}
      >
        <BiFoodTag className={`${activeFilter === "nonVeg" ? "bg-danger text-white" : "border-danger text-danger"} me-2 `}/>
        Non Veg
      </button>
    </div>
    <div className="row g-5 prod">
      {products.map((product) => (
        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 " key={product.productId}>
          <div className="card rounded">
            <div className='row g-2 my-auto prod align-middle'>
            <div className='col-7'>
            <div className="card-body">
              {product.category=="nonVeg"?<BiFoodTag className='text-danger fs-3 d-block mb-2'/>:<BiFoodTag className='text-success fs-3 d-block mb-2'/>}
              <h3 className="text-center">{product.productName}</h3>
              <h5 className="info">
                {/*Category: {product.category} <br />*/}
                ₹<span className='text-decoration-line-through'>{product.price}</span> {Math.floor(product.price * 70 / 100)} 

              </h5>
              <RiStarFill /> { (Math.random() * (4.9 - 4.0) + 4.0).toFixed(1) }
              <button 
                className="btn px-4 py-2 d-block mx-auto btn-dark mt-4"
                onClick={() => addToCart(product)}  
              >
                Add to Cart
              </button>
            </div>
            </div>
            <div className='col-5 my-auto my-auto px-3'>
            <img 
              src={require(`../images/${product.productName}.png`)} 
              alt={product.productName} 
              className="w-100 rounded p-2 "
            />
            </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  </div>
  );
}

export default Home;
