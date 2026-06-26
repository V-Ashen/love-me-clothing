'use server';
import { db } from 'shared/src/firebase/config.js';
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

    // Send confirmation email
    await sgMail.send({
      to: orderData.customerDetails.email,
      from: 'hello@lovemeclothing.com',
      subject: `Order Confirmation - #${docRef.id}`,
      html: `<h2>Thanks for your COD order!</h2>
             <p>We will dispatch it shortly.</p>`,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to process order' };
  }
}
