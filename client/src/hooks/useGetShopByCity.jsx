import React, { useEffect } from 'react'
import axios from "axios";
import { serverUrl } from "../App";
import { setShopsInMyCity } from '../redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const useGetShopByCity = () => {
  const dispatch = useDispatch();
  const {currentCity} = useSelector(state=>state.user)
  
  useEffect(()=>{
    const fetchShop = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/shop/get-by-city/${currentCity}`,{withCredentials:true})
      dispatch(setShopsInMyCity(result.data));
      
      
      
    
      
    } catch (error) {

      console.log(error)
    }
  }
    fetchShop()

  },[currentCity,dispatch])
}

export default useGetShopByCity
