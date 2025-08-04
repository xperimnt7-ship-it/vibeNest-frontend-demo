import React from 'react'
import Sidebar from '../components/sidebar'
import { Outlet } from 'react-router-dom'
import Trending from '../components/trending'



function Layout() {
  return (
    <div className='flex flex-row'>
        <Sidebar/>
        <Outlet/>
        <Trending/>
    </div>
  )
}


export default Layout
    