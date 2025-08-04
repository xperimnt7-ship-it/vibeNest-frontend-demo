import React from 'react'
import Sidebar from '../components/sidebar'
import { Outlet } from 'react-router-dom'


function Layout2() {
  return (
    <div className='flex flex-row'>
        <Sidebar/>
        <Outlet/>
    </div>
  )
}


export  {Layout2}
    