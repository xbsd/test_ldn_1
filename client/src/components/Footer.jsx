import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-secondary/50 border-t border-gray-700/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-white">Pedal</span><span className="text-highlight">Armor</span>
            </h3>
            <p className="text-gray-400 text-sm">Premium acrylic protectors for your guitar processors. Protect your investment.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gray-200">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/shop?category=screen-protectors" className="hover:text-white">Screen Protectors</Link></li>
              <li><Link to="/shop?category=full-face-protectors" className="hover:text-white">Full Face Protectors</Link></li>
              <li><Link to="/shop?category=knob-guards" className="hover:text-white">Knob Guards</Link></li>
              <li><Link to="/shop?category=bundles" className="hover:text-white">Bundles</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gray-200">Brands</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/brands/line-6" className="hover:text-white">Line 6</Link></li>
              <li><Link to="/brands/neural-dsp" className="hover:text-white">Neural DSP</Link></li>
              <li><Link to="/brands/fractal-audio" className="hover:text-white">Fractal Audio</Link></li>
              <li><Link to="/brands/kemper" className="hover:text-white">Kemper</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-gray-200">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/login" className="hover:text-white">My Account</Link></li>
              <li><span className="hover:text-white cursor-pointer">Contact Us</span></li>
              <li><span className="hover:text-white cursor-pointer">Shipping Info</span></li>
              <li><span className="hover:text-white cursor-pointer">Returns</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700/50 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; 2026 PedalArmor. All rights reserved. Protect your investment. Play with confidence.
        </div>
      </div>
    </footer>
  );
}
