import React from 'react'
import HomeMiddleNSecP from './HomeMiddleNSecP'
import HomeMiddleNF from './HomeMiddleNF'

function HomeMiddleNav() {
  return (
    <div className="bg-body-secondary p-4 rounded mt-3 d-flex border border-black border-2">
    <HomeMiddleNF/>
    <HomeMiddleNSecP/>
    </div>
  )
}

export default HomeMiddleNav