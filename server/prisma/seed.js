const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // --- BRANDS ---
  const brands = await Promise.all([
    prisma.brand.create({ data: { name: 'Line 6', slug: 'line-6', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Line6_logo.svg/200px-Line6_logo.svg.png', websiteUrl: 'https://line6.com' } }),
    prisma.brand.create({ data: { name: 'Neural DSP', slug: 'neural-dsp', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Neural_DSP_Logo.svg/200px-Neural_DSP_Logo.svg.png', websiteUrl: 'https://neuraldsp.com' } }),
    prisma.brand.create({ data: { name: 'Fractal Audio', slug: 'fractal-audio', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Fractal_Audio_Logo.svg/200px-Fractal_Audio_Logo.svg.png', websiteUrl: 'https://fractalaudio.com' } }),
    prisma.brand.create({ data: { name: 'Kemper', slug: 'kemper', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Kemper_logo.svg/200px-Kemper_logo.svg.png', websiteUrl: 'https://kemper-amps.com' } }),
    prisma.brand.create({ data: { name: 'Boss', slug: 'boss', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Boss_logo.svg/200px-Boss_logo.svg.png', websiteUrl: 'https://boss.info' } }),
    prisma.brand.create({ data: { name: 'Fender', slug: 'fender', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Fender_guitars_logo.svg/200px-Fender_guitars_logo.svg.png', websiteUrl: 'https://fender.com' } }),
    prisma.brand.create({ data: { name: 'Headrush', slug: 'headrush', logoUrl: 'https://www.headrushfx.com/assets/images/headrush-logo.svg', websiteUrl: 'https://headrushfx.com' } }),
    prisma.brand.create({ data: { name: 'IK Multimedia', slug: 'ik-multimedia', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/IK_Multimedia_logo.svg/200px-IK_Multimedia_logo.svg.png', websiteUrl: 'https://ikmultimedia.com' } }),
  ]);

  const [line6, neuralDsp, fractal, kemper, boss, fender, headrush, ikMm] = brands;

  // --- DEVICE MODELS ---
  const devices = {};
  const deviceData = [
    { brandId: line6.id, modelName: 'Helix Floor', slug: 'helix-floor', formFactor: 'floor', msrp: 1699.99 },
    { brandId: line6.id, modelName: 'Helix LT', slug: 'helix-lt', formFactor: 'floor', msrp: 1299.99 },
    { brandId: line6.id, modelName: 'HX Stomp', slug: 'hx-stomp', formFactor: 'compact', msrp: 649.99 },
    { brandId: line6.id, modelName: 'HX Stomp XL', slug: 'hx-stomp-xl', formFactor: 'compact', msrp: 799.99 },
    { brandId: line6.id, modelName: 'HX Effects', slug: 'hx-effects', formFactor: 'floor', msrp: 599.99 },
    { brandId: line6.id, modelName: 'Helix Rack', slug: 'helix-rack', formFactor: 'rack', msrp: 1699.99 },
    { brandId: line6.id, modelName: 'Helix Stadium XL', slug: 'helix-stadium-xl', formFactor: 'floor', msrp: 2499.99 },
    { brandId: neuralDsp.id, modelName: 'Quad Cortex', slug: 'quad-cortex', formFactor: 'floor', msrp: 1849.00 },
    { brandId: neuralDsp.id, modelName: 'Nano Cortex', slug: 'nano-cortex', formFactor: 'compact', msrp: 649.00 },
    { brandId: fractal.id, modelName: 'Axe-Fx III', slug: 'axe-fx-iii', formFactor: 'rack', msrp: 2499.00 },
    { brandId: fractal.id, modelName: 'FM9', slug: 'fm9', formFactor: 'floor', msrp: 1999.00 },
    { brandId: fractal.id, modelName: 'FM3', slug: 'fm3', formFactor: 'compact', msrp: 1099.00 },
    { brandId: fractal.id, modelName: 'AM4', slug: 'am4', formFactor: 'desktop', msrp: 799.00 },
    { brandId: kemper.id, modelName: 'Profiler Stage', slug: 'profiler-stage', formFactor: 'floor', msrp: 1899.00 },
    { brandId: kemper.id, modelName: 'Profiler Rack MK2', slug: 'profiler-rack-mk2', formFactor: 'rack', msrp: 1899.00 },
    { brandId: boss.id, modelName: 'GT-1000', slug: 'gt-1000', formFactor: 'floor', msrp: 999.99 },
    { brandId: boss.id, modelName: 'GT-1000CORE', slug: 'gt-1000core', formFactor: 'desktop', msrp: 699.99 },
    { brandId: boss.id, modelName: 'GX-100', slug: 'gx-100', formFactor: 'compact', msrp: 499.99 },
    { brandId: fender.id, modelName: 'Tone Master Pro', slug: 'tone-master-pro', formFactor: 'floor', msrp: 1499.99 },
    { brandId: headrush.id, modelName: 'Prime', slug: 'headrush-prime', formFactor: 'floor', msrp: 1599.99 },
    { brandId: headrush.id, modelName: 'Flex Prime', slug: 'flex-prime', formFactor: 'floor', msrp: 999.99 },
  ];

  // Real device images from manufacturer websites / retailers
  const deviceImages = {
    'helix-floor': 'https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/bdb/_36/366537/10567758_800.jpg',
    'helix-lt': 'https://media.guitarcenter.com/is/image/MMGS7/J50646000000000-00-600x600.jpg',
    'hx-stomp': 'https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/bdb/_45/450218/13708161_800.jpg',
    'hx-stomp-xl': 'https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/bdb/_49/498506/16310017_800.jpg',
    'hx-effects': 'https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/bdb/_43/430913/12858098_800.jpg',
    'helix-rack': 'https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/bdb/_36/366538/10567767_800.jpg',
    'helix-stadium-xl': 'https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/bdb/_36/366537/10567758_800.jpg',
    'quad-cortex': 'https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/bdb/_48/486992/15848351_800.jpg',
    'nano-cortex': 'https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/bdb/_57/577456/19784652_800.jpg',
    'axe-fx-iii': 'https://www.fractalaudio.com/wp-content/uploads/2018/03/axe-fx-iii-1920-front-white.jpg',
    'fm9': 'https://www.fractalaudio.com/wp-content/uploads/2024/02/FM9-Mk2-Turbo-top-1920-tight.png',
    'fm3': 'https://www.fractalaudio.com/wp-content/uploads/2019/10/FM3-1024.png',
    'am4': 'https://www.fractalaudio.com/wp-content/uploads/2024/11/AM4-top-1920-tight.png',
    'profiler-stage': 'https://www.kemper-amps.com/files/navigation/e7/aa/3315CA9249A0.jpg?v5',
    'profiler-rack-mk2': 'https://www.kemper-amps.com/files/navigation/e7/aa/3315CA9249A0.jpg?v5',
    'gt-1000': 'https://static.roland.com/products/gt-1000/images/gt-1000_angle_gal.jpg',
    'gt-1000core': 'https://static.roland.com/products/gt-1000core/images/gt-1000core_angle_gal.jpg',
    'gx-100': 'https://static.roland.com/products/gx-100/images/gx-100_angle_gal.jpg',
    'tone-master-pro': 'https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/bdb/_55/558513/18895012_800.jpg',
    'headrush-prime': 'https://www.headrushfx.com/assets/images/pdp/prime/Prime_Ortho_MediaK.png',
    'flex-prime': 'https://www.headrushfx.com/assets/images/pdp/prime/Prime_Angle_MediaK.png',
  };

  for (const d of deviceData) {
    const dev = await prisma.deviceModel.create({
      data: { ...d, imageUrl: deviceImages[d.slug] || `https://picsum.photos/seed/${d.slug}/400/300` },
    });
    devices[d.slug] = dev;
  }

  // --- CATEGORIES ---
  const categories = {};
  const catData = [
    { name: 'Screen Protectors', slug: 'screen-protectors', description: 'Crystal clear protectors for LCD/touchscreens' },
    { name: 'Full Face Protectors', slug: 'full-face-protectors', description: 'Full coverage protection for entire control surface' },
    { name: 'Knob Guards', slug: 'knob-guards', description: 'Individual and set protectors for knobs and encoders' },
    { name: 'Bundles', slug: 'bundles', description: 'Protection bundles combining screen, face, and knob guards' },
    { name: 'Custom Engraved', slug: 'custom-engraved', description: 'Personalized laser-engraved acrylic protectors' },
  ];
  for (const c of catData) {
    categories[c.slug] = await prisma.category.create({ data: c });
  }

  // --- USERS ---
  const adminHash = await bcrypt.hash('admin123', 10);
  const customerHash = await bcrypt.hash('customer123', 10);
  const admin = await prisma.user.create({
    data: { email: 'admin@pedalarmor.com', passwordHash: adminHash, firstName: 'Admin', lastName: 'User', role: 'admin' },
  });
  const customer = await prisma.user.create({
    data: { email: 'guitarist@example.com', passwordHash: customerHash, firstName: 'Jake', lastName: 'Rivers', role: 'customer' },
  });

  await prisma.address.create({
    data: { userId: customer.id, line1: '123 Guitar Lane', city: 'Nashville', state: 'TN', postalCode: '37201', isDefault: true },
  });

  // --- PRODUCTS (50 total) ---
  const materials = ['Clear Acrylic', 'Gold Acrylic', 'Smoked Tinted', 'Carbon Fiber Finish'];
  const mountTypes = ['Magnetic', 'Screw-Mount', 'Command Strip', 'Snap-On Rail'];
  const thicknesses = [1.5, 2.0, 3.0];

  let productId = 0;
  const allProducts = [];

  async function createProduct(name, slug, desc, price, compareAt, categorySlug, deviceSlugs, customVariants) {
    productId++;
    const sku = `PA-${String(productId).padStart(4, '0')}`;
    const stock = Math.floor(Math.random() * 195) + 5;

    const product = await prisma.product.create({
      data: {
        name, slug, description: desc,
        price, compareAtPrice: compareAt,
        sku, stockQty: stock,
        categoryId: categories[categorySlug].id,
        devices: {
          create: deviceSlugs.map(ds => ({ deviceModelId: devices[ds].id })),
        },
      },
    });

    const variants = customVariants || [
      { variantLabel: `Clear 2mm ${mountTypes[0]}`, material: 'Clear Acrylic', thicknessMm: 2.0, mountType: mountTypes[0], priceModifier: 0, stockQty: Math.floor(Math.random() * 50) + 10, skuSuffix: 'CLR-2-MAG' },
      { variantLabel: `Smoked 3mm ${mountTypes[1]}`, material: 'Smoked Tinted', thicknessMm: 3.0, mountType: mountTypes[1], priceModifier: 5.00, stockQty: Math.floor(Math.random() * 50) + 10, skuSuffix: 'SMK-3-SCR' },
    ];

    for (const v of variants) {
      await prisma.productVariant.create({
        data: { productId: product.id, ...v },
      });
    }

    allProducts.push(product);
    return product;
  }

  // Helix Floor products (3)
  await createProduct('Helix Floor Screen Shield', 'helix-floor-screen-shield',
    'Precision-cut clear acrylic screen protector for the Line 6 Helix Floor. Protects the 6.2" color LCD from scratches, dust, and accidental impacts during gigs and rehearsals.',
    29.95, 34.95, 'screen-protectors', ['helix-floor']);

  await createProduct('Helix Floor Full Face Guard', 'helix-floor-full-face-guard',
    'Complete surface protection for your Helix Floor. Covers the entire control surface including scribble strips while maintaining full access to footswitches.',
    54.95, null, 'full-face-protectors', ['helix-floor']);

  await createProduct('Helix Floor Knob Guard Set', 'helix-floor-knob-guard-set',
    'Set of precision-fit knob guards for all encoders on the Helix Floor. Snap-on design for easy installation.',
    19.95, null, 'knob-guards', ['helix-floor']);

  // Helix LT products (3)
  await createProduct('Helix LT Screen Protector', 'helix-lt-screen-protector',
    'Custom-fit screen protector for Line 6 Helix LT. Ultra-clear acrylic maintains display visibility while blocking scratches and dust.',
    27.95, 32.95, 'screen-protectors', ['helix-lt']);

  await createProduct('Helix LT Full Surface Shield', 'helix-lt-full-surface-shield',
    'Full face protector for the Helix LT. Covers scribble strips, expression pedal area, and all control surfaces.',
    49.95, null, 'full-face-protectors', ['helix-lt']);

  await createProduct('Helix LT Protection Bundle', 'helix-lt-protection-bundle',
    'Complete protection kit for your Helix LT: screen protector + full face guard + knob guards. Save 15% vs buying separately.',
    79.95, 97.85, 'bundles', ['helix-lt']);

  // HX Stomp products (3)
  await createProduct('HX Stomp Screen Guard', 'hx-stomp-screen-guard',
    'Compact screen protector for the Line 6 HX Stomp. Perfectly sized for the 320x240 color display.',
    19.95, null, 'screen-protectors', ['hx-stomp']);

  await createProduct('HX Stomp Full Armor', 'hx-stomp-full-armor',
    'Full body protector for the HX Stomp. Wraps around the top surface and sides for maximum protection in your pedalboard.',
    34.95, 39.95, 'full-face-protectors', ['hx-stomp']);

  await createProduct('HX Stomp Custom Engraved Shield', 'hx-stomp-custom-engraved',
    'Custom laser-engraved acrylic protector for HX Stomp. Add your name, band logo, or custom text. Premium gold acrylic finish.',
    44.95, null, 'custom-engraved', ['hx-stomp'],
    [
      { variantLabel: 'Gold Engraved 2mm Magnetic', material: 'Gold Acrylic', thicknessMm: 2.0, mountType: 'Magnetic', priceModifier: 0, stockQty: 25, skuSuffix: 'GLD-2-MAG-ENG' },
      { variantLabel: 'Clear Engraved 3mm Screw-Mount', material: 'Clear Acrylic', thicknessMm: 3.0, mountType: 'Screw-Mount', priceModifier: 5.00, stockQty: 20, skuSuffix: 'CLR-3-SCR-ENG' },
    ]);

  // HX Stomp XL (2)
  await createProduct('HX Stomp XL Screen Shield', 'hx-stomp-xl-screen-shield',
    'Screen protector designed for the HX Stomp XL display. Clear acrylic with anti-glare coating option.',
    24.95, null, 'screen-protectors', ['hx-stomp-xl']);

  await createProduct('HX Stomp XL Full Face Protector', 'hx-stomp-xl-full-face',
    'Full coverage protector for the HX Stomp XL control surface.',
    44.95, null, 'full-face-protectors', ['hx-stomp-xl']);

  // HX Effects (2)
  await createProduct('HX Effects Surface Guard', 'hx-effects-surface-guard',
    'Full surface protector for Line 6 HX Effects. Shields the control surface from stage wear and tear.',
    39.95, null, 'full-face-protectors', ['hx-effects']);

  await createProduct('HX Effects Scribble Strip Shield', 'hx-effects-scribble-shield',
    'Dedicated protector strip for the HX Effects scribble strip displays.',
    17.95, null, 'screen-protectors', ['hx-effects']);

  // Helix Rack (2)
  await createProduct('Helix Rack Front Panel Shield', 'helix-rack-front-panel',
    'Rack-mountable front panel protector for Helix Rack. 2U form factor, clear acrylic.',
    39.95, null, 'full-face-protectors', ['helix-rack']);

  await createProduct('Helix Rack Screen Protector', 'helix-rack-screen-protector',
    'Screen protector for the Helix Rack display panel.',
    24.95, null, 'screen-protectors', ['helix-rack']);

  // Helix Stadium XL (2)
  await createProduct('Stadium XL Full Surface Armor', 'stadium-xl-full-armor',
    'Heavy-duty full surface protector for the massive Helix Stadium XL. Carbon fiber finish option for touring rigs.',
    89.95, null, 'full-face-protectors', ['helix-stadium-xl'],
    [
      { variantLabel: 'Clear 3mm Magnetic', material: 'Clear Acrylic', thicknessMm: 3.0, mountType: 'Magnetic', priceModifier: 0, stockQty: 15, skuSuffix: 'CLR-3-MAG' },
      { variantLabel: 'Carbon Fiber 3mm Screw-Mount', material: 'Carbon Fiber Finish', thicknessMm: 3.0, mountType: 'Screw-Mount', priceModifier: 10.00, stockQty: 10, skuSuffix: 'CF-3-SCR' },
    ]);

  await createProduct('Stadium XL Screen Guard', 'stadium-xl-screen-guard',
    'Screen protector for the Helix Stadium XL touchscreen display.',
    34.95, null, 'screen-protectors', ['helix-stadium-xl']);

  // Quad Cortex products (4)
  await createProduct('Quad Cortex Touchscreen Shield', 'qc-touchscreen-shield',
    'Premium screen protector for the Neural DSP Quad Cortex 7" touchscreen. Maintains full touch responsiveness.',
    34.95, 39.95, 'screen-protectors', ['quad-cortex']);

  await createProduct('Quad Cortex Full Face Protector', 'qc-full-face-protector',
    'Full coverage protector for the Quad Cortex. Precision-cut for all capture knobs and footswitches.',
    59.95, null, 'full-face-protectors', ['quad-cortex']);

  await createProduct('Quad Cortex Knob Guard Set', 'qc-knob-guard-set',
    'Individual knob guards for all 4 rotary encoders on the Quad Cortex.',
    22.95, null, 'knob-guards', ['quad-cortex']);

  await createProduct('Quad Cortex Ultimate Bundle', 'qc-ultimate-bundle',
    'The complete QC protection package: touchscreen shield + full face protector + knob guards. Everything you need.',
    94.95, 117.85, 'bundles', ['quad-cortex']);

  // Nano Cortex (2)
  await createProduct('Nano Cortex Screen Shield', 'nano-cortex-screen-shield',
    'Compact screen protector for the Neural DSP Nano Cortex display.',
    19.95, null, 'screen-protectors', ['nano-cortex']);

  await createProduct('Nano Cortex Full Body Guard', 'nano-cortex-full-body',
    'Full body protector for the Nano Cortex. Perfect for pedalboard-mounted setups.',
    32.95, null, 'full-face-protectors', ['nano-cortex']);

  // Axe-Fx III (3)
  await createProduct('Axe-Fx III Front Panel Shield', 'axe-fx-iii-front-panel',
    'Rack-mountable front panel protector for the Fractal Audio Axe-Fx III. Studio-grade clarity.',
    44.95, null, 'full-face-protectors', ['axe-fx-iii']);

  await createProduct('Axe-Fx III Screen Protector', 'axe-fx-iii-screen-protector',
    'Display protector for the Axe-Fx III color LCD.',
    29.95, null, 'screen-protectors', ['axe-fx-iii']);

  await createProduct('Axe-Fx III Custom Engraved Panel', 'axe-fx-iii-custom-engraved',
    'Custom laser-engraved front panel protector for the Axe-Fx III. Perfect for studio rigs.',
    64.95, null, 'custom-engraved', ['axe-fx-iii'],
    [
      { variantLabel: 'Gold Engraved 3mm', material: 'Gold Acrylic', thicknessMm: 3.0, mountType: 'Screw-Mount', priceModifier: 0, stockQty: 12, skuSuffix: 'GLD-3-ENG' },
      { variantLabel: 'Smoked Engraved 3mm', material: 'Smoked Tinted', thicknessMm: 3.0, mountType: 'Screw-Mount', priceModifier: 0, stockQty: 12, skuSuffix: 'SMK-3-ENG' },
    ]);

  // FM9 (3)
  await createProduct('FM9 Screen Shield', 'fm9-screen-shield',
    'Screen protector for the Fractal Audio FM9. Crystal clear acrylic with precision-cut edges.',
    29.95, null, 'screen-protectors', ['fm9']);

  await createProduct('FM9 Full Surface Protector', 'fm9-full-surface-protector',
    'Complete control surface protector for the FM9. Protects scribble strips and LCD.',
    54.95, null, 'full-face-protectors', ['fm9']);

  await createProduct('FM9 Protection Bundle', 'fm9-protection-bundle',
    'Full FM9 protection kit: screen shield + full surface protector + knob guards.',
    79.95, 104.85, 'bundles', ['fm9']);

  // FM3 (2)
  await createProduct('FM3 Screen Protector', 'fm3-screen-protector',
    'Compact screen protector for the Fractal Audio FM3.',
    22.95, null, 'screen-protectors', ['fm3']);

  await createProduct('FM3 Full Face Shield', 'fm3-full-face-shield',
    'Full face protector for the FM3. Slim profile design.',
    39.95, null, 'full-face-protectors', ['fm3']);

  // AM4 (2)
  await createProduct('AM4 Desktop Shield', 'am4-desktop-shield',
    'Desktop protector for the Fractal Audio AM4. Protects the top surface from studio wear.',
    29.95, null, 'full-face-protectors', ['am4']);

  await createProduct('AM4 Screen Guard', 'am4-screen-guard',
    'Screen protector for the AM4 color display.',
    19.95, null, 'screen-protectors', ['am4']);

  // Kemper Profiler Stage (3)
  await createProduct('Profiler Stage Screen Shield', 'profiler-stage-screen-shield',
    'Screen protector for the Kemper Profiler Stage color display.',
    29.95, null, 'screen-protectors', ['profiler-stage']);

  await createProduct('Profiler Stage Full Armor', 'profiler-stage-full-armor',
    'Full surface protector for the Kemper Profiler Stage. Covers all control areas.',
    59.95, null, 'full-face-protectors', ['profiler-stage']);

  await createProduct('Profiler Stage Custom Engraved', 'profiler-stage-custom-engraved',
    'Custom laser-engraved acrylic protector for the Kemper Profiler Stage. Add your signature or band name.',
    54.95, null, 'custom-engraved', ['profiler-stage'],
    [
      { variantLabel: 'Gold Engraved 2mm Magnetic', material: 'Gold Acrylic', thicknessMm: 2.0, mountType: 'Magnetic', priceModifier: 0, stockQty: 18, skuSuffix: 'GLD-2-MAG-ENG' },
      { variantLabel: 'Carbon Fiber Engraved 3mm', material: 'Carbon Fiber Finish', thicknessMm: 3.0, mountType: 'Screw-Mount', priceModifier: 10.00, stockQty: 10, skuSuffix: 'CF-3-SCR-ENG' },
    ]);

  // Kemper Rack MK2 (2)
  await createProduct('Profiler Rack MK2 Front Shield', 'profiler-rack-mk2-shield',
    'Front panel protector for the Kemper Profiler Rack MK2. Rack-mountable design.',
    39.95, null, 'full-face-protectors', ['profiler-rack-mk2']);

  await createProduct('Profiler Rack MK2 Screen Guard', 'profiler-rack-mk2-screen',
    'Screen protector for the Profiler Rack MK2 display.',
    24.95, null, 'screen-protectors', ['profiler-rack-mk2']);

  // Boss GT-1000 (3)
  await createProduct('GT-1000 Screen Shield', 'gt-1000-screen-shield',
    'Screen protector for the Boss GT-1000 color touchscreen.',
    27.95, null, 'screen-protectors', ['gt-1000']);

  await createProduct('GT-1000 Full Face Protector', 'gt-1000-full-face',
    'Full surface protector for the Boss GT-1000.',
    49.95, null, 'full-face-protectors', ['gt-1000']);

  await createProduct('GT-1000 Complete Bundle', 'gt-1000-complete-bundle',
    'Boss GT-1000 protection bundle: screen + full face + knob guards.',
    69.95, 87.85, 'bundles', ['gt-1000']);

  // Boss GT-1000CORE (2)
  await createProduct('GT-1000CORE Shield', 'gt-1000core-shield',
    'Desktop protector for the Boss GT-1000CORE.',
    24.95, null, 'full-face-protectors', ['gt-1000core']);

  await createProduct('GT-1000CORE Screen Guard', 'gt-1000core-screen-guard',
    'Screen protector for the GT-1000CORE display.',
    17.95, null, 'screen-protectors', ['gt-1000core']);

  // Boss GX-100 (2)
  await createProduct('GX-100 Screen Protector', 'gx-100-screen-protector',
    'Screen protector for the Boss GX-100 touchscreen.',
    22.95, null, 'screen-protectors', ['gx-100']);

  await createProduct('GX-100 Full Surface Guard', 'gx-100-full-surface',
    'Full surface protector for the Boss GX-100.',
    39.95, null, 'full-face-protectors', ['gx-100']);

  // Fender Tone Master Pro (3)
  await createProduct('Tone Master Pro Screen Shield', 'tmp-screen-shield',
    'Premium screen protector for the Fender Tone Master Pro touchscreen display.',
    32.95, null, 'screen-protectors', ['tone-master-pro']);

  await createProduct('Tone Master Pro Full Surface Protector', 'tmp-full-surface',
    'Full surface protector for the Fender Tone Master Pro.',
    59.95, null, 'full-face-protectors', ['tone-master-pro']);

  await createProduct('Tone Master Pro Protection Bundle', 'tmp-protection-bundle',
    'Complete Tone Master Pro protection: screen shield + full face + knob guards. Free shipping included.',
    84.95, 102.85, 'bundles', ['tone-master-pro']);

  // Headrush Prime (2)
  await createProduct('Headrush Prime Screen Shield', 'headrush-prime-screen-shield',
    'Screen protector for the Headrush Prime 7" touchscreen.',
    32.95, null, 'screen-protectors', ['headrush-prime']);

  await createProduct('Headrush Prime Full Armor', 'headrush-prime-full-armor',
    'Full surface protector for the Headrush Prime.',
    54.95, null, 'full-face-protectors', ['headrush-prime']);

  // Headrush Flex Prime (2)
  await createProduct('Flex Prime Screen Guard', 'flex-prime-screen-guard',
    'Screen protector for the Headrush Flex Prime display.',
    27.95, null, 'screen-protectors', ['flex-prime']);

  await createProduct('Flex Prime Custom Engraved Shield', 'flex-prime-custom-engraved',
    'Custom laser-engraved protector for the Headrush Flex Prime. Personalize with your text or logo.',
    49.95, null, 'custom-engraved', ['flex-prime'],
    [
      { variantLabel: 'Gold Engraved 2mm Command Strip', material: 'Gold Acrylic', thicknessMm: 2.0, mountType: 'Command Strip', priceModifier: 0, stockQty: 20, skuSuffix: 'GLD-2-CMD-ENG' },
      { variantLabel: 'Clear Engraved 3mm Magnetic', material: 'Clear Acrylic', thicknessMm: 3.0, mountType: 'Magnetic', priceModifier: 5.00, stockQty: 15, skuSuffix: 'CLR-3-MAG-ENG' },
    ]);

  // Additional bundle products
  await createProduct('Helix Floor Ultimate Bundle', 'helix-floor-ultimate-bundle',
    'The ultimate Helix Floor protection package. Screen shield + full face guard + complete knob guard set. Built for touring musicians.',
    89.95, 104.85, 'bundles', ['helix-floor']);

  await createProduct('Profiler Stage Complete Bundle', 'profiler-stage-complete-bundle',
    'Kemper Profiler Stage full protection kit. Screen + face + knob guards all included.',
    84.95, 109.85, 'bundles', ['profiler-stage']);

  console.log(`Created ${allProducts.length} products`);

  // --- REVIEWS ---
  const reviewsData = [
    { rating: 5, title: 'Touring essential!', body: 'Been on the road for 3 months with this on my Helix Floor. Not a single scratch on the screen. Worth every penny for gigging musicians.', productIdx: 0 },
    { rating: 5, title: 'Perfect fit, great quality', body: 'Fits my Quad Cortex like a glove. The magnetic mount is genius — pops right off when I need to clean the screen. Crystal clear too.', productIdx: 17 },
    { rating: 4, title: 'Solid protection for studio use', body: 'Using this in my home studio on the Axe-Fx III. Great quality acrylic, just wish there were more color options. Still, 4 stars.', productIdx: 23 },
    { rating: 5, title: 'Saved my Helix from a beer spill', body: 'Some dude knocked his beer right onto my pedalboard at a bar gig. The full face guard saved my Helix LT. Paid for itself instantly.', productIdx: 4 },
    { rating: 5, title: 'Custom engraving looks incredible', body: 'Got my band logo engraved on the gold acrylic for my HX Stomp. Looks absolutely stunning on my board. Gets compliments every show.', productIdx: 8 },
    { rating: 4, title: 'Good but takes practice to install', body: 'The screw-mount version is rock solid once installed, but alignment took me a couple tries. Read the instructions carefully. Protection is excellent though.', productIdx: 1 },
    { rating: 5, title: 'Must-have for Kemper users', body: 'The Profiler Stage screen shield is perfect. Ive dropped picks on my board countless times — this thing just tanks everything. Highly recommend.', productIdx: 33 },
    { rating: 3, title: 'Decent but smoked tint is dark', body: 'The smoked tinted version looks cool but its a bit too dark for reading the screen under stage lights. Go with clear if you gig a lot.', productIdx: 17 },
    { rating: 5, title: 'Best pedalboard investment this year', body: 'Bought the QC bundle. Screen protector, face guard, knob guards — the whole nine. My Quad Cortex looks brand new after 6 months of heavy use.', productIdx: 20 },
    { rating: 5, title: 'These knob guards are clutch', body: 'Finally something that protects the capture knobs on my QC. They fit perfectly and dont affect the feel at all. Should be standard equipment.', productIdx: 19 },
    { rating: 4, title: 'Great for the GT-1000', body: 'Nice quality, fits well on my Boss GT-1000. The command strip mount is easy but I wish there was a magnetic option for this model.', productIdx: 37 },
    { rating: 5, title: 'FM9 protection on point', body: 'Running an FM9 on a fly rig. This protector gives me peace of mind throwing it in the case every weekend. No scratches, no worries.', productIdx: 26 },
    { rating: 5, title: 'Studio-grade quality', body: 'The Axe-Fx III custom engraved panel is a work of art. Laser engraving is precise and the gold acrylic is premium. Studio clients always comment on it.', productIdx: 25 },
    { rating: 4, title: 'Works great on the Tone Master Pro', body: 'Fender Tone Master Pro screen shield fits perfectly. Clear as glass. Only wish it was a tiny bit thicker for extra protection.', productIdx: 42 },
    { rating: 5, title: 'Magnetic mount is the move', body: 'The magnetic mount version on my Helix Floor is perfect. Snaps on, snaps off. Clean when I need to, protected when I dont. Simple and brilliant.', productIdx: 0 },
    { rating: 5, title: 'Headrush Prime approved!', body: 'Fits the 7 inch touchscreen perfectly. Still fully responsive to touch through the protector. No air bubbles, no issues.', productIdx: 44 },
    { rating: 4, title: 'Good protection for nano', body: 'Nano Cortex protector is well made. Small unit so its nice to have something keeping it safe in my packed pedalboard.', productIdx: 21 },
    { rating: 5, title: 'Bundle deal is unbeatable', body: 'Got the Helix LT bundle — saved 15% and got everything I needed in one shot. All three pieces fit perfectly together.', productIdx: 5 },
    { rating: 5, title: 'Carbon fiber looks insane', body: 'The carbon fiber finish on the Stadium XL protector looks absolutely incredible. My rig looks like a spaceship now. 10/10.', productIdx: 15 },
    { rating: 4, title: 'Practical and clean', body: 'FM3 full face shield does its job. Nothing fancy but well-made and fits correctly. Keeps dust and gunk off my unit in the rehearsal space.', productIdx: 29 },
  ];

  for (let i = 0; i < reviewsData.length; i++) {
    const r = reviewsData[i];
    const product = allProducts[r.productIdx];
    if (!product) continue;
    await prisma.review.create({
      data: {
        productId: product.id,
        userId: i % 2 === 0 ? customer.id : admin.id,
        rating: r.rating,
        title: r.title,
        body: r.body,
        isVerifiedPurchase: i % 3 !== 2,
      },
    });
  }

  console.log('Created 20 reviews');
  console.log('Seeding complete!');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
