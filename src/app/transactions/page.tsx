"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardAction } from "@/components/ui/card";

export default function Transactions() {
  // Dummy price for testing
  const DUMMY_UNIT_PRICE = 100000;

  // State for calculation
  const [quantity, setQuantity] = React.useState(1);
  const [shippingCost, setShippingCost] = React.useState(25000);
  const [insuranceChecked, setInsuranceChecked] = React.useState(false);
  const [subtotal, setSubtotal] = React.useState(DUMMY_UNIT_PRICE);
  const [total, setTotal] = React.useState(DUMMY_UNIT_PRICE + 25000);

  React.useEffect(() => {
    const insuranceCost = insuranceChecked ? 7700 : 0;
    const sub = DUMMY_UNIT_PRICE * quantity;
    setSubtotal(sub);
    setTotal(sub + shippingCost + insuranceCost);
  }, [quantity, shippingCost, insuranceChecked]);

  // Format to Rupiah
  function formatRupiah(num: number) {
    return 'Rp' + num.toLocaleString('id-ID');
  }

  // Handle form submit
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    data.quantity = quantity;
    data.product = 'Sample Product';
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.token) {
        console.log('Midtrans Snap token:', result.token);
        // Ensure Snap JS is loaded
        function payWithSnap(token: string) {
          // @ts-ignore: Snap JS accepts two arguments, but types may not match
          window.snap?.pay(token, {
            onSuccess: function(result: any) { console.log('Payment Success:', result); },
            onPending: function(result: any) { console.log('Payment Pending:', result); },
            onError: function(result: any) { console.log('Payment Error:', result); },
            onClose: function() { console.log('Payment popup closed'); }
          });
        }
        if (!window.snap) {
          const script = document.createElement('script');
          script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
          script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '');
          document.body.appendChild(script);
          script.onload = () => {
            console.log('Snap JS loaded, window.snap:', window.snap);
            payWithSnap(result.token);
          };
        } else {
          console.log('Snap JS already loaded, window.snap:', window.snap);
          payWithSnap(result.token);
        }
      } else {
        alert(result.error || 'Failed to create transaction');
      }
    } catch (err) {
      alert('Error: ' + err);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>Complete your purchase and pay securely with Midtrans</CardDescription>
          <CardAction>
            <Button variant="link">Need Help?</Button>
          </CardAction>
        </CardHeader>
          <form onSubmit={handleSubmit}>
        <CardContent>
            <div className="flex flex-col gap-6">
              {/* Shipping Information */}
              <div className="grid gap-4">
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" name="full_name" type="text" required />
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" type="text" required />
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input id="postal_code" name="postal_code" type="text" required />
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>

              {/* Product Information */}
              <div className="grid gap-4">
                <Label htmlFor="product">Product</Label>
                <Input id="product" name="product" value="Sample Product" readOnly required />
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" name="quantity" type="number" min={1} value={quantity} onChange={e => setQuantity(Number(e.target.value))} required />
                <div className="flex gap-4">
                  <div>
                    <span className="block text-sm font-medium">Unit Price:</span>
                    <span className="block" id="unitPrice">{formatRupiah(DUMMY_UNIT_PRICE)}</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium">Subtotal:</span>
                    <span className="block" id="subtotalDisplay">{formatRupiah(subtotal)}</span>
                  </div>
                </div>
                <Label htmlFor="shipping_method">Shipping Method</Label>
                <select id="shipping_method" name="shipping_method" className="w-full border rounded px-3 py-2" value={shippingCost} onChange={e => setShippingCost(Number(e.target.value))} required>
                  <option value={25000}>JNE (Rp25.000)</option>
                  <option value={22000}>SICepat (Rp22.000)</option>
                </select>
                <Label htmlFor="insuranceCheckbox" className="inline-flex items-center">
                  <Input id="insuranceCheckbox" type="checkbox" name="insurance" value="7700" className="mr-2" checked={insuranceChecked} onChange={e => setInsuranceChecked(e.target.checked)} />
                  Dilindungi Asuransi Pengiriman (Rp7.700)
                </Label>
              </div>

              {/* Total Section */}
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Tagihan:</span>
                <span id="totalDisplay" className="font-bold text-lg">{formatRupiah(total)}</span>
              </div>

              {/* Hidden fields for backend */}
              <Input type="hidden" name="unit_price" id="unitPriceInput" value={DUMMY_UNIT_PRICE} />
              <Input type="hidden" name="shipping_cost" id="shippingCostInput" value={shippingCost} />
              <Input type="hidden" name="insurance_cost" id="insuranceCostInput" value={insuranceChecked ? 7700 : 0} />
              <Input type="hidden" name="total_price" id="totalPriceInput" value={total} />
            </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Complete Purchase
          </Button>
        </CardFooter>
          </form>
      </Card>
    </div>
  );
}
