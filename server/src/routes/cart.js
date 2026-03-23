const router = require('express').Router();
const { authenticate } = require('../middleware/auth');

async function getOrCreateCart(prisma, userId, sessionId) {
  let cart;
  if (userId) {
    cart = await prisma.cart.findFirst({ where: { userId }, include: { items: { include: { product: true, variant: true } } } });
  } else if (sessionId) {
    cart = await prisma.cart.findFirst({ where: { sessionId }, include: { items: { include: { product: true, variant: true } } } });
  }
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId: userId || null, sessionId: sessionId || null },
      include: { items: { include: { product: true, variant: true } } },
    });
  }
  return cart;
}

router.get('/', async (req, res) => {
  try {
    const userId = req.headers.authorization ? (() => {
      try {
        const jwt = require('jsonwebtoken');
        const token = req.headers.authorization.split(' ')[1];
        return jwt.verify(token, process.env.JWT_SECRET).id;
      } catch { return null; }
    })() : null;
    const sessionId = req.query.session_id;
    const cart = await getOrCreateCart(req.prisma, userId, sessionId);
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

router.post('/', async (req, res) => {
  try {
    const userId = req.headers.authorization ? (() => {
      try {
        const jwt = require('jsonwebtoken');
        const token = req.headers.authorization.split(' ')[1];
        return jwt.verify(token, process.env.JWT_SECRET).id;
      } catch { return null; }
    })() : null;
    const { productId, variantId, quantity = 1, sessionId } = req.body;
    const cart = await getOrCreateCart(req.prisma, userId, sessionId);

    const existing = cart.items.find(i =>
      i.productId === parseInt(productId) && (variantId ? i.variantId === parseInt(variantId) : !i.variantId)
    );

    if (existing) {
      await req.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + parseInt(quantity) },
      });
    } else {
      await req.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: parseInt(productId),
          variantId: variantId ? parseInt(variantId) : null,
          quantity: parseInt(quantity),
        },
      });
    }

    const updated = await req.prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { product: true, variant: true } } },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

router.put('/:itemId', async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity <= 0) {
      await req.prisma.cartItem.delete({ where: { id: parseInt(req.params.itemId) } });
    } else {
      await req.prisma.cartItem.update({
        where: { id: parseInt(req.params.itemId) },
        data: { quantity: parseInt(quantity) },
      });
    }
    res.json({ message: 'Cart updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

router.delete('/:itemId', async (req, res) => {
  try {
    await req.prisma.cartItem.delete({ where: { id: parseInt(req.params.itemId) } });
    res.json({ message: 'Item removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

module.exports = router;
