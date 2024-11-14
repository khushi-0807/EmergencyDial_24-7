import React from 'react';
import HomeMenuSecComp from './HomeMenuSecComp';
import MenuData from './MenuData';
import { useLocation } from "react-router-dom";


function HomeMenuSec() {
  const location = useLocation();
  const { _id } = location.state || {};
  console.log(_id);

  return (
    <div className="album py-5 bg-body-tertiary">
      <div className="container">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
          {MenuData.map((item, index) => (
            <HomeMenuSecComp key={index} occupation={item.heading} description={item.description} photo={item.photo} _id={_id}/>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomeMenuSec;
