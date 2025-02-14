// "use client"



// import { CheckoutForm } from "@/components/CheckoutForm";
// import { Elements } from "@stripe/react-stripe-js"
// import { loadStripe } from "@stripe/stripe-js"
// import { useSearchParams } from "next/navigation";


// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

// function PaymentPage() {

//     const searchParam = useSearchParams();
//     const totalPrice = searchParam.get("totalPrice");
    
//   return (
//     <>
//     <Elements  stripe={stripePromise} options={{mode: "payment", currency: "usd", amount:Number(totalPrice),}} >
//       <CheckoutForm totalPrice={Number(totalPrice)}/>
//     </Elements>
//     </>
//   )
// }

// export default PaymentPage


"use client";

import { CheckoutForm } from "@/components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

function PaymentPage() {
  // Wrapping this logic inside Suspense
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}

function PaymentContent() {
  const searchParams = useSearchParams();
  const totalPrice = searchParams.get("totalPrice");

  if (!totalPrice) {
    return <div>Error: Missing total price in query parameters</div>;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        currency: "usd",
        amount: Number(totalPrice),
      }}
    >
      <CheckoutForm totalPrice={Number(totalPrice)} />
    </Elements>
  );
}

export default PaymentPage;
