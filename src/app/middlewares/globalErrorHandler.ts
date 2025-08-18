import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { handleCastError } from "../helpers/handleCastError";
import { handleZodError } from "../helpers/handleZodError";
import { handleValidationError } from "../helpers/handleValidationError";
import { TErrorSources } from "../interfaces/errorTypes";



// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) =>{
    if(envVars.NODE_ENV === "development"){
        // eslint-disable-next-line no-console
        console.log(err);
        
    }

    let statusCode = 500
    let message = `Something went wrong! ${err.message}`
    let errorSources: TErrorSources[] = []


    // duplicate error
    if(err.code === 11000){
        const simplifiedError = handleDuplicateError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
    }
    // Object id error or cast error
    else if(err.name === "CastError"){
        const simplifiedError = handleCastError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
    }
    // zod error
    else if(err.name === "ZodError"){
       const simplifiedError = handleZodError(err)
       statusCode = simplifiedError.statusCode
       message = simplifiedError.message
       errorSources = simplifiedError.errorSources as TErrorSources[]
    }
     //Mongoose Validation Error
    else if (err.name === "ValidationError") {
        const simplifiedError  = handleValidationError(err)
        statusCode = simplifiedError.statusCode
        errorSources = simplifiedError.errorSources as TErrorSources[]
        message = simplifiedError.message
       
    }
    else if(err instanceof AppError){
        statusCode = err.statusCode
        message = err.message
    } else{
        statusCode = 500
        message = err.message
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err: envVars.NODE_ENV === "development" ? err : null,
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
}