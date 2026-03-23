import { Link } from 'react-router-dom';

export default function ReturnsPolicy() {
  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <nav className="text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Returns & Refunds</span>
          </nav>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Returns & Refunds</h1>

        <div className="space-y-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="text-blue-800 font-medium">We offer a 30-day, no-questions-asked return policy on all standard products. Your satisfaction is our priority.</p>
          </div>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">30-Day Return Policy</h2>
            <p className="text-gray-600 leading-relaxed mb-4">If you're not completely satisfied with your purchase, you may return it within 30 days of delivery for a full refund or exchange. Items must be in their original condition and packaging.</p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2"><svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Standard products: Full refund within 30 days</li>
              <li className="flex items-start gap-2"><svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Defective products: Immediate replacement or refund</li>
              <li className="flex items-start gap-2"><svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Wrong item received: Free return shipping + replacement</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Custom Engraved Products</h2>
            <p className="text-gray-600 leading-relaxed">Custom engraved products are made to order and are non-returnable unless defective or damaged during shipping. If your custom product arrives damaged, contact us within 7 days for a replacement.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">How to Return</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl p-5 text-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3"><span className="font-bold text-gray-700">1</span></div>
                <h3 className="font-semibold text-gray-900 mb-1">Contact Us</h3>
                <p className="text-sm text-gray-500">Email our support team to initiate a return</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 text-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3"><span className="font-bold text-gray-700">2</span></div>
                <h3 className="font-semibold text-gray-900 mb-1">Ship It Back</h3>
                <p className="text-sm text-gray-500">We'll provide a prepaid return label</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-5 text-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3"><span className="font-bold text-gray-700">3</span></div>
                <h3 className="font-semibold text-gray-900 mb-1">Get Refunded</h3>
                <p className="text-sm text-gray-500">Refund processed within 3-5 business days</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Lifetime Warranty</h2>
            <p className="text-gray-600 leading-relaxed">All PedalArmor protectors come with a lifetime warranty against manufacturing defects. If your protector cracks, yellows, or becomes damaged under normal use, we'll replace it free of charge.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
