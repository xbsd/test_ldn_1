const router = require('express').Router();
const { authenticate } = require('../middleware/auth');

router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await req.prisma.review.findMany({
      where: { productId: parseInt(req.params.id) },
      include: { user: { select: { firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

router.post('/:id/reviews', authenticate, async (req, res) => {
  try {
    const { rating, title, body } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });

    // Check if verified purchase
    const order = await req.prisma.orderItem.findFirst({
      where: { productId: parseInt(req.params.id), order: { userId: req.user.id, status: { in: ['paid', 'shipped', 'delivered'] } } },
    });

    const review = await req.prisma.review.create({
      data: {
        productId: parseInt(req.params.id),
        userId: req.user.id,
        rating: parseInt(rating),
        title,
        body,
        isVerifiedPurchase: !!order,
      },
      include: { user: { select: { firstName: true, lastName: true } } },
    });
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

module.exports = router;
