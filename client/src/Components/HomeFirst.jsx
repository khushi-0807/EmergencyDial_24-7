import React from 'react'
import HomeFirstNav from './HomeFirstNav'
import HomeFirstMiddle from './HomeFirstMiddle'
import HomeFPopluarSearch from './HomeFPopluarSearch'
import HomeFirstLogin from './HomeFirstLogin'
import HomeFServicesDayToDay from './HomeFServicesDayToDay'
import HomeFirstFooter from './HomeFirstFooter'
import HomeFirstRatings from './HomeFirstRatings'

function HomeFirst() {
  return (
    <div className="container px-4 ">
       <HomeFirstNav/>
    <HomeFirstMiddle/>
    <HomeFirstLogin/>
    <HomeFPopluarSearch/>
    <HomeFServicesDayToDay/>
    <HomeFirstRatings/>
    <HomeFirstFooter/>
  </div>
  )
}

export default HomeFirst