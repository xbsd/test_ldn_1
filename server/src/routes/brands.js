const router = require('express').Router();

router.get('/', async (req, res) => {
  try {
    const brands = await req.prisma.brand.findMany({
      include: { devices: true },
      orderBy: { name: 'asc' },
    });
    res.json(brands);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const brand = await req.prisma.brand.findUnique({
      where: { slug: req.params.slug },
      include: {
        devices: {
          include: {
            products: {
              include: {
                product: {
                  include: { variants: true, category: true },
                },
              },
            },
          },
        },
      },
    });
    if (!brand) return res.status(404).json({ error: 'Brand not found' });
    res.json(brand);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch brand' });
  }
});

module.exports = router;
