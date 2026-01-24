import React, { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import {
  setCurrentAddress,
  setCurrentCity,
  setCurrentState,
  setUserData,
} from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { setAddress, setLocation } from "../redux/mapSlice";

const useGetcity = () => {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const apiKey = import.meta.env.VITE_GEOAPIKEY;
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      dispatch(setLocation({lat:latitude,lon:longitude}))

      const result =
        await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}
`);

      const city = result?.data?.results[0]?.state_district;
      const state = result?.data?.results[0]?.state;
      const address = result?.data?.results[0]?.address_line1;
      dispatch(setAddress(address))

      dispatch(setCurrentCity(city));
      dispatch(setCurrentState(state));
      dispatch(setCurrentAddress(address));
      
    });
  }, [userData]);
};

export default useGetcity;
