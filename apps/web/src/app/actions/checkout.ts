'use server';
import { db } from 'shared';
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function placeOrder(orderData: any) {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    // Automatically update the stock for each purchased item
    if (orderData.items && Array.isArray(orderData.items)) {
      for (const item of orderData.items) {
        if (item.productId && item.quantity) {
          try {
            const productRef = doc(db, 'products', item.productId);
            const productSnap = await getDoc(productRef);
            if (productSnap.exists()) {
              const productData = productSnap.data();
              let newVariants = productData.variants;
              let shouldUpdateVariants = false;
              
              if (newVariants && item.variant) {
                newVariants = newVariants.map((v: any) => {
                  if (v.color === item.variant.color && v.size === item.variant.size) {
                    shouldUpdateVariants = true;
                    return { ...v, stock: Math.max(0, v.stock - item.quantity) };
                  }
                  return v;
                });
              }

              const updates: any = {
                stock: increment(-item.quantity)
              };

              if (shouldUpdateVariants) {
                updates.variants = newVariants;
              }

              await updateDoc(productRef, updates);
            }
          } catch (updateErr) {
            console.error(`Failed to update stock for product ${item.productId}:`, updateErr);
          }
        }
      }
    }

    // Send confirmation email if SendGrid is configured
    if (process.env.SENDGRID_API_KEY) {
      try {
        await sgMail.send({
          to: orderData.customerDetails.email,
          from: process.env.SENDGRID_VERIFIED_SENDER || 'hello@lovemeclothing.com', // Must be a verified sender in SendGrid
          subject: `Order Confirmation - #${docRef.id}`,
          html: `<h2>Thanks for your order!</h2>
                 <p>Your payment method is: ${orderData.paymentMethod}</p>
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
