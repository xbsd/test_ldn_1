import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <nav className="text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">About Us</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4">About PedalArmor</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Born from the frustration of scratched screens and damaged knobs, PedalArmor creates premium protection for the world's finest guitar processors.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              PedalArmor was founded by touring musicians who knew the pain of arriving at a gig only to find their expensive multi-effects processor scratched, scuffed, or worse. After investing thousands of dollars in premium units like the Line 6 Helix, Neural DSP Quad Cortex, and Fractal Audio Axe-Fx III, we realized there was no quality protection solution on the market.
            </p>
            <p className="text-gray-600 leading-relaxed">
              So we built one. Using precision laser-cutting technology and premium optical-grade acrylic, we design protectors that are crystal clear, ultra-durable, and perfectly fitted to each device. Every protector is designed in-house and manufactured to exacting tolerances.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Why PedalArmor?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Precision Engineered</h3>
                <p className="text-sm text-gray-600">Every protector is laser-cut to within 0.1mm tolerance for a perfect fit on your specific device.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Designed by Guitarists</h3>
                <p className="text-sm text-gray-600">We play these units every day. Every design decision is informed by real-world gigging experience.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Lifetime Warranty</h3>
                <p className="text-sm text-gray-600">We stand behind every product. If it breaks under normal use, we'll replace it. Period.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Trusted by Musicians Worldwide</h2>
            <p className="text-gray-600 leading-relaxed">
              From bedroom guitarists to touring professionals, thousands of musicians trust PedalArmor to protect their gear. We've shipped to over 40 countries and maintain a 4.9-star average rating across all products. Our protectors have been spotted on stages at festivals, studios, and rehearsal spaces around the world.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
