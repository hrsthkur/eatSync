import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createShop = async(req,res)=>{
    try {
        const {name,city,state,address} = req.body;
        let image;
        if(req.file){
            image = await uploadOnCloudinary(req.file.path)
        }
        const shop = await Shop.create({
            name,city,state,address,image,owner:req.userId
        })
        await Shop.p
    } catch (error) {
        
    }
}