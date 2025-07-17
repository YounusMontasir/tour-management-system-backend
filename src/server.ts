/* eslint-disable no-console */
import {Server} from 'http'

import mongoose from 'mongoose';
import app from './app';
import { envVars } from './app/config/env';
import { seedSuperAdmin } from './app/utils/seedSuperAdmin';

let server: Server;

const startServer = async () =>{
    try {
        await mongoose.connect(envVars.DB_URL)

        console.log("Connect to DB");

        server = app.listen(envVars.PORT, ()=>{
            console.log(`Server is listening at port ${envVars.PORT}`);
            
        })
        
    } catch (error) {
        console.log(error);
        
    }
}

(async()=>{
    await startServer()
    await seedSuperAdmin()
})()

process.on("SIGTERM", ()=>{
    console.log("Unhandled Rejection Detected....Server Shutting Down..");

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
    
})

process.on("unhandledRejection", (err)=>{
    console.log("Unhandled Rejection Detected....Server Shutting Down..", err);

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
    
})

process.on("uncaughtException", (err)=>{
    console.log("Uncaught Exception Detected....Server Shutting Down..", err);

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
    
})
// unhadled rejection
// Promise.reject(new Error("I forget to catch this Promise"))
// uncaught exception
// throw new Error ("I forgot to handle this local error")

