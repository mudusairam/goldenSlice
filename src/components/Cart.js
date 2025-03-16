import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { BiFoodTag } from "react-icons/bi";
import CartEmpty from '../images/cart_empty.svg'
import { NavLink } from "react-router-dom";
import { IoSettingsSharp } from "react-icons/io5";
import { ImProfile } from "react-icons/im";
import { FaHistory } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { FiShoppingCart } from "react-icons/fi";
import { FaCircleUser } from "react-icons/fa6";
import './Home.css'
import cartPizza from '../images/cart_image.png'
function Cart() {
  //const user = useSelector((state) => state.user);
 let navigate = useNavigate()
 const [show, setShow] = useState(false);
 
   const handleShow = () => setShow(!show);
   const handleLogout = () => {
     localStorage.removeItem("token");
     localStorage.removeItem("userId");
     navigate('/');
   };
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const user=localStorage.getItem("userId")
  console.log(user)
  useEffect(() => {
    const fetchCart = async () => {
      try {
    
        const response = await axios.get(`http://localhost:4900/product/get-cart/${user}`);
        console.log(response)    
        setCart(response.data.payload.cart);
        setTotalAmount(response.data.payload.totalAmount);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
    fetchCart();
  }, []);

  const updateCart = async (product, action) => {
    let actionType=""
    if(action=="add") actionType="add-to-cart"
    else  actionType="remove-from-cart"
    try {
      const response = await axios.post(`http://localhost:4900/product/${actionType}`, {
        userId:user,
        productId: product.productId,
        productName: product.productName,
        price: product.price,
        discountPrice:product.discountPrice,
        category: product.category,
        quantity:1
      });
      setCart(response.data.payload.cart);
      setTotalAmount(response.data.payload.totalAmount);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const placeOrder = async () => {
    try {
      const response = await axios.post(`http://localhost:4900/product/add-to-orders`, {
        userId: user,
        cart,
      });
      alert('Order placed successfully!');
      setCart([]); // Clear the cart after order
      setTotalAmount(0);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order');
    }
  };
  
  
  return (
    <div className="container" >
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
            
                 <h6><NavLink to="/home" className="dropdown-item text-decoration-none text-dark"><ImProfile className='me-2 fs-5'/>Profile
                            </NavLink></h6>
                 <h6><NavLink to="/cart" className="dropdown-item text-decoration-none text-dark"><FiShoppingCart className='me-2 fs-5'/>Go To Cart
                 </NavLink></h6>
                  <h6><NavLink to="/orders" className="dropdown-item text-decoration-none text-dark"><FaHistory className='me-2 fs-5'/>My Orders
                  </NavLink></h6> 
      
                <h6 className="dropdown-item"><IoSettingsSharp className='me-2 fs-5 '/>Settings</h6>
                <button className='btn btn-danger mx-3 my-2 d-block mx-auto' onClick={handleLogout}>Logout</button>
              </div>
            )}
            
          </nav>
      <div className='row border rounded p-3 mx-auto border-dark shadow mt-4'>
          <div className='col-12 col-sm-12 col-md-12 col-lg-6 my-auto'>
          <p className='text-center fs-2 quote'>
            You can't buy happiness, but you can buy GoldenSlice pizza... and that's still cheaper than Gold!
            </p>
            </div>
            <div className='col-12 col-sm-12 col-md-12 col-lg-6 my-auto'>
              <img src={cartPizza} className='w-100'></img>
            </div>
      </div>
      <div className="row g-5 mt-1">
        {cart.map((product) => (
          
            
            
        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12" key={product.productId}>
          <div className="card rounded my-auto">
            <div className='row g-2 my-auto prod align-middle'>
            <div className='col-7 my-auto'>
            <div className="card-body">
              {product.category=="nonVeg"?<BiFoodTag className='text-danger fs-3 d-block mb-2'/>:<BiFoodTag className='text-success fs-3 d-block mb-2'/>}
              
            <h4 className="text-center">{product.productName}</h4>
            <h5 className="info">
                {/*Category: {product.category} <br />*/}
                ₹<span className='text-decoration-line-through'>{product.price}</span> {Math.floor(product.price * 70 / 100)} 

              </h5>
                <h5 className="info">
                  Total Cost: ₹{product.totalCost}
                </h5>
                <div className="d-flex justify-content-evenly mt-2">
                  
                  <button
                    className="btn btn-dark"
                    onClick={() => updateCart(product, 'add')}
                  >
                    <FaPlus className='d-block'/>
                  </button>
                  <h6 className='my-auto'>{product.quantity}</h6>
                  <button
                    className="btn btn-dark"
                    onClick={() => updateCart(product, 'remove')}
                  >
                    <FaMinus className='d-block '/>
                  </button>
                </div>
            </div>
            </div>
            <div className='col-5 my-auto rounded'>
            <img 
              src={require(`../images/${product.productName}.png`)} 
              alt={product.productName} 
              className="w-100 rounded p-2"
            />
            
            </div>
            </div>
          </div>
        </div>
          
          
        ))}
      </div>

      {/* Cart Summary */}
      {cart.length==0?
        <div className='mt-4'><img src={CartEmpty} className='text-center cartEmpty w-100 mt-5' ></img>
        <h5 className='mt-2'>"Oops! Your cart feels lonely. Add some slices to make it happy."</h5>

        <NavLink to="/home">
          <button className='btn btn-dark mx-3 my-2 mt-3' >Go to Home</button>
        </NavLink>
        </div>
      :
      <div className="mt-5">
      <h4>Total Amount: ₹{totalAmount}</h4>
      <button
        className="btn btn-success px-4 py-2 mt-3"
        onClick={placeOrder}
        disabled={cart.length === 0}
      >
        Place Order
      </button>
    </div>}
      
    </div>
  );
}

export default Cart;
