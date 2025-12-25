import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { FaSearchengin } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import axios from "axios";
import { setUserData } from "../redux/userSlice";
import { FaPlus } from "react-icons/fa";
import { LuReceiptIndianRupee } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const Nav = () => {
  const { userData, city } = useSelector((state) => state.user);
  const { myShopData } = useSelector((state) => state.owner);
  const navigate = useNavigate()
  const [showInfo, setShowInfo] = useState(false);
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });

      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-[80px] fixed top-0 z-[9999] bg-[#fff9f6]">
      <div className="max-w-7xl h-full mx-auto flex items-center justify-between gap-[20px] px-5">
        <h1 className="text-3xl font-bold text-[#ff4d2d] flex-shrink-0">
          eatSync
        </h1>

        {userData.role === "user" && (
          <div className="flex items-center gap-4 flex-1 justify-center">
            <div className="w-full md:w-[60%] lg:w-[40%] h-[50px] bg-white shadow-xl rounded-lg md:flex hidden items-center gap-4 px-4">
              <div className="flex items-center gap-2 text-gray-700 flex-shrink-0">
                <FaLocationDot size={22} className="text-[#ff4d2d]" />
                <span className="text-sm font-medium">{city}</span>
              </div>

              <div className="h-6 w-[1px] bg-gray-300"></div>

              <div className="w-full flex items-center gap-[10px]">
                <input
                  type="text"
                  className="text-gray-700 text-sm outline-0 w-full"
                  placeholder="search delicious foods"
                />
                <FaSearchengin
                  size={25}
                  className="text-[#ff4d2d] flex-shrink-0"
                />
              </div>
            </div>
          </div>
        )}

        <FaSearchengin
          size={25}
          className="text-[#ff4d2d] md:hidden flex-shrink-0"
        />

        {userData.role === "owner" ? (
          <>
          {myShopData && <button onClick={()=>navigate("/add-food")} className="flex items-center gap-1 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]">
              <FaPlus size={20} />
              <span>Add Food Item</span>
            </button> }
            
            <div className="flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium">
              <LuReceiptIndianRupee size={20} />
              <span>Pending orders</span>
              <span className="absolute -right-2 -top-2 text-xs font-bold text-white bg-[#ff4d2d] rounded-full px-[6px] py-[1px] ">0</span>

            </div>
          </>
        ) : (
          <>
            <div className="relative cursor-pointer flex-shrink-0">
              <FiShoppingCart size={25} className="text-[#ff4d2d]" />
              <span className="absolute right-[-9px] top-[-12px] text-[#ff4d2d]">
                0
              </span>
            </div>
            <button className="hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium flex-shrink-0">
              My orders
            </button>
          </>
        )}

        <div
          onClick={() => setShowInfo((prev) => !prev)}
          className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl font-semibold cursor-pointer flex-shrink-0"
        >
          {userData?.fullName?.slice(0, 1).toUpperCase()}
        </div>
        {showInfo && (
          <div className="fixed top-[80px] right-[10px] md:right-[10px] lg:right-[25%] w-[180px] bg-white shadow-2xl rounded-xl p-[20px] flex flex-col gap-[10px] z-[9999]">
            <div className="text-[17px] font-semibold">{userData.fullName}</div>
            <div className="md:hidden text-[#ff4d2d] font-semibold cursor-pointer">
              My orders
            </div>
            <div
              onClick={handleLogout}
              className="text-[#ff4d2d] font-semibold cursor-pointer"
            >
              Log out
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nav;
