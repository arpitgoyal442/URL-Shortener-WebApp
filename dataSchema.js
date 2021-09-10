//Here We Are definintg the Scgema/Structure of our data

import mongoose from "mongoose";

const dataSchema= mongoose.Schema({
    
    shortenurl:String,
    actualurl:String,
    visits:Number,
    countries:Object,
    browsers:Object,
    os:Object


});



export default mongoose.model("dataSchema",dataSchema);