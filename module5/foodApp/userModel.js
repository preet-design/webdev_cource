//tech knowledge
//(scheme) -> set of features and rules a certain entity should follow
const mongoose = require('mongoose')
const {Schema} = mongoose
const pass = require("./secrets");


let dbLink = `mongodb+srv://dbuser:pW5Fq26SAJubnUEt@cluster0.rbnthok.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(dbLink).then(function(){
    console.log("connected");
}).catch(function(err){
    console.log("error",err);
})


//how to create a schema -> only entries written will be added to your db no one else.

let userSchema = new Schema({
    name:{
        type:String,
        required:[true,"Your name is missing , Please Enter your name"]
    },
    password:{
        type:String,
        required:[true," Enter your Password"]
    },
    confirmPassword:{
        type:String,
        required:[true," confirm Password is missing"],
        
        //custom validator
     
        validate:{
            validator:function(){
                return this.password == this.confirmPassword;
            },
            //error message
            message:"Password mismatch"
        }
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phoneNumber:{
        type:String,
        minLength:[10,"less than 10 numbers"],
        maxLength:10
    },
    pic:{
        type:String,
        default:"logo2.png"
    },
    otp:{
        type:String,
    },
    address:{
        type:String
    }
})

const userModel = mongoose.model('FoodUserModel',userSchema);

module.exports = userModel;