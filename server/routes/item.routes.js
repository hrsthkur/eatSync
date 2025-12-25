import express from "express"
import isAuth from "../middleware/isAuth.js"
import { addItem, deleteItem, editItem, getItemById } from "../controllers/item.controller.js"
import { upload } from "../middleware/multer.js"




const itemRouter = express.Router()

itemRouter.post('/add-item',isAuth,upload.single("image"),addItem)
itemRouter.post('/edit-item/:itemId',isAuth,upload.single("image"),editItem)
itemRouter.get('/get-by-id/:itemId',getItemById)
itemRouter.get('/delete/:itemId',isAuth,deleteItem)

export default itemRouter