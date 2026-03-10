import React from 'react'
import Nav from './Nav'
import { useSelector } from 'react-redux'

const DeliveryPartner = () => {
  const {userData} = useSelector(state=>state.user)
  return (
    <div className='w-full min-h-screen  bg-[#fff9f6] flex flex-col items-center'>
      <Nav/>

      <div className='w-full max-w-[800px] flex flex-col gap-5 items-center'>
      <div className='bg-white rounded-2xl shadow-md p-5 flex justify-between items-center w-[90%] border border-orange-100'>
        <h1 className='text-xl font-bold text-[#ff4d2d]'>Welcome {userData.fullName}</h1>
        <p className='text-[#ff4d2d]'><span className='font-semibold'>Latitude: {userData.location.coordinates[1]}</span>,<span className='font-semibold'> Longitude: {userData.location.coordinates[0]}</span></p>
      </div>
      </div>
      
    </div>
  )
}

export default DeliveryPartner
