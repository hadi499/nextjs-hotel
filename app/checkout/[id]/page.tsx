import { Metadata } from "next";
import { Suspense } from "react";
import CheckoutDetail from "@/components/checkout-detail";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Reservation Summary",
};

const CheckoutPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const reservationId = (await params).id;
  return (
    <div className="max-w-screen-xl mx-auto py-20 px-4 mt-12">
      <h1 className="text-2xl font-semibold mb-8">Reservation Summary</h1>
      <Suspense fallback={<p>Loading....</p>}>
        <CheckoutDetail reservationId={reservationId} />
      </Suspense>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
    </div>
  );
};

export default CheckoutPage;
