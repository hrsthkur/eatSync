import React, { useEffect, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";

import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";
const EditItem = () => {
  const navigate = useNavigate();
  const [currentItem, setCurrentItem] = useState(null);
  const { itemId } = useParams();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const dispatch = useDispatch();
  const [category, setCategory] = useState("");
  const [foodType, setFoodType] = useState("veg");
  const categories = [
    "Snacks",
    "Main Course",
    "Desserts",
    "Pizza",
    "Burgers",
    "Sandwiches",
    "South Indian",
    "North Indian",
    "Chinese",
    "Fast Food",
    "Others",
  ];
  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("foodType", foodType);
      formData.append("price", price);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const result = await axios.post(
        `${serverUrl}/api/item/edit-item/${itemId}`,
        formData,
        { withCredentials: true }
      );
      dispatch(setMyShopData(result.data));
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };
  useEffect(() => {
    const handleGetItemById = async () => {
      try {
        // console.log("working");

        const result = await axios.get(
          `${serverUrl}/api/item/get-by-id/${itemId}`,
          { withCredentials: true }
        );
        setCurrentItem(result.data);
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    };
    handleGetItemById();
  }, [itemId]);

  useEffect(() => {
    setName(currentItem?.name || "");
    setPrice(currentItem?.price || 0);
    setCategory(currentItem?.category || "");
    setFoodType(currentItem?.foodType || "veg");
    setFrontendImage(currentItem?.image || null);
  }, [currentItem]);

  return (
    <div className="flex justify-center items-center flex-col p-6 bg-gradient-to-br from-orange-50 relative to-white min-h-screen">
      <div
        onClick={() => navigate("/")}
        className="absolute top-[20px] left-[20px] z-[10] mb-[10px]"
      >
        <IoMdArrowRoundBack size={35} className="text-[#ff4d2d]" />
      </div>
      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <FaUtensils className="text-[#ff4d2d] w-16 h-16" />
          </div>

          <div className="text-3xl font-extrabold text-gray-900">Edit Food</div>
        </div>
        <form className="space-y-5" onSubmit={(e) => handleEdit(e)}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter shop name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food image
            </label>
            <input
              type="file"
              accept="image/*"
              placeholder="Enter shop name"
              onChange={(e) => handleImage(e)}
              className="w-full  px-4 py-2 border  rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div>
              {frontendImage && (
                <img
                  src={frontendImage}
                  alt="Restaurant image"
                  className="w-full h-48 object-cover rounded-lg border"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              placeholder="0"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Food category
            </label>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select category</option>
              {categories.map((cate, idx) => (
                <option key={idx} value={cate}>
                  {cate}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select food type
            </label>
            <select
              onChange={(e) => setFoodType(e.target.value)}
              value={foodType}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="veg">Veg</option>
              <option value="non veg">Non-veg</option>
            </select>
          </div>

          <button
            disabled={loading}
            className="w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg cursor-pointer transition-all "
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditItem;
