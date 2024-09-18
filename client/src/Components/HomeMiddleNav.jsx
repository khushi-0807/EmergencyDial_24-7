import React from 'react'
import HomeMiddleNSecP from './HomeMiddleNSecP'
import HomeMiddleNF from './HomeMiddleNF'
import { useLocation } from 'react-router-dom';

function HomeMiddleNav() {
  const location = useLocation();
  const { fullname } = location.state || {};
  return (
    <div className="bg-body-secondary p-4 rounded mt-3 d-flex border border-black border-2">
    <HomeMiddleNF fullname={fullname}/>
    <HomeMiddleNSecP/>
    </div>
  )
}

export default HomeMiddleNav