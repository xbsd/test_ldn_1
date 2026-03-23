import { Link } from 'react-router-dom';

export default function ShippingInfo() {
  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <nav className="text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Shipping & Delivery</span>
          </nav>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shipping & Delivery</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Free Shipping</h2>
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              <p className="text-green-800 font-medium">Orders over $75 qualify for FREE standard shipping within the continental United States.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Rates</h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold text-gray-700">Method</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-700">Delivery Time</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-700">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-5 py-3 text-gray-900">Standard Shipping</td><td className="px-5 py-3 text-gray-600">5-7 business days</td><td className="px-5 py-3 text-gray-600">$9.95 (Free over $75)</td></tr>
                  <tr><td className="px-5 py-3 text-gray-900">Expedited Shipping</td><td className="px-5 py-3 text-gray-600">2-3 business days</td><td className="px-5 py-3 text-gray-600">$14.95</td></tr>
                  <tr><td className="px-5 py-3 text-gray-900">Overnight Shipping</td><td className="px-5 py-3 text-gray-600">1 business day</td><td className="px-5 py-3 text-gray-600">$24.95</td></tr>
                  <tr><td className="px-5 py-3 text-gray-900">International Shipping</td><td className="px-5 py-3 text-gray-600">7-14 business days</td><td className="px-5 py-3 text-gray-600">Calculated at checkout</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Processing Time</h2>
            <p className="text-gray-600 leading-relaxed">All orders are processed within 1-2 business days. Custom engraved products require an additional 2-3 business days for laser engraving before shipping. You will receive a shipping confirmation email with tracking information once your order has shipped.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Tracking</h2>
            <p className="text-gray-600 leading-relaxed">Once your order ships, you'll receive an email with tracking information. You can also view your order status by logging into your <Link to="/account/orders" className="text-red-600 hover:underline">account</Link>.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Questions?</h2>
            <p className="text-gray-600">Contact our support team at <Link to="/contact" className="text-red-600 hover:underline">our contact page</Link> for any shipping inquiries.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
