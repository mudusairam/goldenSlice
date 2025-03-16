import React from 'react';
import { Outlet } from 'react-router-dom';
import Main from './components/Main';

function Root() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default Root;
