const router = require('express').Router();

router.get('/', async (req, res) => {
  try {
    const { brand } = req.query;
    const where = {};
    if (brand) {
      const brandRecord = await req.prisma.brand.findUnique({ where: { slug: brand } });
      if (brandRecord) where.brandId = brandRecord.id;
    }
    const devices = await req.prisma.deviceModel.findMany({
      where,
      include: { brand: true },
      orderBy: { modelName: 'asc' },
    });
    res.json(devices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const device = await req.prisma.deviceModel.findUnique({
      where: { slug: req.params.slug },
      include: {
        brand: true,
        products: {
          include: {
            product: {
              include: { variants: true, category: true },
            },
          },
        },
      },
    });
    if (!device) return res.status(404).json({ error: 'Device not found' });
    res.json(device);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch device' });
  }
});

module.exports = router;
