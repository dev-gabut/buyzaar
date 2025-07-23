import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function Transactions() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Transaction</CardTitle>
          <CardDescription>Fill the form below to create a new transaction using Midtrans.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Transaction form will go here */}
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input type="number" name="amount" className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Customer Name</label>
              <input type="text" name="customerName" className="w-full border rounded px-3 py-2" required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" name="email" className="w-full border rounded px-3 py-2" required />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Create Transaction</button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-gray-500">Powered by Midtrans</p>
        </CardFooter>
      </Card>
    </div>
  );
}
