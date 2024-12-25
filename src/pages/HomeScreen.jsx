import React, { Suspense } from 'react'
import { Header, MainSpinner } from '../components'
import { Route, Routes } from 'react-router-dom'
import { HomeContainer } from '../containers'
import CreateTemplate from './CreateTemplate'
import UserProfile from './UserProfile'
import CreateResume from './CreateResume'
import TemplateDesignPin from './TemplateDesignPin'

const HomeScreen = () => {
  return (
  
       <div className='w-full flex flex-col items-center justify-center'>
           {/* main */}
           <Header/>
           <main className='w-full flex flex-col items-center justify-center'>
            <Suspense fallback={<MainSpinner/>}>
             <Routes>
                  <Route path='/' element={<HomeContainer/>}/>
                  <Route path='/template/create' element={<CreateTemplate/>}/>
                  <Route path='/profile/:uid' element={<UserProfile/>}/>
                  <Route path='/resume/*' element={<CreateResume/>}/>
                  <Route path='/resumeDetails/:templateID' element={<TemplateDesignPin/>}/>
             </Routes>
            </Suspense>
               {/* custon routes */}
              
           </main>
       </div>
  )
}

export default HomeScreen