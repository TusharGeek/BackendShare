import Razorpay from 'razorpay';
import crypto from 'crypto';
import mysql from "mysql";

import db from "../Database/db.js";

const keyId = `rzp_test_6DlYKILYqIBT6c`;
const keySecret = `rve3Vcv42kD5d6Pjq9wvb1BS`;




export const paymentVerify =  async (req, res) => {
    
    try {
		const {userId,razorpay_order_id, razorpay_payment_id, razorpay_signature,membership } =
			req.body;

			console.log(req.body);
		const sign = razorpay_order_id + "|" + razorpay_payment_id;
		const expectedSign = crypto
			.createHmac("sha256", keySecret)
			.update(sign.toString())
			.digest("hex");
		
		var instance = new Razorpay({ key_id: keyId, key_secret: keySecret })

		var orderDetail = await instance.orders.fetch(razorpay_order_id)

		const payment = {
			id: razorpay_payment_id,
			paymentType: "",
			amount: orderDetail.amount,
			mode: 'UPI',
			paymentStatus: orderDetail.status,
			createdOn: orderDetail.created_at,
			createdBy: orderDetail.created_at,
			updatedBy: "",
			updatedOn: "",
			userId: userId
		}

        
		if (razorpay_signature === expectedSign) {
            console.log(payment);
			
			console.log({MembershipId: Math.floor(22 * 9999999)});
              
			const paymentSql = `INSERT INTO payments (id, PaymentType, Amount, Mode,PaymentStatus,CreatedBy,CreatedAt, UpdatedBy, UpdatedAt,UserId) VALUES ("${payment.id}","FullMembershipPayment","${payment.amount}","${payment.mode}","${payment.paymentStatus}","${payment.createdBy}","${payment.createdOn}","${payment.updatedBy}","${payment.updatedOn}","${userId}");`;
             db.query(paymentSql, (err, success) => {
				if (err) {
					console.log(err);
				} else {
					console.log('Payment Recorded Successfully');
					const sql = `UPDATE user SET LeadType = 'Joined' WHERE id = ${userId}`
					db.query(sql, (err, data) => {
						if (err) {
							console.log(err);
						} else {
							console.log('User is a member');
							const NoOfAllotedDays = membership.HolidayPerYear*membership.NoOfYears;
							const date = new Date();

                            let day = date.getDate();
                            let month = date.getMonth() + 1;
                            let year = date.getFullYear();

                            let JoiningDate = `${year}-${month}-${day}`;
                            let ExpiryYear = date.getFullYear() + membership.NoOfYears;
							let ExpiryDate = `${ExpiryYear}-${month}-${day}`;
                            
							const sql1 = `INSERT INTO user_membership(userId, membershipId, NoOfAllotedDays, NoOfYears, NoOfUsedDays,JoiningDate,ExpriyDate) VALUES (${userId}, ${membership.id}, "${NoOfAllotedDays}", "${membership.NoOfYears}","${0}","${JoiningDate}", "${ExpiryDate}")`
							db.query(sql1, (err, data) => {
								if (err) {
									console.log(err);
								} else {
									console.log('User Membership updated successfully');
								}
							})

						}
					})
				}
			 })  

		
           

		} else {
			return res.status(400).json({ message: "Invalid signature sent!" });
		}
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}
};




export const paymentOrder = async (req, res) => {
	try {
		const instance = new Razorpay({
			key_id: keyId,
			key_secret: keySecret
		});

		const options = {
			amount: req.body.amount * 100,
			currency: "INR",
			receipt: crypto.randomBytes(10).toString("hex"),
		};

		instance.orders.create(options, (error, order) => {
			if (error) {
				console.log(error);
				return res.status(500).json({ message: "Something Went Wrong!" });
			}
			res.status(200).json({ data: order });
		});
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error!" });
		console.log(error);
	}
};



