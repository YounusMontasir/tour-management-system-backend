/* eslint-disable @typescript-eslint/no-explicit-any */
import  httpStatus  from 'http-status-codes';
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { Booking } from './booking.model';
import { Tour } from '../tour/tour.model';
import { BOOKING_STATUS, IBooking } from './booking.interface';
import { Payment } from '../payment/payment.model';
import { PAYMENT_STATUS } from '../payment/payment.interface';
import { SSLService } from '../sslCommerz/sslCommerz.service';
import { ISSLCommerz } from '../sslCommerz/sslCommerz.interface';
import { getTransactionId } from '../../utils/getTransactionId';






const createBooking = async (payload: Partial<IBooking>, userId: string) => {
    const transactionId = getTransactionId()

    const session = await Booking.startSession()
    session.startTransaction()
   try {
     const user = await User.findById(userId)

    if(!user?.phone || !user.address){
        throw new AppError(httpStatus.BAD_REQUEST, "Please update your profile to book a tour.")
    }

    const tour = await Tour.findById(payload.tour).select("costFrom")

    if(!tour?.costFrom){
        throw new AppError(httpStatus.BAD_REQUEST, "No tour cost found")
    }

    const amount = Number(tour?.costFrom) * Number(payload.guestCount)

    const booking = await Booking.create([{
        user: userId,
        status: BOOKING_STATUS.PENDING,
        ...payload
    }], {session})

    const payment = await Payment.create([{
        booking: booking[0]._id,
        status: PAYMENT_STATUS.UNPAID,
        transactionId: transactionId,
        amount: amount
    }], {session})

    const updatedBooking = await Booking.findByIdAndUpdate(booking[0]._id,
         {payment: payment[0]._id},
        {new: true, runValidators: true, session}
    )
    .populate("user", "name email phone address")
    .populate("tour", "title costFrom")
    .populate("payment")

    const userName = (updatedBooking?.user as any).name
    const userEmail = (updatedBooking?.user as any).email
    const userAddress = (updatedBooking?.user as any).address
    const userPhoneNumber = (updatedBooking?.user as any).phone
    const sslPayload: ISSLCommerz = {
        name: userName,
        email: userEmail,
        address: userAddress,
        phoneNumber: userPhoneNumber,
        amount: amount,
        transactionId: transactionId
    } 

    const sslPayment = await SSLService.sslPaymentInit(sslPayload)

    await session.commitTransaction() // transaction
    session.endSession()
    return {
        paymentUrl: sslPayment.GatewayPageURL,
        booking: updatedBooking
    }
   } catch (error) {
    await session.abortTransaction() // rollback
    session.endSession()
    throw error
   }
};



const getUserBookings = async () => {

    return {}
};

const getBookingById = async () => {
    return {}
};

const updateBookingStatus = async (

) => {

    return {}
};

const getAllBookings = async () => {

    return {}
};

export const BookingService = {
    createBooking,
    getUserBookings,
    getBookingById,
    updateBookingStatus,
    getAllBookings,
};