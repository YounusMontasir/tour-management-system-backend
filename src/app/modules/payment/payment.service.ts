/* eslint-disable @typescript-eslint/no-explicit-any */
import  httpStatus  from 'http-status-codes';
import { Booking } from "../booking/booking.model";
import { Payment } from "./payment.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { BOOKING_STATUS } from "../booking/booking.interface";
import AppError from "../../errorHelpers/AppError";
import { ISSLCommerz } from '../sslCommerz/sslCommerz.interface';
import { SSLService } from '../sslCommerz/sslCommerz.service';




const initPayment =async (bookingId: string) =>{
  const payment = await Payment.findOne({booking: bookingId})
  if(!payment){
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found. You have not booked this tour")
  }

  const booking = await Booking.findById(payment.booking)
  
      const userName = (booking?.user as any).name
      const userEmail = (booking?.user as any).email
      const userAddress = (booking?.user as any).address
      const userPhoneNumber = (booking?.user as any).phone
      const sslPayload: ISSLCommerz = {
          name: userName,
          email: userEmail,
          address: userAddress,
          phoneNumber: userPhoneNumber,
          amount: payment.amount,
          transactionId: payment.transactionId
      } 
  
      const sslPayment = await SSLService.sslPaymentInit(sslPayload)
  
     
      return {
          paymentUrl: sslPayment.GatewayPageURL,
}
}

const successPayment = async (query: Record<string, string>) => {
     const session = await Booking.startSession()
    session.startTransaction()
   try {
    

    const updatedPayment = await Payment.findOneAndUpdate({transactionId: query.transactionId},{
      status: PAYMENT_STATUS.PAID
    }, {session})

    await Booking.findByIdAndUpdate(updatedPayment?.booking,
         {status: BOOKING_STATUS.COMPLETE},
        { runValidators: true, session}
    )
    

    await session.commitTransaction() // transaction
    session.endSession()
    return {success: true, message: "Payment Completed Successfully"}
   } catch (error) {
    await session.abortTransaction() // rollback
    session.endSession()
    throw error
   }
 
};
const failPayment = async (query: Record<string, string>) => {
   const session = await Booking.startSession()
    session.startTransaction()
   try {
    

    const updatedPayment = await Payment.findOneAndUpdate({transactionId: query.transactionId},{
      status: PAYMENT_STATUS.FAILED
    }, {session})

    await Booking.findByIdAndUpdate(updatedPayment?.booking,
         {status: BOOKING_STATUS.FAILED},
        { runValidators: true, session}
    )
    

    await session.commitTransaction() 
    session.endSession()
    return {success: false, message: "Payment Failed"}
   } catch (error) {
    await session.abortTransaction() 
    session.endSession()
    throw error
   }
};


const cancelPayment = async (query: Record<string, string>) => {
 const session = await Booking.startSession()
    session.startTransaction()
   try {
    

    const updatedPayment = await Payment.findOneAndUpdate({transactionId: query.transactionId},{
      status: PAYMENT_STATUS.CANCELLED
    }, {session})

    await Booking.findByIdAndUpdate(updatedPayment?.booking,
         {status: BOOKING_STATUS.CANCEL},
        { runValidators: true, session}
    )
    

    await session.commitTransaction() // transaction
    session.endSession()
    return {success: false, message: "Payment Cancelled"}
   } catch (error) {
    await session.abortTransaction() // rollback
    session.endSession()
    throw error
   }
   
};


export const PaymentService = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
};