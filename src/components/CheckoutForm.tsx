'use client';

import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export function CheckoutForm({totalPrice}: {totalPrice: number}) {
  const stripe = useStripe();
  const elements = useElements();

  const [clientSecret, setClientSecret] = useState<string>('');
  const [error, setError] = useState<string>('');
  // const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Create PaymentIntent on the server
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ totalPrice }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        if (data.clientSecret) {
          localStorage.setItem('paymentDetails', JSON.stringify({
            id: data.paymentId,
            date: data.created,
            amount: data.amount,
          }));
        }
      });
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    // Call elements.submit() immediately when the user clicks pay.
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'Submission failed');
      return;
    }

    // Then confirm the payment.
    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (confirmError) {
      setError(confirmError.message || 'Payment confirmation failed');
    }
  };

  return (
    <>
    
    <div className="bg-[url('/blogMainImage.png')] bg-cover bg-center py-16 mb-12">
        <div className="container text-center">
          <div className="inline-block w-16 h-16 bg-[url('/logo1.png')] mb-4" />
          <h1 className="text-3xl md:text-4xl font-medium mb-4 font-poppins">Checkout</h1>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Link href="/" className="hover:underline">Home</Link>
            <span>
              <Image src="/rightA.png" width={20} height={20} alt="arrow" />
            </span>
            <span>Checkout</span>
          </div>
        </div>
      </div>

    <form onSubmit={handleSubmit}>
      <div className="p-10 flex justify-center flex-col gap-6">
        {clientSecret && <PaymentElement />}
        {error && <p className="text-red-600">{error}</p>}
        <button className="bg-black text-white p-5" type="submit">
          Payment
        </button>
      </div>
    </form>
    </>
  );
}