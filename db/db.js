import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
function connect(){
    mongoose.connect(process.env.MONGO_URI).then(()=>{  // then is promise basec command it is executed when the conenction will establish 
//         Promises handle this asynchronous nature: .then() runs on a successful connection. .catch() handles any connection errors.
        console.log("Connected to Mongoose");
    })
    .catch((err)=>{
        console.log(err);
    });
}
export default connect;

