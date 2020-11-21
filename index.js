const express = require('express');
const bodyParser  = require("body-parser");
const { ObjectID } = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;

const password = 'organicUser';


const uri = "mongodb+srv://organicUser:organicUser@cluster0.7snuw.mongodb.net/organicdb?retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json());
app.use( bodyParser.urlencoded({ extended: false }));


app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");

  app.get('/products',(req,res)=>{
    productCollection.find({}).limit(5)
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })

  app.post("/addProduct",(req,res)=>{
    const product = req.body;
    productCollection.insertOne(product)
    .then(result=>{
      console.log('data added successfully');
      res.redirect('/')
    })

  })

  app.get('/product/:id',(req,res)=>{
    productCollection.find({_id:ObjectID(req.params.id)})
    .toArray((err,documents)=>{
      res.send(documents[0]);
    })
  })

  app.patch('/update/:id',(req,res)=>{
    console.log(req.body.price);
    productCollection.updateOne({_id:ObjectID(req.params.id)},
    {
      $set:{price: req.body.price, quantity: req.body.quantity}
    })
    .then(result=>{
      res.send(result.modifiedCount>0)
    })
    
  })

  app.delete('/delete/:id',(req,res)=>{
    productCollection.deleteOne({_id:ObjectID(req.params.id)})
    .then(result=>{
      console.log(result);
    })
    
  });
});


app.listen(3000);