import express from "express";
import isAuth from "../middleware/isAuth.js";
import {getOwnerOrder, getUserOrders, placeOrder} from '../controllers/order.controllers.js'


const orderRouter = express.Router()

orderRouter.post('/place-order',isAuth,placeOrder)
orderRouter.get('/user-order',isAuth,getUserOrders)
orderRouter.get('/owner-order',isAuth,getOwnerOrder)

export default orderRouter