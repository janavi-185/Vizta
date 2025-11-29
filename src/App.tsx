import React from 'react'
import './global.css'
import {Home} from './_root/pages'
import { Toaster } from "@/components/ui/sonner"
import SigninForm  from './_auth/forms/SigninForm'
import SignupForm  from './_auth/forms/SignupForm'
import { Routes, Route } from 'react-router-dom'
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout'

const App = () => {
  return (
    <main className='flex h-screen'>
      <Routes>
        {/* public routes */}
        <Route element={<AuthLayout/>}>
          <Route path='/sign-in' element={<SigninForm/>} />
          <Route path='/sign-up' element={<SignupForm/>} />
        </Route>
        
        {/* private routes */}
        <Route element={<RootLayout/>}>
          <Route index element={<Home/>} />
          <Route path='/explore' element={<Explore/>}/>
          <Route path='/saved' element={<Saved/>}/>
          <Route path='/all-users' element={<AllUsers/>}/>
          <Route path='/create-post' element={<CreatePost/>}/>
          <Route path='/update-post/:id' element={<EditPost/>}/>
          <Route path='/profile/:id' element={<Profile/>}/>
          <Route path='/update-profile/:id' element={<UpdateProfile/>}/>
          
        </Route>
      </Routes>
      <Toaster position='top-right' richColors />
    </main>
  )
}

export default App
