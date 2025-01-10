import React, { useEffect, useState } from 'react';
import useUser from '../hooks/useUser';
import { AnimatePresence } from 'framer-motion';
import { MainSpinner, TemplateDesignPin } from '../components';
import { useNavigate } from 'react-router-dom';
import useTemplate from '../hooks/useTemplate';
import { useQuery } from 'react-query';
import { getSavedResumes } from '../api';

const UserProfile = () => {
  const { data: user, isLoading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState('collections');
  const {
    data: templates,
    isLoading: tempIsLoading,
    isError: tempIsError,
  } = useTemplate();

  const {data:savedResumes} = useQuery(["savedResumes"],()=>getSavedResumes(user?.uid))

  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !userLoading) {
      navigate('/auth', { replace: true });
    }
  }, [user, userLoading, navigate]);

  
  if (userLoading && tempIsLoading) {
    return <MainSpinner/>
  }

  if (!user) {
    return null; 
  }
  
  return (
    <div className='w-full flex flex-col items-center justify-start py-12'>
      <div className='w-full h-72 bg-blue-50'>
          <img
          className='w-full h-full object-cover'
          src='https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfGVufDB8fHx8fDB8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'/>
          <div className='flex flex-col items-center justify-center gap-4'>
          {
            user?.photoURL ? (<React.Fragment>
              <img src={user?.photoURL}
              className='w-24 h-24 rounded-full border-2 border-white -mt-12 shadow-md'
              referrerPolicy='no-referrer'
              loading='lazy'
              />
            </React.Fragment>) : (<React.Fragment>
            <img src='https://img.freepik.com/premium-vector/adorable-cyberpunk-dj-vector_868778-499.jpg'
              className='w-24 h-24 rounded-full border-2 border-white -mt-12 shadow-md'
              referrerPolicy='no-referrer'
              loading='lazy'
              />
            </React.Fragment>)
          }
          <p className='text-2xl text-txtdark' >{user.displayName}</p>
          </div>

       {/* tabs */}
     <div className='flex items-center justify-center mt-12' >
        <div className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`} onClick={()=>setActiveTab("collections")} >
          <p className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${activeTab === 'collections' && 'bg-white shadow-md text-blue-600 ' }`} >Collections</p>
        </div>

        <div className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`} onClick={()=>setActiveTab("resumes")} >
          <p className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${activeTab === 'resumes' && 'bg-white shadow-md text-blue-600 ' }`} >My Resumes</p>
        </div>
     </div>

     {/* tab content */}
    <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 px-4 py-6'>
      <AnimatePresence>
        {
          activeTab === "resumes" && (<React.Fragment>
            {savedResumes && savedResumes.length > 0 ? <RenderTemplate templates={savedResumes} /> :
            <div>
              <p>No resumes found.</p>
            </div>}
          </React.Fragment>)
        }


{
          activeTab === "collections" && (<React.Fragment>
            {user?.collection && user.collection.length > 0 ? <RenderTemplate templates={templates?.filter((temp)=>
            user?.collection?.includes(temp?._id))} /> :
            <div>
              <p>No collections found.</p>
            </div>}
          </React.Fragment>)
        }
      </AnimatePresence>

    </div>
      </div>
      </div>
  )
}

const RenderTemplate = ({templates}) => {
  return (
    <React.Fragment>
      {templates && templates.length > 0 &&
      (<React.Fragment>
      <AnimatePresence>
        {templates && templates.map((template,index) => (
          <TemplateDesignPin key={template?._id} data={template} index={index}/>
        ))}
      </AnimatePresence>
      </React.Fragment>)}
    </React.Fragment>
  )
}

export default UserProfile