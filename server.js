const mongoose=require('mongoose')
const exp=require('express')
const app=exp()
const path = require('path');
app.listen(4900,()=>console.log("Server is listening at 4900...."))


// Serve React build folder (directly from 'build' folder)
app.use(exp.static(path.join(__dirname, 'build')));

// All Routes Handling
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


const cors=require('cors')
app.use(cors())


const userApp=require('./APIs/UserApi')
app.use('/user',userApp)

const productApp=require('./APIs/ProductApi')
app.use('/product',productApp)

const mclient=require('mongodb').MongoClient
mclient.connect('mongodb+srv://mudududlasairam:ksPn_1374@cluster0.b1iixss.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
   
  tls: true,
  tlsInsecure: true})
.then((dbRef)=>{
    const dbObj=dbRef.db('goldenSLice')
    const userscollection=dbObj.collection('userscollection')
    const productscollection=dbObj.collection('productscollection')
    app.set('userscollection',userscollection)
    app.set('productscollection',productscollection)
    console.log('DB connceted successfully...')
})
.catch((err)=>{
    console.log(err)
})

const errorHandlingMiddleware=(error,request,response,next)=>{
    response.send({message:error.message})
}
app.use(errorHandlingMiddleware)