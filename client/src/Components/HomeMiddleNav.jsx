import React from 'react'
import HomeMiddleNF from './HomeMiddleNF'
import { useLocation } from 'react-router-dom';

function HomeMiddleNav() {
  const location = useLocation();
  const { fullname } = location.state || {};
  return (
    <div className="bg-body-secondary p-4 rounded mt-3  border border-black border-2">
    <HomeMiddleNF fullname={fullname}/>
    </div>
  )
}

export default HomeMiddleNav