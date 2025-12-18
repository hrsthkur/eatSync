import React, { useEffect } from 'react'
import axios from "axios";
import { serverUrl } from "../App";
import { setCity, setUserData } from '../redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const useGetcity = () => {
    const {userData} = useSelector(state=>state.user)
  const dispatch = useDispatch();
  const apiKey = import.meta.env.VITE_GEOAPIKEY
  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(async (position)=>{
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude
        const  result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}
`)

            const city = result?.data?.results[0]?.city;
           
            
            dispatch(setCity(city))


        
    } )

  },[userData])
  
 
}

export default useGetcity
