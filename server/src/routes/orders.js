const router = require('express').Router();
const { authenticate, requireAdmin } = require('../middleware/auth');

router.post('/', authenticate, async (req, res) => {
  try {
    const { items, shippingAddress, stripePaymentIntentId } = req.body;
    if (!items || !items.length) return res.status(400).json({ error: 'No items' });

    // Save address if provided
    if (shippingAddress) {
      await req.prisma.address.create({
        data: { userId: req.user.id, ...shippingAddress },
      });
    }

    let subtotal = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await req.prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) return res.status(400).json({ error: `Product ${item.productId} not found` });

      let unitPrice = parseFloat(product.price);
      if (item.variantId) {
        const variant = await req.prisma.productVariant.findUnique({ where: { id: item.variantId } });
        if (variant) unitPrice += parseFloat(variant.priceModifier);
      }

      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;
      orderItems.push({
        productId: item.productId,
        variantId: item.variantId || null,
        quantity: item.quantity,
        unitPrice,
        lineTotal,
      });
    }

    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const shippingCost = subtotal >= 75 ? 0 : 9.95;
    const total = Math.round((subtotal + tax + shippingCost) * 100) / 100;

    const order = await req.prisma.order.create({
      data: {
        userId: req.user.id,
        subtotal,
        shippingCost,
        tax,
        total,
        stripePaymentIntentId: stripePaymentIntentId || null,
        status: 'paid',
        items: { create: orderItems },
      },
      include: { items: { include: { product: true, variant: true } } },
    });

    // Clear user's cart
    const cart = await req.prisma.cart.findFirst({ where: { userId: req.user.id } });
    if (cart) {
      await req.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const where = req.user.role === 'admin' ? {} : { userId: req.user.id };
    const orders = await req.prisma.order.findMany({
      where,
      include: { items: { include: { product: true, variant: true } }, user: { select: { email: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await req.prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { items: { include: { product: true, variant: true } }, user: { select: { email: true, firstName: true, lastName: true } } },
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

router.put('/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await req.prisma.order.update({
      where: { id: parseInt(req.params.id) },
      data: { status },
    });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
