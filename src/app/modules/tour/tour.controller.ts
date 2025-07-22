/* eslint-disable @typescript-eslint/no-unused-vars */
import  httpStatus  from 'http-status-codes';
import { NextFunction, Request, Response } from "express"
import { sendResponse } from "../../utils/sendResponse"
import { catchAsync } from '../../utils/catchAsync';
import { TourServices } from './tour.service';

const createTour = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
    const tour = await TourServices.createTour(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Tour Created Successfully",
        data: tour,
    })
})

const updateTour = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
       const { id } = req.params;
       const payload = req.body
    const result = await TourServices.updateTour(id, payload);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour updated successfully',
        data: result,
    });
})

const getAllTour = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
    const query = req.query
     const result = await TourServices.getAllTour(query as Record<string, string>);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'All Tours retrieved successfully',
        data: result.data,
        meta: result.meta

    });
})

const deleteTour = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
      const { id } = req.params;
    const result = await TourServices.deleteTour(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour deleted successfully',
        data: result,
    });
})

const createTourType = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
    const tourType = await TourServices.createTourType(req.body)

    sendResponse(res, {
         success: true,
        statusCode: httpStatus.CREATED,
        message: "Tourtype Created Successfully",
        data: tourType,
    })
})

const updateTourType = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
       const { id } = req.params;
       const payload = req.body
    const result = await TourServices.updateTourType(id, payload);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type updated successfully',
        data: result,
    });
})

const getAllTourType = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
     const result = await TourServices.getAllTourType();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour types retrieved successfully',
        data: result,
    });
})

const deleteTourType = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{
      const { id } = req.params;
    const result = await TourServices.deleteTourType(id);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type deleted successfully',
        data: result,
    });
})


export const TourControllers = {
    createTourType,
    updateTourType,
    getAllTourType,
    deleteTourType,
    createTour,
    getAllTour,
    updateTour,
    deleteTour
}