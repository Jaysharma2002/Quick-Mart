import {Product,User,Order} from './Schema.js'
import Razorpay from 'razorpay'
export const fetch=async(req,res)=>{
    try {
        const data=await Product.find().populate({
            path:'reviews.user_id',
            select:'name'
        })
        if(data.length===0)
        {
            return res.status(404).json({message:"No Product Found"})
        }
        return res.status(200).json(data)
    } 
    catch (error) 
    {
     return res.status(404).json({error:"Internal Server Error"})   
    }
}

export const create = async (req, res) => {
    try {
        let products = req.body;

        // Ensure products is an array
        if (!Array.isArray(products)) {
            products = [products];
        }

        // Format images field for each product
        products = products.map(product => {
            if (product.images && typeof product.images === "string") {
                product.images = product.images.split(',').map(img => img.trim());
            }
            return product;
        });

        // Check if any product already exists
        const existingTitles = await Product.find({ title: { $in: products.map(p => p.title) } }).distinct("title");
        const newProducts = products.filter(p => !existingTitles.includes(p.title));

        if (newProducts.length === 0) {
            return res.status(200).json({ message: "All products already exist" });
        }

        // Save new products to the database
        const savedProducts = await Product.insertMany(newProducts);
        return res.status(200).json(savedProducts);
    } catch (error) {
        console.error("Error in create function:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const update = async (req, res) => {
    try {
      const id = req.params.id;
      console.log("Updating product with ID:", id);
      console.log("Request body:", req.body);
  
      if (req.body.images && typeof req.body.images === "string") {
        req.body.images = req.body.images.split(',').map(img => img.trim());
      }
  
      // Handle quantity update separately
      if (req.body.quantity !== undefined) {
        const newQuantity = Number(req.body.quantity);
        if (!isNaN(newQuantity)) {
          console.log("Updating sizes[0].quantity to:", newQuantity);
  
          await Product.updateOne(
            { _id: id, "sizes.0": { $exists: true } },
            { $set: { "sizes.0.quantity": newQuantity } }
          );
  
          delete req.body.quantity; // Remove from body to prevent root update
        } else {
          return res.status(400).json({ message: "Invalid quantity value" });
        }
      }
  
      // Now update the remaining fields
      const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
      });
  
      if (!updatedProduct) {
        return res.status(404).json({ message: "No Product Found" });
      }
  
      return res.status(200).json(updatedProduct);
    } catch (error) {
      console.error("Error in update:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
    

export const delete1=async(req,res)=>{
    try {
        const id =req.params.id
        const productExist=await Product.findById(id)
        if(!productExist)
        {
            return res.status(404).json({message:"No Product Found"})
        }
        await Product.findByIdAndDelete(id)
        return res.status(200).json({message:"User Deleted Successfully"})
    } catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}

export const payment=async(req,res)=>{
    try{
        const razorpay=new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_KEY_SECRET})
            const options=req.body;
            const orders=await razorpay.orders.create(options)
            if(!orders)
            {
                return res.status(500).json({message:"No Orders"})
            }
            return res.json(orders)
    }
    catch(error){
        return res.status(404).json({error:"Internal Server Error"})
    }
}

export const alluser=async(req,res)=>{
    try{
        const { name, email, password} = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const user=await User.create({
            profileimage:'',
            name,
            email,
            password,
            address:'',
            phone:'',
            gender:'',
            age:''
        })
        return res.status(201).json(user);
    }
    catch(error){
        return res.status(404).json({error:"Internal Server Error"})
    }
}

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email is not registered" });
        }
        if (user.password === password) {
            const uid=user._id
            req.session.userId=uid
            await req.session.save();
            return res.status(200).json({ message: "Success",uid:uid});
        } else {
            return res.status(401).json({ message: "Incorrect Password" });
        }
    } catch (error) {
        console.error("Error during signin:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const order=async(req,res)=>{
    try {
        console.log('new order',req.session.userId)
        const UserId=req.session.userId;
        const user=await User.findById(UserId)
        const userName=user.name
        const userEmail=user.email
        const userAddress=user.address
        const userPhone=user.phone
        const { products } = req.body;

        const orders=[]

        if (!products || products.length === 0) {
            return res.status(400).json({ message: 'Products array is required' });
        }

        for (const product of products) {
            const dbProduct = await Product.findById(product._id);
            if (!dbProduct) {
                continue; // or handle as error
            }

            // Reduce quantity from the correct size
            const sizeToUpdate = dbProduct.sizes.find(s => s.size === product.sizes[0].size);
            console.log(sizeToUpdate)
            if (sizeToUpdate) {
                if (sizeToUpdate.quantity < product.quantity) {
                    return res.status(400).json({ message: `Insufficient stock of ${product.title}` });
                }
                console.log("Trying to decrease the quantity")
                sizeToUpdate.quantity -= product.quantity;
            }

            await dbProduct.save();

        // Create the order
            const order = new Order({
                userId:UserId,
                userName:userName,
                userEmail:userEmail,
                userAddress:userAddress,
                userPhone:userPhone,
                items:{
                    product: product._id,
                    title: product.title,
                    images: product.images,
                    quantity: product.quantity,
                    size:product.sizes[0].size,
                    price: product.price,
                },
                paymentStatus: 'Completed',
                orderDate: new Date(),
                orderStatus:'Placed'
            });
            await order.save();
            orders.push(order)
        }
        res.status(201).json({ message: 'Order created successfully', orders });
    }
    catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}

export const getorder=async (req,res)=>{
    try {
        const data=await Order.find()
        if(data.length===0){
            return res.status(404).json({message:'NO Orders Found'})
        }
        return res.status(201).json(data)
        
    } catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}

export const updateorder=async(req,res)=>{
    try {
        const {changeOption}=req.body
        const{selectedOrders}=req.body
        if (!changeOption || !selectedOrders || !Array.isArray(selectedOrders)) {
            return res.status(400).json({ error: "Invalid input data" });
        }
        const updatedorders=[]
        for(const id of selectedOrders){
            const updatedorder=await Order.findByIdAndUpdate(id,{orderStatus:changeOption.orderStatus},{new:true})
            updatedorders.push(updatedorder)
        }
        return res.json(updatedorders)
    } catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}

export const getuserorder = async (req, res) => {
    try {
        console.log(req.session);
        const userId = req.session.userId;

        const orders = await Order.find({ userId: userId })
            .populate({
                path: 'items.product', 
                select: 'reviews',  
            });

        if (orders.length === 0) {
            return res.status(404).json({ message: "Order does not exist" });
        }

        return res.json(orders);
    } catch (error) {
        console.error(error); 
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


export const cancelorder=async(req,res)=>{
    try {
        const { id } = req.body;

        const existingOrder = await Order.findById(id);
        if (!existingOrder) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Make sure order is not already cancelled
        if (existingOrder.orderStatus === 'Cancelled') {
            return res.status(400).json({ error: "Order is already cancelled" });
        }
        const { product: productId, quantity, size } = existingOrder.items;
        console.log(existingOrder,productId,quantity,size)
        const dbProduct = await Product.findById(productId);
        if (dbProduct) {
            const sizeToUpdate = dbProduct.sizes.find(s => s.size === size);
            if (sizeToUpdate) {
                sizeToUpdate.quantity += quantity;
                await dbProduct.save();
            }
        }

        const updatedOrder = await Order.findByIdAndUpdate(id,{ orderStatus: 'Cancelled' },{ new: true });
        return res.json([updatedOrder]);
    }
    catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}
export const userprofile=async(req,res)=>{
    try {
        const userId=req.session.userId
        console.log(userId)
        const user=await User.findById(userId)
        if(!user)
        {
            return res.status(404).json({message:"No User Found"})
        }
        return res.json(user)
    } catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}
export const updateprofile=async(req,res)=>{
    try {
        const userId=req.session.userId
        console.log(userId)
        const updateData={...req.body}
        if(req.file)
        {
            updateData.profileimage = `/uploads/${req.file.filename}`;
        }
        const user=await User.findByIdAndUpdate(userId,updateData,{new:true})
        if(!user)
            {
                return res.status(404).json({message:"No User Found"})
            }
        return res.json(user)
    } catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}
export const profileimage=async(req,res)=>{
    try {
        const userId=req.session.userId
        const user=await User.findById(userId)
        if(!user){
            return res.status(404).json({message:"No User Found"})
        }
        const profileimageurl=user.profileimage
        return res.json(profileimageurl)
        
    } catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}
export const updateaddress=async(req,res)=>{
    try{
        const userId=req.session.userId
        const user=await User.findByIdAndUpdate(userId,req.body,{new:true})
        if(!user){
            return res.status(404).json({message:"No User Found"})
        }
        return res.json(user)
    }
    catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}
export const getaddress=async(req,res)=>{
    try {
        const userid=req.session.userId
        const user=await User.findById(userid)
        if(!user)
        {
            return res.status(404).json({message:"No User Found"})
        }
        return res.json(user)
        
    } catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}

export const saverating = async (req, res) => {
    try {
        const userId = req.session.userId;
        console.log("Session Data:", req.session);
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: UserId is required' });
        }
        const { productId, rating ,orderId} = req.body;
        console.log("Incoming Data:", { productId, rating });
        if (!productId || rating === undefined || !orderId) {
            return res.status(400).json({ message: 'OrderId and Rating are required' });
        }
        const product = await Product.findById(productId);
        if (!product) {
            console.log("Order not found for ID:", productId);
            return res.status(404).json({ message: 'No Order Found' });
        }
        if (!product.reviews) {
            product.reviews = [];
        }
        const existingReviewIndex = product.reviews.findIndex((review) => review.user_id.toString() === userId);
        if (existingReviewIndex !== -1) {
            product.reviews[existingReviewIndex].rating = rating;
            product.reviews[existingReviewIndex].date = Date.now();
        } else {
            product.reviews.push({ user_id: userId, rating, date: Date.now(),order_id:orderId });
        }
        await product.save();
        console.log(product.reviews)
        return res.json({ message: "Rating saved successfully", reviews: product.reviews });
    } catch (error) {
        console.error("Error in saverating:", error);
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

export const savecomment=async(req,res)=>{
    try {
        const userId = req.session.userId;
        console.log("Session Data:", req.session);
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized: UserId is required' });
        }
        const { productId, comment ,orderId } = req.body;
        console.log("Incoming Data:", { productId, comment });
        if (!productId || !comment) {
            return res.status(400).json({ message: 'OrderId and Comment are required' });
        }
        const product = await Product.findById(productId);
        if (!product) {
            console.log("Order not found for ID:", productId);
            return res.status(404).json({ message: 'No Order Found' });
        }
        if (!product.reviews) {
            product.reviews = [];
        }
        const existingReviewIndex = product.reviews.findIndex((review) => review.user_id.toString() === userId);
        if (existingReviewIndex !== -1) {
            product.reviews[existingReviewIndex].comment = comment;
            product.reviews[existingReviewIndex].date = Date.now();
        } else {
            product.reviews.push({ user_id: userId, comment, date: Date.now(),order_id:orderId});
        }
        await product.save();
        console.log(product.reviews)
        return res.json({ message: "Rating saved successfully", reviews: product.reviews });
    } catch (error) {
        console.error("Error in saverating:", error);
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}

export const logout=async(req,res)=>{
    try {
        req.session.destroy((err) => {
            if (err) {
                console.log("Error destroying session:", err);
                return res.status(500).json({ message: "Logout failed" });
            }
            res.clearCookie('connect.sid'); // Clears session cookie
            return res.status(200).json({ message: "Logged out successfully" });
        });
    } catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}

