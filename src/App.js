import './App.css';
import React from 'react';
import Main from './components/Main';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Cart from './components/Cart'
import Orders from './components/Orders'
import Protected from './Protected';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Root from './Root';

function App() {
  const Router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        {/* Index route for "/" */}
        <Route index element={<Main />} />
        
        {/* Route for Register */}
        <Route path="register" element={<Register />} />
        
        {/* Route for Login 
        <Route path="login" element={<Login />} />*/}
        
        {/* Protected route for User */}
        <Route path="/home" element={<Protected><Home /></Protected>} />

        <Route path="/cart" element={<Protected><Cart /></Protected>} />
        <Route path="/orders" element={<Protected><Orders /></Protected>} />
      </Route>
    )
  );

  return (
    <div className="App">
      <RouterProvider router={Router} />
    </div>
  );
}

export default App;
