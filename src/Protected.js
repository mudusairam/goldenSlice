import { Navigate } from "react-router-dom"
import React from 'react';
function Protected({children}) {
    if(window.localStorage.getItem("token"))
        return children;
    return <Navigate to="/"/>
}

export default Protected