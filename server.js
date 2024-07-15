const express = require("express");
const app = express();
const cors = require('cors')
const authRoute = require('./routes/authRoute')
const userRoute = require('./routes/userRoute')
const fdRoute = require('./routes/fdRoute')
const transactionRoute = require('./routes/transactionRoute')
const port = process.env.PORT || 5000;
const connectDB = require('./db/conn'); 
require('dotenv').config(); 

app.use(express.json())
app.use(cors())
connectDB();

app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/transaction', transactionRoute)
app.use('/api/fd', fdRoute)

app.listen(port, () => {
    console.log(`listening to port ${port}`);
});