export const paymentHistory = async (req, res) => {
	const id = req.params.id;
	console.log(id);
	const sql = `Select * from payments WHERE UserId = "${id}";`;
    db.query(sql, async (err, result) => {
       if (err) {
           console.log('Cant Find Any User');
       } else {
           res.send(result)
       }
    })
}



// export const getAllPayments = async (req, res) => {
// 	const sql = `Select * from payments;`
// 	db.query(sql, async (err, result) => {
// 		if (err) {
// 			console.log('Error');
// 		} else {
// 			res.send(result)
// 		}
// 	})
// }

export const paymentLinkGenerator = async (req, res) => {
	try {
		const razorpay = new Razorpay({
			key_id: 'rzp_test_6DlYKILYqIBT6c',
			key_secret: 'rve3Vcv42kD5d6Pjq9wvb1BS',
		  });
		const paymentLink = await razorpay.paymentLink.create({
		  amount: 500,
		  currency: 'INR',
		  accept_partial: true,
		  first_min_partial_amount: 100,
		  description: 'For XYZ purpose',
		  customer: {
			name: 'Sirjandeep Singh',
			email: 'sirjanssk2933@gmail.com',
			contact: '+918146164158',
		  },
		  notify: {
			sms: true,
			email: true,
		  },
		  reminder_enable: true,
		  notes: {
			policy_name: 'Jeevan Bima',
		  },
		  callback_url: 'https://example-callback-url.com/',
		  callback_method: 'get',
		});
	
		res.json({ paymentLink: paymentLink.short_url });
	  } catch (error) {
		console.log('Error generating payment link:', error);
		res.status(500).send('Failed to generate payment link');
	  }
  };

  export const getAllPayments = async (req, res) => {
	try {
	  const razorpay = new Razorpay({
		key_id: 'rzp_test_6DlYKILYqIBT6c',
		key_secret: 'rve3Vcv42kD5d6Pjq9wvb1BS',
	  });
  
	  const options = {}; // Add any required options to fetch payments (e.g., pagination, filters, etc.)
	  const paymentList = await razorpay.payments.all(options);
  
	  // Fetch customer details for each payment
	  const paymentDetailsPromises = paymentList.items.map(async (payment) => {
	console.log(payment);
		const customer = await razorpay.payments.fetch(payment.id);

		return {
		  ...payment,
		  customer,
		};
	  });
  console.log(paymentDetailsPromises);
	  const paymentDetails = await Promise.all(paymentDetailsPromises);
   res.send(paymentDetails);
	 
	} catch (error) {
	  console.log('Error fetching payments:', error);
	  res.status(500).send('Failed to fetch payments');
	}
  };


// // Create a new instance of Razorpay
// const razorpay = new Razorpay({
//   key_id: "rzp_test_6DlYKILYqIBT6c",
//   key_secret: "rve3Vcv42kD5d6Pjq9wvb1BS",
// });

// // Function to fetch customer data for a payment
// const fetchCustomerData = (customerId) => {
//   return new Promise((resolve, reject) => {
//     razorpay.customers.fetch(customerId, (err, customer) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(customer);
//       }
//     });
//   });
// };

// // Fetch payment list and customer data
// export const getPaymentListWithCustomerData = async () => {
//   try {
//     const options = {
//       // Set the desired options for fetching payments
//     };

//     // Fetch the payment list
//     const paymentList = await razorpay.orders.all(options);

//     // Fetch customer data for each payment
//     const paymentListWithCustomerData = await Promise.all(
//       paymentList.items.map(async (payment) => {
// 		console.log(payment);
//         if (payment.entity === "order" && payment.id) {
//           const customerData = await fetchCustomerData(payment.id);
//           return {
//             ...payment,
//             customer: customerData,
//           };
//         } else {
//           return payment;
//         }
//       })
//     );

//     // console.log("Payment List with Customer Data:", paymentListWithCustomerData);
//     // Handle the payment list with customer data as needed
//   } catch (error) {
//     console.error("Failed to fetch payment list:", error);
//     // Handle the error gracefully
//   }
// };

// // Usage example
// getPaymentListWithCustomerData();
