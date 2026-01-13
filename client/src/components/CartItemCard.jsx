import React from 'react'
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { IoTrashBin } from "react-icons/io5";
import {useDispatch} from 'react-redux'
import { removeCartItem, updateQuantity } from '../redux/userSlice';
function CartItemCard({data}) {
    const dispatch = useDispatch()
    const handleIncrease = (id,currentQuantity)=>{
        dispatch(updateQuantity({id,quantity:currentQuantity+1}))
    }
    const handleDecrease = (id,currentQuantity)=>{
        if(currentQuantity > 1){
            dispatch(updateQuantity({id,quantity:currentQuantity-1}))
        }
        
    }
    const handleDelete = (id) =>{
        dispatch(removeCartItem(id))
    }
    
  return (
    <div className='flex items-center justify-between bg-white p-4 rounded-xl shadow border'>
        <div className='flex items-center gap-4'>
            <img src={data.image} className='w-20 h-20 object-cover rounded-lg border'/>
            <div >
            <h1 className='font-medium text-gray-800'>{data.name}</h1>
            <p className='text-sm text-gray-500'>₹{data.price} x {data.quantity}</p>
            <p className='font-bold text-gray-900'>₹{data.price*data.quantity}</p>
            </div>
        </div>
      <div className='flex items-center gap-3'>
        <button  className='p-2 bg-gray-100 rounded-full hover:bg-gray-200' onClick={()=>handleDecrease(data.id,data.quantity)}>
                  <FaMinus size={12} />
                </button>
                <span>{data.quantity}</span>
                <button onClick={()=>handleIncrease(data.id,data.quantity)}   className='p-2 bg-gray-100 rounded-full hover:bg-gray-200'>
                <FaPlus size={12}/>
                </button>
                <button onClick={()=>handleDelete(data.id)} >
                    <IoTrashBin size={15}/>
                </button>
      </div>
    </div>
  )
}

export default CartItemCard
