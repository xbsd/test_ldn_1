const router = require('express').Router();
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { brand, device, category, material, mount_type, min_price, max_price, sort, page = 1, limit = 20 } = req.query;
    const where = { isActive: true };
    const orderBy = {};

    if (category) {
      const cat = await req.prisma.category.findUnique({ where: { slug: category } });
      if (cat) where.categoryId = cat.id;
    }

    if (brand || device) {
      where.devices = { some: {} };
      if (device) {
        const dev = await req.prisma.deviceModel.findUnique({ where: { slug: device } });
        if (dev) where.devices.some.deviceModelId = dev.id;
      } else if (brand) {
        const br = await req.prisma.brand.findUnique({ where: { slug: brand } });
        if (br) where.devices.some.deviceModel = { brandId: br.id };
      }
    }

    if (material || mount_type) {
      where.variants = { some: {} };
      if (material) where.variants.some.material = material;
      if (mount_type) where.variants.some.mountType = mount_type;
    }

    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price.gte = parseFloat(min_price);
      if (max_price) where.price.lte = parseFloat(max_price);
    }

    switch (sort) {
      case 'price_asc': orderBy.price = 'asc'; break;
      case 'price_desc': orderBy.price = 'desc'; break;
      case 'newest': orderBy.createdAt = 'desc'; break;
      default: orderBy.createdAt = 'desc';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [products, total] = await Promise.all([
      req.prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: true,
          devices: { include: { deviceModel: { include: { brand: true } } } },
        },
        orderBy,
        skip,
        take: parseInt(limit),
      }),
      req.prisma.product.count({ where }),
    ]);

    res.json({ products, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const product = await req.prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        category: true,
        variants: true,
        devices: { include: { deviceModel: { include: { brand: true } } } },
        reviews: { include: { user: { select: { firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' } },
      },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, slug, description, price, compareAtPrice, sku, stockQty, categoryId, deviceIds, variants } = req.body;
    const product = await req.prisma.product.create({
      data: {
        name, slug, description,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        sku, stockQty: parseInt(stockQty) || 0,
        categoryId: parseInt(categoryId),
        devices: deviceIds ? { create: deviceIds.map(id => ({ deviceModelId: parseInt(id) })) } : undefined,
        variants: variants ? { create: variants } : undefined,
      },
      include: { category: true, variants: true, devices: { include: { deviceModel: true } } },
    });
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, slug, description, price, compareAtPrice, sku, stockQty, categoryId, isActive } = req.body;
    const product = await req.prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name, slug, description,
        price: price ? parseFloat(price) : undefined,
        compareAtPrice: compareAtPrice !== undefined ? (compareAtPrice ? parseFloat(compareAtPrice) : null) : undefined,
        sku, stockQty: stockQty !== undefined ? parseInt(stockQty) : undefined,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        isActive: isActive !== undefined ? isActive : undefined,
      },
      include: { category: true, variants: true, devices: { include: { deviceModel: true } } },
    });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    await req.prisma.product.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
