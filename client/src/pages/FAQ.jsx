import { useState } from 'react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    category: 'Products',
    items: [
      { q: 'What material are PedalArmor protectors made from?', a: 'All our protectors are made from premium optical-grade cast acrylic. This material offers excellent clarity, scratch resistance, and durability while being lightweight enough not to affect your pedalboard weight.' },
      { q: 'Will the screen protector affect my touchscreen responsiveness?', a: 'Not at all. Our screen protectors are designed to maintain full touch responsiveness. The acrylic is thin enough to not interfere with capacitive touch while still providing robust protection.' },
      { q: 'How do I install the protector?', a: 'Each protector comes with detailed installation instructions. Depending on the mount type you choose (Magnetic, Screw-Mount, Command Strip, or Snap-On Rail), installation takes 2-5 minutes. No special tools required for most options.' },
      { q: 'Do you make protectors for [specific device]?', a: 'We currently support 21+ devices across 8 major brands including Line 6, Neural DSP, Fractal Audio, Kemper, Boss, Fender, Headrush, and IK Multimedia. Check our Shop page to see if your device is listed. If not, contact us and we may be able to create a custom solution.' },
      { q: 'What\'s the difference between mount types?', a: 'Magnetic mounts use embedded magnets for easy on/off access. Screw-mount provides the most secure attachment for touring. Command Strips offer removable adhesive mounting. Snap-On Rails clip onto the device edges. Each has its advantages depending on your use case.' },
    ],
  },
  {
    category: 'Orders & Shipping',
    items: [
      { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days within the US. Expedited (2-3 days) and overnight options are also available. International orders typically take 7-14 business days.' },
      { q: 'Is there free shipping?', a: 'Yes! All orders over $75 ship free within the continental United States via standard shipping.' },
      { q: 'Do you ship internationally?', a: 'Yes, we ship to most countries worldwide. International shipping rates are calculated at checkout based on your location and order weight.' },
      { q: 'How long do custom engraved orders take?', a: 'Custom engraved products require an additional 2-3 business days for laser engraving before shipping. Total delivery time is engraving time plus your selected shipping method.' },
    ],
  },
  {
    category: 'Returns & Warranty',
    items: [
      { q: 'What is your return policy?', a: 'We offer a 30-day, no-questions-asked return policy on all standard products. Items must be in original condition. Custom engraved products are non-returnable unless defective.' },
      { q: 'What does the lifetime warranty cover?', a: 'Our lifetime warranty covers manufacturing defects including cracking, yellowing, warping, or delamination under normal use conditions. It does not cover damage from misuse, dropping, or intentional modification.' },
      { q: 'How do I make a warranty claim?', a: 'Simply contact our support team with your order number and photos of the defective product. We\'ll send a replacement free of charge. No need to return the defective item.' },
    ],
  },
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState({});

  const toggle = (key) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <nav className="text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">FAQ</span>
          </nav>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h1>
        <p className="text-gray-500 mb-10">Can't find what you're looking for? <Link to="/contact" className="text-red-600 hover:underline">Contact us</Link></p>

        <div className="space-y-10">
          {faqs.map((section) => (
            <section key={section.category}>
              <h2 className="text-xl font-bold text-gray-900 mb-4">{section.category}</h2>
              <div className="divide-y divide-gray-200 border border-gray-200 rounded-xl overflow-hidden">
                {section.items.map((item, i) => {
                  const key = `${section.category}-${i}`;
                  const isOpen = openItems[key];
                  return (
                    <div key={key}>
                      <button
                        onClick={() => toggle(key)}
                        className="w-full text-left px-5 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900 pr-4">{item.q}</span>
                        <svg className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4">
                          <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
