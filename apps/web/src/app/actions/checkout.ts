'use server';
import { db } from 'shared';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function placeCodOrder(orderData: any) {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      status: 'pending',
      paymentMethod: 'COD',
      createdAt: serverTimestamp(),
    });

    // Send confirmation email if SendGrid is configured
    if (process.env.SENDGRID_API_KEY) {
      try {
        await sgMail.send({
          to: orderData.customerDetails.email,
          from: process.env.SENDGRID_VERIFIED_SENDER || 'hello@lovemeclothing.com', // Must be a verified sender in SendGrid
          subject: `Order Confirmation - #${docRef.id}`,
          html: `<h2>Thanks for your COD order!</h2>
                 <p>We will dispatch it shortly.</p>`,
        });
      } catch (emailError) {
        console.error("Failed to send email, but order was saved", emailError);
      }
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to process order' };
  }
}
