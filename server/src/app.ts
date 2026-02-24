import express, { Application, Request, Response } from 'express';
import dotenv from "dotenv";
import connectDB from './services/db';
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is running, listening on port "+ PORT);
    else 
        console.log("Error occurred, server can't start", error);
    }
);

const initApp = async () => {
    try{
      const dbUri = process.env.DATABASE_URL as string;
      await connectDB(dbUri);
    }catch(error){
        if (error instanceof Error) {
            console.error(`Error init application: ${error.message}`);
            process.exit(1);
        } else {
            console.error("Error init application:", error);
            process.exit(1);
        }
    }
}

initApp();
