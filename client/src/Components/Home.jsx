import React from "react";
import HomeHeaderNav from "./HomeHeaderNav";
import HomeMiddleNav from "./HomeMiddleNav";
import HomeMenuSec from "./HomeMenuSec";
import { useLocation } from "react-router-dom";

function Home() {
  const location = useLocation();
  const { fullname,_id } = location.state || {};
  // console.log(_id);
 
  return (
    <main className="container p-2 ">
      <HomeHeaderNav />
      <HomeMiddleNav fullname={fullname}  />
      <HomeMenuSec _id={_id} />
    </main>
  );
}

export default Home;
