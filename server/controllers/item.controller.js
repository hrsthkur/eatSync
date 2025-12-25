import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const addItem = async (req, res) => {
  try {
    const { name, category, price, foodType } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    let shop = await Shop.findOne({ owner: req.userId })
    if (!shop) {
      return res.status(400).json(`Shop not found`);
    }

    const item =await Item.create({ name, category, price, foodType, image, shop });

    shop.items.push(item._id)
    await shop.save()
    shop = await Shop.findById(shop._id).populate("owner").populate({
      path:"items",
      options:{sort:{updatedAt:-1}}
    })
    return res.status(201).json(shop);
  } catch (error) {
    res.status(500).json({ messsage: `Item add error ${error}` });
  }
};
export const editItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { name, category, price, foodType } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const item = await Item.findByIdAndUpdate(
      itemId,
      {
        name,
        category,
        price,
        foodType,
        image,
      },
      { new: true }
    );
    if (!item) {
      return res.status(400).json({ message: `item doesn't exist` });
    }
    const shop =await Shop.findOne({owner:req.userId}).populate({
      path:"items",
      options:{sort:{updatedAt:-1}}
    })

    return res.status(200).json(shop);
  } catch (error) {
    res.status(500).json({ messsage: `edit item  error ${error}` });
  }
};

export const getItemById = async(req,res)=>{
  try {
     const itemId = req.params.itemId;
     
    
  const item = await Item.findById(itemId)
  if (!item) {
      return res.status(400).json({ message: `item doesn't exist` });
    }
  return res.status(200).json(item)
  } catch (error) {
   return res.status(500).json({message: `get item by id error ${error}`})
  }
 
}

export const deleteItem = async(req,res)=>{
  
  try {
    const itemId = req.params.itemId;
    const item =  await Item.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(400).json({ message: `item doesn't exist` });
    }
    const shop = await Shop.findOne({owner:req.userId})
    shop.items = shop.items.filter((i)=>i !== item._id)
    await shop.save();
    await shop.populate({
      path:"items",
      options:{sort:{updatedAt:-1}}
    })
    return res.status(200).json(shop)

  } catch (error) {
     return res.status(500).json({message: `Delet item error ${error}`})
  
  }
}