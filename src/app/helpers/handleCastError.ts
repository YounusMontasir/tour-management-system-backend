import mongoose from "mongoose"
import { TGenericErrorResponse } from "../interfaces/errorTypes"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleCastError = (err: mongoose.Error.CastError) :TGenericErrorResponse =>{
    return {
        statusCode : 400,
        message : "Invalid MongoDB Object ID. Please provide a valid ID"
    }
}