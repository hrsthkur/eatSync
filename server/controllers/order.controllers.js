import DeliveryAssignment from "../models/deliveryAssignment.model.js";
import Order from "../models/order.model.js";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";

export const placeOrder = async (req, res) => {
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

    const shopOrders = await Promise.all(
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
    await newOrder.populate(
      "shopOrders.shopOrderItem.item",
      "name image price",
    );
    await newOrder.populate("shopOrders.shop", "name");
    return res.status(201).json(newOrder);
  } catch (error) {
    return res.status(500).json({ message: `Place order error ${error}` });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role == "user") {
      const orders = await Order.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("shopOrders.owner", "name email mobile")
        .populate("shopOrders.shopOrderItem.item", "name image price");

      return res.status(200).json(orders);
    }
    if (user.role == "owner") {
      const orders = await Order.find({ "shopOrders.owner": req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("user")
        .populate("shopOrders.shopOrderItem.item", "name image price");

      const filteredOrders = orders.map((order) => ({
        _id: order._id,
        paymentMethod: order.paymentMethod,
        user: order.user,
        shopOrders: order.shopOrders.find((o) => o.owner._id == req.userId),
        createdAt: order.createdAt,
        deliveryAddress: order.deliveryAddress,
      }));

      return res.status(200).json(filteredOrders);
    }
  } catch (error) {
    return res.status(500).json({ message: "Get  orders error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;
    const order = await Order.findById(orderId);

    const shopOrder = order.shopOrders.find((o) => o.shop == shopId);
    if (!shopOrder) {
      return res.status(400).json({ message: `Shop Order not found ${error}` });
    }
    shopOrder.status = status;
    let deliveryPartnersPayload = []
    if (status == "out for delivery" || !shopOrder.assignment) {
      const { longitude, latitude } = order.deliveryAddress;
      const nearByDeliveryPartners = await User.find({
        role: "deliveryPartner",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 5000000000,
          },
        },
      });

      const nearByIds = nearByDeliveryPartners.map((person) => person._id);
      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $nin: ["broadcasted", "completed"] },
      }).distinct("assignedTo");

      const busyIdSet = new Set(busyIds.map((id) => String(id)));

      const availablePartners = nearByDeliveryPartners.filter(
        (p) => !busyIdSet.has(String(p._id)),
      );

      const candidates = availablePartners.map((p) => p._id);

      if(candidates.length == 0){
        await order.save()
        return res.json({
          message:"Order status updated but no delivery partners available"
        })
      }

      const deliveryAssignment = await DeliveryAssignment.create({
        order:order._id,
        shop:shopOrder.shop,
        shopOrderId:shopOrder._id,
        broadcastedTo:candidates,
        status:"broadcasted"
      })
      shopOrder.assignedDeliveryBoy=deliveryAssignment.assignedTo
      shopOrder.assignment=deliveryAssignment._id
      deliveryPartnersPayload = availablePartners.map(b=>({
        id:b._id,
        fullname:b.fullName,
        longitude:b.location.coordinates?.[0],
        latitude:b.location.coordinates?.[1],
        mobile:b.mobile
      })) 
    }



    await shopOrder.save();
    await order.save();

    const updatedShopOrder = order.shopOrders.find(o=>o.shop == shopId)
    await order.populate("shopOrders.shop","name")
    await order.populate("shopOrders.assignedDeliveryBoy","fullName,email,mobile")

    


    return res.status(200).json({
      shopOrder:updatedShopOrder,
      assignedDeliveryPartner:updatedShopOrder?.assignedDeliveryBoy,
      availableDeliveryPartners:deliveryPartnersPayload,
      assignment:updatedShopOrder?.assignment._id

    });
  } catch (error) {
    return res.status(500).json({ message: `Update status error ${error}` });
  }
};
