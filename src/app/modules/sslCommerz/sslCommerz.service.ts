import  httpStatus  from 'http-status-codes';
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { ISSLCommerz } from "./sslCommerz.interface";
import axios from 'axios'

const sslPaymentInit =async (payload: ISSLCommerz) =>{
   try {
     const data = {
        store_id:envVars.SSL.STORE_ID,
store_passwd: envVars.SSL.STORE_PASS,  
total_amount: payload.amount,
currency: "BDT",
tran_id: payload.transactionId,
success_url: `${envVars.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
fail_url: `${envVars.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
cancel_url: `${envVars.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
shipping_method: "N/A",
product_name: "Tour",
product_category: "Service",
product_profile: "general",
cus_name: payload.name,
cus_email: payload.email,
cus_add1: payload.address,
cus_add2: "N/A",
cus_city: "Chattogram",
cus_state: "Chattogram",
cus_postcode: "1000",
cus_country: "Bangladesh",
cus_phone: payload.phoneNumber,
cus_fax: "01123456789",
ship_name: "N/A",
ship_add1: "N/A",
ship_add2: "N/A",
ship_city: "N/A",
ship_state: "N/A",
ship_postcode: "N/A",
ship_country: "N/A",
// multi_card_name: "N/A",
// value_a: "N/A",
// value_b: "N/A",
// value_c: "N/A",
// value_d: "N/A",
    }

    const response = await axios({
        method: "POST",
        url: envVars.SSL.SSL_PAYMENT_API,
        data: data,
        headers: {"Content-Type": "application/x-www-form-urlencoded"}
    })

    return response.data
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   } catch (error: any) {
    // eslint-disable-next-line no-console
    console.log("Payment error occured", error);
    throw new AppError(httpStatus.BAD_REQUEST, error.message)
    
   }

}

export const SSLService = {
    sslPaymentInit
}