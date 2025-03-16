import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { IoSettingsSharp } from "react-icons/io5";
import { ImProfile } from "react-icons/im";
import { FaHistory } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { FiShoppingCart } from "react-icons/fi";
import { FaCircleUser } from "react-icons/fa6";
import orderEmpty from '../images/order_empty.svg'
import orderPizza from '../images/order_pizza.png'
function Orders() {
  //const user = useSelector(state => state.user); // Assume user contains the user ID (e.g., mobile number)
  let navigate = useNavigate()
  const [orders, setOrders] = useState([]);
  const user=localStorage.getItem("userId")
  console.log(user)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        
        const response = await axios.get(`http://localhost:4900/product/get-orders/${user}`);
        console.log(response)
        setOrders(response.data.payload.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
      fetchOrders();
  }, [user]);
const [show, setShow] = useState(false);

  const handleShow = () => setShow(!show);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate('/');
  };
  return (
    <div className="container">
      <nav className='text-end align-center fs-3 border border-dark rounded mb-1 px-3 bg-dark text-white'>
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
      <h3 className="heading display-4 mb-5 border border-dark rounded mt-2 p-2">My Orders</h3>
      {/* <img src={orderPizza} className='w-100'></img> */}
      {orders.length === 0 ? (
        <div className='mx-auto'>
          <img src={orderEmpty} className='cartEmpty'></img>
          <p className='fs-3 mt-3'>Slice your first GoldenSlice Pizza Now..!</p>
          <NavLink to="/home">
                    <button className='btn btn-dark mx-3 my-2 mt-3' >Go to Home</button>
                  </NavLink>
        </div>

      ) : (
        
        orders.map((order, index) => (
          <div className="card mb-4 shadow" key={index}>
            <div className="card-header">
              <h5>Order Date: {new Date(order.orderDate).toLocaleDateString()}</h5>
              <p>Total Amount: ₹{order.totalAmount}</p>
            </div>
            <div className="card-body">
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, itemIndex) => (
                    <tr key={itemIndex}>
                      <td>{itemIndex + 1}</td>
                      <td>{item.name}</td>
                      <td>₹<span className='text-decoration-line-through'>{item.price}</span> {item.discountPrice}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.totalCost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
