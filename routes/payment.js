import express from "express";

import { paymentVerify, paymentOrder, paymentHistory, getAllPayments,paymentLinkGenerator } from "../controller/payment.js";


const router =  express.Router();

router.post('/payment-verify', paymentVerify);
router.post('/payment-order', paymentOrder);
router.get('/payment-link', paymentLinkGenerator);
router.post('/payment-history/:id', paymentHistory);
router.get('/',getAllPayments);



export default router;