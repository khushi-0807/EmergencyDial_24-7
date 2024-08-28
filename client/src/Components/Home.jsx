import React from 'react'
import HomeHeaderNav from './HomeHeaderNav'
import HomeMiddleNav from './HomeMiddleNav'
import HomeMenuSec from './HomeMenuSec'

function Home() {
  return (
    <main className="container p-2 ">
   <HomeHeaderNav/>
  <HomeMiddleNav/>
  <HomeMenuSec/>
</main>
  )
}

export default Home