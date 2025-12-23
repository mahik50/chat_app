import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Login from './components/Login'
import Signup from './components/Signup'
import Rooms from './components/Rooms'
import ChatRoom from './components/ChatRoom'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<Login />}/>
      <Route path='/signup' element={<Signup />}/>
      <Route path='/rooms' element={<Rooms />}/>
      <Route path='/chat-room/:roomID' element={<ChatRoom />}/>
    </>
  )
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)
