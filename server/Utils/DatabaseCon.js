import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const DB = process.env.DB_URI;
// console.log("Db_uri",DB);
const DataBaseConnection = async () =>{
    if(!DB){
        console.error('Error: MONGODB_URI enviroment variable not found');
        process.exit(1);
    }
    try{
        await mongoose.connect(DB);
        console.log('Connected Successfully to MongoDB...');
    }catch (error){
        console.error('Failed to connect to MongoDB...',error);
        process.exit(1);
    }
}

export default DataBaseConnection;