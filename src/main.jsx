import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Layout from './layout/Layout'
import { Layout2 } from './layout/Layout2'
import {createBrowserRouter, Route, RouterProvider, createRoutesFromElements } from 'react-router-dom'
import Home from './pages/home'
import { store } from './app/store'
import { Provider } from 'react-redux'
import Login from './pages/login'
import {Profile} from './pages/profile'
import SocialTabsPage from './pages/connections'
import App from './App'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path = "/" element={<Layout/>}>
        <Route path = "" element={<Home />} />
        <Route path='/socialtabsPage' element={<SocialTabsPage />} />
      </Route>
      <Route path = "/login" element = {<Login />} />
      
      <Route path = "user/:userId/posts" element = {<Layout2 />}>
        <Route path="" element={<Profile />} />
      </Route>
      
  </>
))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
