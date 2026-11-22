const mongoose =require('mongoose');
const DB= async()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/MINI_PROJECT");
        console.log("mongoDB connected ");
    }

    catch(error){
        console.log(error);
    }
}

module.exports=DB;