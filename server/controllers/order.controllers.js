import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";

export const placeOrder = async (req,res) => {
  try {
    const { cartItems, deliveryAddress, paymentMethod, totalAmount } = req.body;
    if (
      !deliveryAddress.text ||
      !deliveryAddress.longitude ||
      !deliveryAddress.latitude
    ) {
      return res
        .status(400)
        .json({ message: "Delivery address is incomplete" });
    }
    if (!cartItems || cartItems.length == 0) {
      return res.status(400).json({ message: "Cart is invalid or empty" });
    }
    const groupItemsByShop = {};
    cartItems.forEach((item) => {
      const shopId = item.shop;
      if (!groupItemsByShop[shopId]) {
        groupItemsByShop[shopId] = [];
      }
      groupItemsByShop[shopId].push(item);
    });

    const shopOrders =await Promise.all(
      Object.keys(groupItemsByShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("owner");
        if (!shop) {
          return res.status(400).json({ message: "Shop not found" });
        }
        const items = groupItemsByShop[shopId];
        const subtotal = items.reduce((sum, item) => {
          return sum + Number(item.price) * Number(item.quantity);
        }, 0);

        return {
          shop: shop._id,
          owner: shop.owner._id,
          subtotal,
          shopOrderItem: items.map((i) => ({
            item: i.id,
            price: i.price,
            quantity: i.quantity,
            name: i.name,
          })),
        };
      }),
    );

    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
    });
    return res.status(201).json(newOrder);
  } catch (error) {
    return res.status(500).json({ message: `Place order error ${error}` });
  }
};

export const getUserOrders = async (req,res) => {
  try {
    const orders = await Order.find({user:req.userId})
    .sort({createdAt:-1})
    .populate("shopOrders.shop","name")
    .populate("shopOrders.owner","name email mobile")
    .populate("shopOrders.shopOrderItem.item","name image price")

    return res.status(200).json(orders)

    
  } catch (error) {
    return res.status(500).json({message: "Get user orders error"})
  }
}

export const getOwnerOrder = async(req,res) =>{
   try {
    const orders = await Order.find({"shopOrders.owner":req.userId})
    .sort({createdAt:-1})
    .populate("shopOrders.shop","name")
    .populate("user")
    .populate("shopOrders.shopOrderItem.item","name image price")

    return res.status(200).json(orders)

    
  } catch (error) {
    return res.status(500).json({message: "Get owner orders error"})
  }
}