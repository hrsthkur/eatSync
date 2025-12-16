import React, { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
const ForgotPassword = () => {
  const [steps, setSteps] = useState(1);
  const [email, setEmail] = useState("");
  const [otp,setOtp] = useState("");
  const [newPassword,setNewPassword] = useState("");
  const [confirmPassowrd,setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [err,setErr] = useState("")
  const [loading,setLoading] = useState(false);
  const handleSendOtp = async ()=>{
    setLoading(true);
      try {
       const result =await axios.post(`${serverUrl}/api/auth/send-otp`,{email},{withCredentials:true})
       console.log(result);
       setSteps(2);
        setErr("")
        setLoading(false);
      } catch (error) {
         setErr(error?.response?.data?.message)
         setLoading(false);
        
      }
  }
  const handleVerifyOtp = async ()=>{
    setLoading(true)
      try {
       const result =await axios.post(`${serverUrl}/api/auth/verify-otp`,{email,otp},{withCredentials:true})
       console.log(result);
       setSteps(3);
        setErr("")
       setLoading(false);
      } catch (error) {
         setErr(error?.response?.data?.message)
        
        setLoading(false);
      }
  }
  const handleResetPassword = async ()=>{
    setLoading(true);
    if(newPassword != confirmPassowrd){
       setErr("NewPassword and ConfirmNPassword should be same")
       setLoading(false);
      return null;
    }
      try {
        
       const result =await axios.post(`${serverUrl}/api/auth/reset-password`,{email,newPassword},{withCredentials:true})
       console.log(result);
       navigate('/signin')
        setErr("")
        setLoading(false);
       
      } catch (error) {
         setErr(error.response.data.message)
         setLoading(false);
        
        
      }
  }
  

  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-[#fff9f6]">
      <div className="bg-white border rounded-xl shadow-kg w-full max-w-md p-8">
        <div className="flex items-center gap-4">
          <IoMdArrowRoundBack
            onClick={() => navigate("/signin")}
            size={20}
            className="cursor-pointer"
          />
          <h1 className="text-2xl font-bold text-[#ff4d2d]">Forgot Password</h1>
        </div>

        {steps == 1 && (
          <div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email
              </label>
              <input
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                name="email"
                className="w-full  border-[1px] border-[#ddd]  rounded px-3 py-2 focus:outline-none focus:border-orange-300"
                placeholder="Enter your Email"
              />
            </div>
            <button disabled={loading} onClick={handleSendOtp} className="w-full font-semibold py-2 mt-3 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor:pointer">
               {loading ? <ClipLoader  size={2}/> :  "Get otp"}
            </button>
             {err && <p className="text-red-500 text-center m-[10px]">{err}</p>}
          </div>
        )}
        {
            steps == 2 &&
             <div>
            <div className="mb-4">
              <label
                htmlFor="otp"
                className="block text-gray-700 font-medium mb-1"
              >
                OTP
              </label>
              <input
                type="text"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                name="otp"
                className="w-full  border-[1px] border-[#ddd]  rounded px-3 py-2 focus:outline-none focus:border-orange-300"
                placeholder="Enter OTP"
              />
            </div>
            <button disabled={loading} onClick={handleVerifyOtp} className="w-full font-semibold py-2 mt-3 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor:pointer">
               {loading ? <ClipLoader  size={2}/> :  "Verify otp"}
            </button>
              {err && <p className="text-red-500 text-center m-[10px]">{err}</p>}
          </div>
        }
        {
            steps == 3 &&
             <div>
            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block text-gray-700 font-medium mb-1"
              >
                New Password
              </label>
              <input
                
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                name="newPassword"
                className="w-full  border-[1px] border-[#ddd]  rounded px-3 py-2 focus:outline-none focus:border-orange-300"
                placeholder="Enter New Password"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block text-gray-700 font-medium mb-1"
              >
                Confirm New Password
              </label>
              <input
                type='password'
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassowrd}
                name="otp"
                className="w-full  border-[1px] border-[#ddd]  rounded px-3 py-2 focus:outline-none focus:border-orange-300"
                placeholder="Confirm New Passowrd"
              />
            </div>
            <button disabled={loading} onClick={handleResetPassword} className="w-full font-semibold py-2 mt-3 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor:pointer">
               {loading ? <ClipLoader  size={2}/> :  "Reset Password"}
            </button>
             {err && <p className="text-red-500 text-center m-[10px]">{err}</p>}
          </div>
        }


      </div>
    </div>
  );
};

export default ForgotPassword;
