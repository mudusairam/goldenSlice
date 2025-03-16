const exp=require('express')
const expressAsyncHandler = require('express-async-handler')
const jwt=require('jsonwebtoken')
const userApp=exp.Router()
const bcryptjs=require('bcryptjs')

userApp.use(exp.json())
userApp.post('/register',expressAsyncHandler(async(request,response)=>{
    const userscollection=request.app.get('userscollection')
    const userObj=request.body 
    const isExists=await userscollection.findOne({mobileNo:userObj.mobileNo})
    if(isExists!=null){
        response.send({message:"User already exists"})
    }else{
        const hashedPassword=await bcryptjs.hash(userObj.password,5)
        userObj.password=hashedPassword
        const jwtToken=jwt.sign({user:userObj.mobileNo},'goldenslice',{expiresIn:86400})
        userObj.cart=[]
        userObj.totalAmount=0
        userObj.orders=[]
        await userscollection.insertOne(userObj)
        delete userObj.password
        response.status(201).send({message:"Registered successfully",token:jwtToken,payload:userObj})
    }
}))

userApp.use(exp.json())
userApp.post('/login',expressAsyncHandler(async(request,response)=>{
    const userscollection=request.app.get('userscollection')
    const userObj=request.body
    console.log(userObj)
    const dbUser=await userscollection.findOne({mobileNo:userObj.mobileNo})
    if(dbUser===null){
        response.send({message:"Invalid mobileNo."})
    }else{
        const passFlag=await bcryptjs.compare(userObj.password,dbUser.password)
        if(passFlag==false){
            response.send({message:"Invalid password"})
        }else{
            const jwtToken=jwt.sign({user:userObj.mobileNo},'goldenslice',{expiresIn:86400})
            delete dbUser.password
            response.status(201).send({message:"Logged in successfully",token:jwtToken,payload:dbUser})
        }
    }
}))

userApp.use(exp.json())
userApp.post('/change-password',expressAsyncHandler(async(request,response)=>{
    const userscollection=request.app.get('userscollection')
    const userObj=request.body
    const dbUser=await userscollection.findOne({mobileNo:userObj.mobileNo})
    const passFlag=bcryptjs.compare(userObj.password,dbUser.password)
    if(passFlag==false){
        response.send({message:"Incorrect password"})
    }else{
        const newHashedPassoword=await bcryptjs.hash(userObj.newPassword,5)
        await userscollection.updateOne({mobileNo:userObj.mobileNo},{$set:{password:newHashedPassoword}})
        response.status(201).send({message:"Password changed successfully"})
    }
}))

userApp.use(exp.json())
userApp.post('/forgot-password',expressAsyncHandler(async(request,response)=>{

}))

module.exports=userApp