const mongoose = require('mongoose'); 
const dotenv = require('dotenv'); 
const app = require('./app'); 

dotenv.config({path: './config.env'}) 

const DB = process.env.LOCAL_DATABASE 
const options = { 
   useNewUrlParser: true, 
   useCreateIndex: true, 
   useFindAndModify: false, 
   useUnifiedTopology: true, 
   autoIndex: true 
} 


mongoose.connect(DB, options) 
   .then(() => console.log('DB Connected - Portfolio') ) 

const PORT = process.env.PORT || 3000; 
app.listen( PORT, () => console.log('App is on fire') ); 
