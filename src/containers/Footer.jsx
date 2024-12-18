import React from 'react'
import { Logo } from '../assets'
import { Link } from 'react-router-dom'
const Footer = () => {
  return (
    <div className='w-full flex items-center justify-between border-t border-gray-300'>
        <div className='flex items-center justify-center py-3 gap-3'>
        <img className='w-12 h-auto object-contain' src={Logo} alt='logo'/>
        <p>Express resume</p>
        </div>
        <div className='flex items-center justify-center py-3 gap-6'>
          <Link to={"/"} className='text-blue-700 text-sm'>Home</Link>
          <Link to={"/"} className='text-blue-700 text-sm'>Contact</Link>
          <Link to={"/"} className='text-blue-700 text-sm whitespace-nowrap'>Privacy Policy</Link>
        </div>
    </div>
  )
}

export default Footer