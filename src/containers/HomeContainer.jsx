import React from 'react'
import { Filter, MainSpinner, TemplateDesignPin } from '../components'
import useTemplate  from '../hooks/useTemplate'
import { AnimatePresence } from 'framer-motion'
const HomeContainer = () => {


  const {data:templates,isLoading:temp_isLoading,isError:temp_isError,refetch:temp_refetch} = useTemplate()

  if(temp_isLoading){
    return <MainSpinner/>
  }

  return (
    <div className='w-full px-4 lg:px-12 py-6 flex flex-col items-center
    justify-start'>
      {/* filter section  */}

    <Filter/>
       

      {/* render those template - resume pin*/}
      {
        temp_isError ? (<React.Fragment>
          <p className='text-red-500'>Error Fetching Templates</p>
          <button onClick={temp_refetch} className='bg-blue-500 text-white px-4 py-2 rounded-md'>Retry</button>
        </React.Fragment>) : (<React.Fragment>
          <div className='w-full grid grid-cols-1 md:grid-cols-2 
        lg:grid-cols-3 2xl:grid-cols-4 gap-2'>
          <RenderTemplate templates={templates}/>
        </div>
        </React.Fragment>)
      }
    </div>
  )
}

const RenderTemplate = ({templates}) => {
  return (
    <React.Fragment>
      {templates && templates.length > 0 ?
      (<React.Fragment>
      <AnimatePresence>
        {templates && templates.map((template,index) => (
          <TemplateDesignPin key={template?._id} data={template} index={index}/>
        ))}
      </AnimatePresence>
      </React.Fragment>) 
      : (<React.Fragment>
        <p className='text-gray-500 text-lg'>No Templates Found</p>
      </React.Fragment>)}
    </React.Fragment>
  )
}

export default HomeContainer