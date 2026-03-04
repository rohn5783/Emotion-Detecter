import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Name is required"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    }
})
// userSchema.pre("save",async function(next){})
// userSchema.post("save",async function(next){})

const User = mongoose.model("User",userSchema)



export default User