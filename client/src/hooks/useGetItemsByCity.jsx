import React, { useEffect } from 'react'
import axios from "axios";
import { serverUrl } from "../App";
import { setItemsInMyCity } from '../redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';

const useGetItemsByCity = () => {
  const dispatch = useDispatch();
  const {currentCity} = useSelector(state=>state.user)
  
  useEffect(()=>{
    const fetchItems = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/item/get-by-city/${currentCity}`,{withCredentials:true})
      dispatch(setItemsInMyCity(result.data));
      
      
    } catch (error) {

      console.log(error)
    }
  }
    fetchItems()

  },[currentCity,dispatch])
}

export default useGetItemsByCity
