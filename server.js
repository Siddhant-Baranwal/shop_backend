import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
config(); 

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.set('view engine', 'ejs');
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["POST"],
    credentials: true,
  })
)

const schema = new mongoose.Schema({
  name: String,
  phone: Number, 
  item: String,
  arrival: String,
  transaction_id : Number,
})

const Order = mongoose.model('OurOrders', schema);
mongoose.connect(process.env.MONGO_URI, {
  dbName: "placed",
})
.then((c)=> console.log(`Database connected with ${c.connection.host}`))
.catch((e) => console.log(e))

app.post('/order', async (req, res) => {
  try{

    const {transaction_id} = req.body;
    const exists = await Order.findOne({transaction_id});
    if(exists){
      return res.status(400).json({
        success: false,
      })
    }

    await Order.create(req.body);
    res.status(200).json({
      success: true,
    });
  } catch (error){
    res.status(400).json({
      success: false,
    })
  }
})

app.get('/', (req, res) => {
  res.send({message: "Site working."});
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server working on port: ${PORT}`);
});