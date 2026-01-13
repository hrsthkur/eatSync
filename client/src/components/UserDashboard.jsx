import React, { useEffect, useRef, useState } from "react";
import Nav from "./nav";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import { FaChevronCircleLeft } from "react-icons/fa";
import { FaChevronCircleRight } from "react-icons/fa";
import { useSelector } from "react-redux";
import useGetShopByCity from "../hooks/useGetShopByCity";
import useGetItemsByCity from "../hooks/useGetItemsByCity";
import FoodCart from "./FoodCard";



const UserDashboard = () => {
  const {currentCity,shopsInMyCity,itemsInMyCity} = useSelector(state=>state.user)
  const catScrollRef = useRef()
  const shopScrollRef = useRef()
  const [showLeftCatButton,setShowLeftCatButton] = useState(false)
  const [showRightCatButton,setShowRightCatButton] = useState(false)
  const [showLeftShopButton,setShowLeftShopButton] = useState(false)
  const [showRightShopButton,setShowRightShopButton] = useState(false)

  const updateButton = (ref,setLeftButton,setRightButton) =>{
    const element = ref.current
    if(element){
      setLeftButton(element.scrollLeft>0)
      
      setRightButton(element.scrollLeft+element.clientWidth + 5 <= element.scrollWidth)  
      
    }


  }
  
  

  useEffect(()=>{
    const elem = catScrollRef.current
    const shopElem = shopScrollRef.current
    if(!elem || !shopElem) return;
    const handleScroll = () =>{
      updateButton(catScrollRef,setShowLeftCatButton,setShowRightCatButton);
      updateButton(shopScrollRef,setShowLeftShopButton,setShowRightShopButton)

    }
      handleScroll()

      elem.addEventListener('scroll',handleScroll);
      shopElem.addEventListener('scroll',handleScroll);
      
    
    return  ()=>{ 
      elem.removeEventListener("scroll",handleScroll);
      shopElem.removeEventListener("scroll",handleScroll);

  }
  },[categories])


  const scrollHandler = (ref,direction)=>{
      if(ref.current){
        ref.current.scrollBy({
          left:direction == "left" ? -200 : 200,
          behavior:"smooth"
        })
      }
  }
  useGetShopByCity()
  useGetItemsByCity()




  return (
    <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
      <Nav />
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
       <h1 className="text-gray-800 text-2xl sm:text-3xl">Inspiration for your first order</h1>
        <div className="w-full relative ">
          {showLeftCatButton && <button onClick={()=>scrollHandler(catScrollRef,"left")} className="absolute left-0 top-1/2 -transparent-y-1/2 text-white bg-[#ff4d2d]  p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10">
            <FaChevronCircleLeft />
          </button>}
          <div className="w-full flex overflow-x-auto gap-4 pb-2 " ref={catScrollRef}>
          {categories.map((item,idx) => (
            <CategoryCard image={item.image} name={item.category} key={idx}/>
          ))}
        </div>
        {showRightCatButton &&  <button onClick={()=>scrollHandler(catScrollRef,"right")} className="absolute right-0 top-1/2 -transparent-y-1/2 text-white bg-[#ff4d2d]  p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10">
          <FaChevronCircleRight />
            
          </button>}
        </div>


        <div className="w-full max-w6xl flex flex-col gap-5 items-start p-[10px]">
             <h1 className="text-gray-800 text-2xl sm:text-3xl">Best shops in {currentCity}</h1>


             <div className="w-full relative " >
          {showLeftShopButton && <button onClick={()=>scrollHandler(shopScrollRef,"left")} className="absolute left-0 top-1/2 -transparent-y-1/2 text-white bg-[#ff4d2d]  p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10">
            <FaChevronCircleLeft />
          </button>}
          <div className="w-full flex overflow-x-auto gap-4 pb-2 " ref={shopScrollRef}>
          {shopsInMyCity?.map((shop,idx) => (
            <CategoryCard name={shop.name} image={shop.image} key={idx}/>
          ))}
        </div>
        {showRightShopButton &&  <button onClick={()=>scrollHandler(shopScrollRef,"right")} className="absolute right-0 top-1/2 -transparent-y-1/2 text-white bg-[#ff4d2d]  p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10">
          <FaChevronCircleRight />
            
          </button>}
        </div>
        </div>


    </div>
    
    <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
       <h1 className="text-gray-800 text-2xl sm:text-3xl">Suggested food items</h1>
   
          <div className="w-full h-auto flex flex-wrap gap-[20px] justify-center">
          {itemsInMyCity?.map((item,index)=>(
            <FoodCart key={index} data={item}/>
          ))}
    </div>
    </div>

    </div>
  );
};

export default UserDashboard;
