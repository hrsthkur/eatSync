import React, { useState } from "react";
import { MdOutlineRemoveRedEye, MdPassword } from "react-icons/md";
import { IoEyeOffOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios"
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const SignIn = () => {
  // const primaryColor = "#ff4d2d";
  // const hoverColor = "#e64323";
  // const bgColor = "#fff9f6";
  // const borderColor = "#ddd";
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [err,setErr] = useState("")
  const [loading,setLoading] = useState(false)
  const dispatch = useDispatch()



    const handleGoogleAuth = async () => {
     
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(
          auth,
          provider
        );
  
        try {
          const data = await axios.post(`${serverUrl}/api/auth/google-auth`,{
            email:result.user.email,
          }, {withCredentials:true})
          dispatch(setUserData(data));
          setErr("")
          
        } catch (error) {
  
          setErr(error?.response?.data?.message)
          
          
        }
  
      } catch (error) {
        setErr(error?.response?.data?.message)

      }
    };
  
  const handleSignIn = async()=>{
    setLoading(true)
    
    try {
      
      const result = await axios.post(`${serverUrl}/api/auth/signin`,{
        
        email,
        password,
      },{withCredentials:true})

     dispatch(setUserData(result.data));
       setErr("")
       setLoading(false);
      
    } catch (error) {
      setErr(error?.response?.data?.message)
      setLoading(false);
      
    }
    
  }




  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center bg-[#fff9f6]`}
    >
      <div
        className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px] border-[#ddd]`}
      >
        <h1 className={`text-3xl font-bold text-[#ff4d2d]`}>food delivery</h1>
        <p className="text-gray-600 mb-8">Login to get started</p>

      
        {/* email*/}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-1"
          >
            Email
          </label>
          <input
            type="text"
            onChange={(e)=>setEmail(e.target.value)}
            value={email}
            name="email"
            required
            className="w-full  border-[1px] border-[#ddd]  rounded px-3 py-2 focus:outline-none focus:border-orange-300"
            placeholder="Enter your Email"
          />
        </div>

    
        {/* Password*/}

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
            required
              type={`${showPassword ? "text" : "password"}`}
              name="password"
              onChange={(e)=>setPassword(e.target.value)}
            value={password}
              className="w-full  border-[1px] border-[#ddd]  rounded px-3 py-2 focus:outline-none focus:border-orange-300"
              placeholder="Enter your Password"
            />

            <button
              className="absolute right-3 top-[14px] cursor:pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <MdOutlineRemoveRedEye /> : <IoEyeOffOutline />}
            </button>
          </div>
        </div>

        <div className="text-right mb-4 cursor-pointer text-[#ff4d2d]"
        onClick={()=>navigate("/forgot-password")}
        >
          
          forgot password
        </div>

    

        <button onClick={handleSignIn} className="w-full font-semibold py-2  rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor:pointer"
          disabled = {loading}
                 >
                   {loading ? <ClipLoader  size={2}/> :  "Sign in"}
                  
                 </button>
       
         {err && <p className="text-red-500 text-center m-[10px]">{err}</p>}
        <button
        onClick={handleGoogleAuth}
        className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-1.5 border-gray-200 hover:bg-gray-200"
        ><FcGoogle  size={20}/>
        <span>
          Sign in with google
          </span></button>
          <p className="text-center  mt-4">Want to create a new account ? <span  onClick={()=>navigate('/signup')}  className="text-[#ff4d2d] cursor-pointer">Signup</span></p>
      </div>
    </div>
  );
};

export default SignIn;
