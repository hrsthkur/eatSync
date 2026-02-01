import React from "react";
import { MdPhone } from "react-icons/md";

function OwnerOrderCard({ data }) {
  
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          {data.user.fullName}
        </h2>
        <p className="text-sm text-gray-500">{data.user.email}</p>

        <p className="flex items-center gap-2 text-sm text-gray-600 mt-1">
          <MdPhone />
          <span>{data.user.mobile}</span>
        </p>
      </div>

      <div className="flex items-start flex-col gap-2 text-gray-600 text-sm">
        <p>{data?.deliveryAddress?.text}</p>

        <p className="text-xs text-gray-500">
          Lat: {data?.deliveryAddress?.latitude}, Lon:{" "}
          {data?.deliveryAddress?.longitude}
        </p>
      </div>

      <div className="flex space-x-4 overflow-auto pb-2">
              {data.shopOrders?.shopOrderItem.map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-40 border rounded-lg p-2 bg-white"
                >
                  <img
                    className="w-full rounded h-24 object-cover "
                    src={item.item.image}
                    alt=""
                  />
                  <p className="font-semibold text-sm mt-1">{item.name}</p>
                  <p className=" text-xs text-gray-500">
                    ₹{item.price} x {item.quantity}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
              <span className="text-sm">Status: <span className="font-semibold capitalize text-[#ff4d2d]">{data.shopOrders?.status}</span></span>
            <select className="rounded-md border px-3 py-1 border-[#ff4d2d] text-[#ff4d2d] text-sm focus:outline-none focus:ring-2 " name="" id="" value={data.shopOrders?.status}>
              <option value="pending">Pending</option>
              <option value="Preparing">Preparing</option>
              <option value="Out for delivery">Out for delivery</option>
            </select>
            
              <div className="text-right font-bold text-gray-800 text-sm">
                Total: ₹{data.shopOrders.subtotal}
              </div>


            </div>

    </div>
  );
}

export default OwnerOrderCard;
