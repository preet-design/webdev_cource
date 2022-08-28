const  express = require("express")

const app = express();

//npm i cookie-Parser
const cookieParser = require("cookie-parser");

//npm i jsonwebtoken
const jwt = require("jsonwebtoken");
const secretkey = "gfaygkrbhlvkreuhjkf"

app.use(express.json());
app.use(cookieParser());
const userModel = require("./userModel");
const { findOneAndUpdate } = require("./userModel");

//signup input:
//name,
//password
//confirm password
//address
//email
//phone
//pic


app.post("/signup", async function(req,res){
    try{
        let data = req.body;
        let newUser =await userModel.create(data);
        console.log(data);
        res.json({
            message:"data recieved",
            //data : data --> for ahow full data in db
        })}
    catch(err){
        res.send(err.message)
    }
})

app.post("/login",async function(req,res){
    try{
        let data = req.body;
        console.log(data);
        let {email, password}=data;
        if(email && password){
            let user = await userModel.findOne({email:email});
            console.log(user);
                if(user){
                    if(user.password == password){
                    //create jwt token --> payload,secretkey,algo by default SHA256
                        const token = jwt.sign({payload:user['_id']},secretkey);   //payload means --> data
                        console.log(token);
                        //put token into cookies
                        res.cookie("JWT",token );
                        res.send("User logged in");
                    }else{
                        res.send("email and password does not match");
                    }
                }else{
                    res.send("User with this email does not exist.Kindly sign up");
                }
        }else{
            res.send("Kindly Enter Correct Email and Password ");
        }
        // console.log(user);
        // res.send("data recieved");
    }catch(err){
            console.log(err.message);
        
    }
})

// app.post("/update",async function(req,res){
//     try(
//         let data = req.body;
//         console.log(data);
//         let{password}=data;
//         let user = await userModel.findOneAndUpdate({password:password});
        
//         if(user){
//             if(user.password == password){
                
//             }else{
//                 res.send("Password is incorrect")
//             }
//         }else{
//             res.send("Enter old Password")
//         }
        
//     )
// })
app.get("/users",protectRoute, async function(req,res){
    // console.log(req.cookies);  // cookies are also shown with this
    try{
    let users = await userModel.find();
    res.json(users);
    }catch(err){
        res.send(err.message);
    }

    // res.send("Read Cookie");
})


app.patch("/forgetPassword",async function(req,res){
    try{
        let {email} = req.body;
        let otp = otpGenerator();
        let user = await userModel.findOneAndUpdate({email:email},{otp:otp},{new:true});
        console.log(user);
        res.json({
            data:user,
            "message":"new otp send to your mail"
        })

    }catch(err){
        res.send(err.message);
    }
})

app.patch("/resetPassword", async function(req,res){
    try{
        let {otp,password,confirmPassword}=req.body;
        let user = await userModel.findOneAndUpdate({otp},{password,confirmPassword},{
            runValidator:true, new:true

        });
    
        console.log(user);
        res.json({
            data:user,
            "message":"Password for the user is reset"
        })
    }catch(err){
        res.send(err.message);
    }
})

function otpGenerator(){
    return Math.floor(Math.random()*1000000);
}

app.get("/user" ,protectRoute,async function(req,res){
    try{
         
        const userId = req.userId;
        const user = await userModel.findById(userId);
        res.json({
            payload:user,
            message:"data about logged in user is send"
        })
    }catch(err){
        res.send(err.message)
    }
})    
        
   
function protectRoute (req,res,next){
    try{
        let cookies = req.cookies;
        let JWT = cookies.JWT;
        
    // let token = cookies.JWT;
    // console.log(token);

        if(cookies.JWT){
            const token = jwt.verify(JWT,secretkey);
            console.log(token);
            let userId = token.payload;
            req.userId = userId;
            next();

        }else{
            res.send("you are not logged in . Kindly Login first");
        }
    }catch(err){
        console.log(err);
        res.send(err.message);
    }

}

app.listen(3000,function(){
    console.log("server started at 3000");
})