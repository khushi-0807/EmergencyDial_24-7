import React from 'react'

function HomeHeaderNav() {
  return (
    <div className=" my-2">
    <nav aria-label="breadcrumb ">
      <ol className="breadcrumb breadcrumb-custom overflow-hidden text-center bg-body-black border rounded-3 justify-content-between mx-2  bg-dark p-1" >
        <li className="breadcrumb-item">
          <a className="link-body-emphasis fw-semibold text-decoration-none text-white " href="#">
            <svg className="bi" width="16" height="16"><use xlink:href="#house-door-fill"></use></svg>
            Home 
          </a>
        </li>
        <li className="">
          <a className="link-body-emphasis fw-semibold text-decoration-none text-white" href="#">... Emergency Service For You ...</a>
        </li>
        <li className="link-body-emphasis fw-semibold text-decoration-none mx-3 text-white" aria-current="page">
          Data
        </li>
      </ol>
    </nav>
  </div>
  )
}

export default HomeHeaderNav