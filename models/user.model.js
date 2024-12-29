import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userschema = new mongoose.Schema(
    {
        "email":{
            type:String,
            required:true,
            unique:true,
            trim:true,//" user@example.com ", it will be saved as "user@example.com"
            lowercase:true,
            minlength: [6,"Email must be atleast 6 character long"],
            maxlength: [64,"Email Should be less than 64 characters"]

        },
        "password":{
            type:String,
            required:true,
            select:false
        
        }
    }
)
userschema.statics.hashPassword= async function(password){
    return await bcrypt.hash(password,10);
}
userschema.methods.isValidPassword= async function(password){
    return await bcrypt.compare(password,this.password);
}

userschema.methods.generateJWT= async function(){
    const token = jwt.sign(
        { email: this.email },
         process.env.JWT_SECRET,
        { expiresIn: '24h'}
    );
    return token;
}

// statics  are like class it is common for all userschema  and methods are for instance of userschema 
// jwt.sign({ email: this.email }, process.env.SECRET_KEY):
// The jwt.sign() method is used to create a signed token.
// { email: this.email }: The payload of the token, which contains the user's email. This information will be embedded within the token and can be decoded by the server.
// process.env.SECRET_KEY: The secret key used to sign the token. It should be kept private and secure. If an attacker gets access to the secret key, they could potentially create their own valid tokens

const user=mongoose.model("user",userschema);
export default user;