import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5174";

  try {
    const { userId, items, amount, address } = req.body;

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address
    });

    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd", // ✅ Change to "usd" for Stripe test mode
        product_data: {
          name: item.name
        },
        unit_amount: item.price * 10 // Stripe expects cents
      },
      quantity: item.quantity
    }));

    // Add delivery fee
    line_items.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: "Delivery Charges"
        },
        unit_amount: 20 // Rs.2 → 200 cents
      },
      quantity: 1
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
    });

    res.json({ success: true, session_url: session.url }); // ✅ Correct usage
  } catch (error) {
    console.error("Stripe Checkout Error:", error.message);
    res.json({ success: false, message: "Error creating payment session." });
  }
};

const verifyOrder = async (req,res) => {
        const {orderId,success} = req.body;
        try {
          if (success=="true") {
             await orderModel.findByIdAndUpdate(orderId,{payment:true});
             res.json({success:true,message:"paid"})
          }
          else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false,message:"Not paid"})
          }
        } catch (error) {
          console.log(error);
          res.json({success:false,message:"Error"})
        }
}

// user orders for frontend
const userOrders = async (req,res) => {
     try {
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true,data:orders})
     } catch (error) {
           console.log(error);
           res.json({success:false,message:"Error"})
     }
}

// Listing orders for admin panel
const listOrders = async (req,res) => {
    try {
      const orders = await orderModel.find({});
      res.json({success:true,data:orders})
    } catch (error) {
      console.log(error);
      res.json({success:false,message:"Error"})
    }

}

// api for updating order status
const updateStatus = async (req,res) => {
      try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status Updated"})
      } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
      }
}

export { placeOrder,verifyOrder,userOrders,listOrders,updateStatus };
