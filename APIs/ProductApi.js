const exp=require('express')
const expressAsyncHandler = require('express-async-handler')
const productApp=exp.Router()

productApp.use(exp.json())
productApp.get(`/get-products/:cat`,expressAsyncHandler(async(request,response)=>{
    const cat=request.params.cat
    const productscollection=request.app.get('productscollection')
    let productsCursor
    if(cat=="all"){
         productsCursor=await productscollection.find({})
    }else{
        productsCursor=await productscollection.find({category:cat})
    }
    const products = await productsCursor.toArray(); 
    response.status(200).send({message:`${cat} products`,payload:products})
}))

productApp.use(exp.json())
productApp.get('/get-cart/:userId',expressAsyncHandler(async(request,response)=>{
    const userId=request.params.userId
    console.log(userId)
    const userscollection=request.app.get('userscollection')
    const userObj=await userscollection.findOne({mobileNo:userId})
    response.status(200).send({message:"Cart items",payload:userObj})
}))


productApp.use(exp.json())
productApp.get(`/get-orders/:userId`,expressAsyncHandler(async(request,response)=>{
    const userId=request.params.userId
    const userscollection=request.app.get('userscollection')
    const userObj=await userscollection.findOne({mobileNo:userId})
    response.status(200).send({message:"Orders",payload:userObj})
}))


// productApp.use(exp.json())
// productApp.post('/add-to-cart',expressAsyncHandler(async(request,response)=>{
//     const {userId,productId,productName,price,quantity}=request.body
//     const userscollection=request.app.get('userscollection')
//     const userObj=await userscollection.findOne({mobileNo:userId})
//     console.log(userObj)
//     const exisitingProduct=userObj.cart.find(item=>item.productId.toString()===productId)
//     if(exisitingProduct){
//         exisitingProduct.quantity+=1
//         exisitingProduct.totalCost+=price*quantity
//     }else{
//         totalCost=price*quantity
//         userObj.cart.push({productId,productName,price,quantity,totalCost})
//     }
//     userObj.totalAmount+=price 
//     await userObj.save()
//     response.status(200).send({message:"Added to cart successfully",totalAmount:userObj.totalAmount,cart:userObj.cart})
// }))

productApp.use(exp.json());

productApp.post('/add-to-cart', expressAsyncHandler(async (request, response) => {
    const { userId, productId, productName, price, quantity ,category,discountPrice} = request.body;
    const userscollection=request.app.get('userscollection')
    const result = await userscollection.updateOne(
        { mobileNo: userId, "cart.productId": productId },
        {
            $inc: { "cart.$.quantity": quantity, "totalAmount": discountPrice * quantity, "cart.$.totalCost": discountPrice * quantity} // Increase quantity and total amount
        }
    );
    if (result.matchedCount === 0) {
        await userscollection.updateOne(
            { mobileNo: userId },
            {
                $push: { cart: { productId, productName, price, quantity, totalCost: discountPrice * quantity ,category,discountPrice} },
                $inc: { totalAmount: discountPrice * quantity }
            }
        );
    }
    const userObj=await userscollection.findOne({mobileNo:userId})
    response.status(200).send({ message: "Added to cart successfully" ,payload:userObj});
}));

// productApp.use(exp.json())
// productApp.put(`/remove-from-cart/:userId/:productId`,expressAsyncHandler(async(request,response)=>{
//     const {userId,productId}=request.params
//     const userscollection=request.app.get('userscollection')
//     const userObj=await userscollection.findOne({mobileNo:userId})
//      const productIndex = userObj.cart.findIndex((item) => item.productId.toString() === productId);
//     const product = userObj.cart[productIndex];
//     product.quantity -= quantity;
//     if (product.quantity === 0) {
//       userObj.cart.splice(productIndex, 1); // Remove the product from cart
//     }
//     userObj.totalAmount -= product.price * quantity;
//     await userObj.save();
//     response.status(200).send({message:"Removed from cart succefully",totalAmount:userObj.totalAmount,cart:userObj.cart})

// }))
productApp.use(exp.json());

productApp.post('/remove-from-cart', expressAsyncHandler(async (request, response) => {
    const { productId,userId,quantity } = request.body; // Quantity to decrement is passed in the request body

    const userscollection = request.app.get('userscollection');

    // Update the user's cart
    const user = await userscollection.findOne({ mobileNo: userId });

    if (!user) {
        return response.status(404).send({ message: "User not found" });
    }

    const product = user.cart.find((item) => item.productId.toString() === productId);

    if (!product) {
        return response.status(404).send({ message: "Product not found in cart" });
    }

    // Adjust quantity or remove the product
    if (product.quantity - quantity <= 0) {
        // Remove the product if quantity becomes 0 or less
        await userscollection.updateOne(
            { mobileNo: userId },
            {
                $pull: { cart: { productId: productId } },
                $inc: { totalAmount: -(product.discountPrice * product.quantity) }
            }
        );
    } else {
        // Update the product's quantity and total cost
        await userscollection.updateOne(
            { mobileNo: userId, "cart.productId": productId },
            {
                $set: { "cart.$.quantity": product.quantity - quantity, "cart.$.totalCost": (product.quantity - quantity) * product.discountPrice },
                $inc: { totalAmount: -(product.discountPrice * quantity) }
            }
        );
    }

    const updatedUser = await userscollection.findOne({ mobileNo: userId });

    response.status(200).send({ 
        message: "Removed from cart successfully", 
        payload:updatedUser
    });
}));



// productApp.use(exp.json())
// productApp.put(`/add-to-orders/:userId`,expressAsyncHandler(async(request,response)=>{
//     const userId=request.params
//     const userscollection=request.app.get('userscollection')
//     const userObj=await userscollection.findOne({mobileNo:userId})
//     const orderDetails = userObj.cart.map(item => ({
//         productId: item.productId,
//         name: item.name,
//         price: item.price,
//         quantity: item.quantity,
//         totalCost: item.price * item.quantity, 
//       }));
//       userObj.orders = userObj.orders || []
//       userObj.orders.push({
//         orderDate: new Date(),
//         items: orderDetails,
//         totalAmount: userObj.totalAmount,
//       });
//       userObj.cart=[]
//       userObj.totalAmount=0
//       await userObj.save()
//       response.status(200).send({message:"Ordered successfully"})
// }))

productApp.use(exp.json());

productApp.post(`/add-to-orders`, expressAsyncHandler(async (request, response) => {
    const { userId } = request.body;
    const userscollection = request.app.get('userscollection');

    // Find the user by mobile number
    const userObj = await userscollection.findOne({ mobileNo: userId });

    // Prepare order details
    const orderDetails = userObj.cart.map(item => ({
        productId: item.productId,
        name: item.productName,
        price: item.price,
        discountPrice:item.discountPrice,
        quantity: item.quantity,
        totalCost: item.discountPrice * item.quantity,
    }));

    // Add the new order
    const newOrder = {
        orderDate: new Date(),
        items: orderDetails,
        totalAmount: userObj.totalAmount,
    };

    // Update the user document
    await userscollection.updateOne(
        { mobileNo: userId },
        {
            $push: { orders: newOrder }, // Add the new order to the orders array
            $set: {
                cart: [],           // Clear the cart
                totalAmount: 0,     // Reset total amount
            },
        }
    );

    response.status(200).send({ message: "Ordered successfully" });
}));


module.exports=productApp