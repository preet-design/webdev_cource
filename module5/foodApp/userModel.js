//tech knowledge
//(scheme) -> set of features and rules a certain entity should follow
const mongoose = require('mongoose')

let dbLink =  `mongodb+srv://db_user:FjepwMzTQpkYCDHl@cluster0.rbnthok.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(dbLink).then(function(){
    console.log("connected");
}).catch(function(err){
    console.log("error",err);
})

