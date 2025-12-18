import React, { useState } from "react";
import { MdOutlineRemoveRedEye, MdPassword } from "react-icons/md";
import { IoEyeOffOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase";
import { ClipLoader } from 'react-spinners'
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const SignUp = () => {
  // const primaryColor = "#ff4d2d";
  // const hoverColor = "#e64323";
  // const bgColor = "#fff9f6";
  // const borderColor = "#ddd";
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [err,setErr] = useState("")
  const [loading,setLoading] = useState(false)
  const dispatch = useDispatch()

  const handleSignUp = async () => {
    setLoading(true)
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          fullName,
          email,
          password,
          role,
          mobile,
        },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      setErr("")
      setLoading(false)
    } catch (error) {
     setErr(error?.response?.data?.message)
     setLoading(false)
      //console.log(error);
    }
  };

  const handleGoogleAuth = async () => {
    if(!mobile){
      return  setErr("Mobile number is required even for Google login")
    }
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(
        auth,
        provider
      );

      try {
        const data = await axios.post(`${serverUrl}/api/auth/google-auth`,{
          fullName:result.user.displayName,
          email:result.user.email,
          role,
          mobile
        }, {withCredentials:true})
        dispatch(setUserData(data));
        
      } catch (error) {

       setErr(error?.response?.data?.message)
        
        
      }

    } catch (error) {
       setErr(error?.response?.data?.message)
    }
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center bg-[#fff9f6]`}
    >
      <div
        className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px] border-[#ddd]`}
      >
        <h1 className={`text-3xl font-bold text-[#ff4d2d]`}>food delivery</h1>
        <p className="text-gray-600 mb-8">Create your account to get started</p>

        {/* full name*/}
        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-gray-700 font-medium mb-1"
          >
            Full Name
          </label>
          <input
          required
            type="text"
            name="fullName"
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            className="w-full  border-[1px] border-[#ddd]  rounded px-3 py-2 focus:outline-none focus:border-orange-300"
            placeholder="Enter your Full name"
          />
        </div>

        {/* email*/}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-1"
          >
            Email
          </label>
          <input
          required
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            name="email"
            className="w-full  border-[1px] border-[#ddd]  rounded px-3 py-2 focus:outline-none focus:border-orange-300"
            placeholder="Enter your Email"
          />
        </div>

        {/* Mobile */}
        <div className="mb-4">
          <label
            htmlFor="mobile"
            className="block text-gray-700 font-medium mb-1"
          >
            Mobile
          </label>
          <input
          required
            type="number"
            name="mobile"
            onChange={(e) => setMobile(e.target.value)}
            value={mobile}
            className="w-full  border-[1px] border-[#ddd]  rounded px-3 py-2 focus:outline-none focus:border-orange-300"
            placeholder="Enter your Mobile"
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
              onChange={(e) => setPassword(e.target.value)}
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

        {/* role*/}

        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-gray-700 font-medium mb-1"
          >
            Role
          </label>
          <div className="flex gap-2">
            {["user", "owner", "deliveryPartner"].map((r) => (
              <button
                onClick={() => setRole(r)}
                className={`flex-1 border rounded-lg px-3 py-2 text-center font-medium ${
                  role == r
                    ? `bg-[#ff4d2d] text-white`
                    : `border-[#ddd] text-[#333]`
                } transition-colors cursor:pointer`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSignUp}
          className="w-full font-semibold py-2 mt-3 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor:pointer"
        disabled = {loading}
        >
          {loading ? <ClipLoader  size={2}/> :  "Sign Up"}
         
        </button>
        {err && <p className="text-red-500 text-center m-[10px]">{err}</p>}
        <button className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-1.5 border-gray-200 hover:bg-gray-200"
        onClick={handleGoogleAuth}>
          <FcGoogle size={20} />
          <span>Sign up with google</span>
        </button>
        <p className="text-center  mt-4">
          Already have an account ?{" "}
          <span
            onClick={() => navigate("/signin")}
            className="text-[#ff4d2d] cursor-pointer"
          >
            Signin
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
