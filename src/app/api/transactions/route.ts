import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // [VALIDATION] Perform input validation on the request body properties
    const requiredFields = [
      'total_price', 'full_name', 'email', 'phone', 'address', 'postal_code', 'product', 'unit_price', 'quantity', 'shipping_cost', 'insurance_cost'
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }
    // ***************** Create Snap API instance
    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: MIDTRANS_SERVER_KEY,
    });

    let parameter = {
      transaction_details: {
        order_id: `ORD-${Date.now()}`,
        gross_amount: body.total_price,
      },
      customer_details: {
        first_name: body.full_name,
        email: body.email || '',
        phone: body.phone || '',
        shipping_address: {
          address: body.address,
          postal_code: body.postal_code,
        },
      },
      item_details: [
        {
          id: 'product',
          name: body.product,
          price: body.unit_price,
          quantity: body.quantity,
        },
        {
          id: 'shipping',
          name: 'Shipping Cost',
          price: body.shipping_cost,
          quantity: 1,
        },
        {
          id: 'insurance',
          name: 'Insurance',
          price: body.insurance_cost,
          quantity: 1,
        },
      ],
    };

    const transaction = await snap.createTransaction(parameter);
    console.log('Midtrans transaction response:', transaction);
    return NextResponse.json(transaction);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
