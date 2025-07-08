import express, { Request, Response } from 'express'


const app = express();


app.get('/', (req: Request, res: Response)=>{
    res.json({message: "Welcome to Tour management system backend"})
})

export default app;