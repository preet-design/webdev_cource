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
                        const token = jwt.sign({payload:user['_id']},secretkey);
                        console.log(token);
                        //put token into cookies
                        res.cookie("JWT","token ");
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
app.get("/users",function(req,res){
    console.log(req.cookies);
})

app.listen(3000,function(){
    console.log("server started at 3000");
})