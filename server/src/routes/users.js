const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await req.prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true, addresses: true },
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.put('/me', authenticate, async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const data = {};
    if (firstName) data.firstName = firstName;
    if (lastName) data.lastName = lastName;
    if (email) data.email = email;
    if (password) data.passwordHash = await bcrypt.hash(password, 10);

    const user = await req.prisma.user.update({
      where: { id: req.user.id },
      data,
      select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Addresses
router.get('/me/addresses', authenticate, async (req, res) => {
  try {
    const addresses = await req.prisma.address.findMany({ where: { userId: req.user.id } });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

router.post('/me/addresses', authenticate, async (req, res) => {
  try {
    const { line1, line2, city, state, country, postalCode, isDefault } = req.body;
    if (isDefault) {
      await req.prisma.address.updateMany({ where: { userId: req.user.id }, data: { isDefault: false } });
    }
    const address = await req.prisma.address.create({
      data: { userId: req.user.id, line1, line2, city, state, country: country || 'US', postalCode, isDefault: isDefault || false },
    });
    res.status(201).json(address);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create address' });
  }
});

router.delete('/me/addresses/:id', authenticate, async (req, res) => {
  try {
    await req.prisma.address.delete({ where: { id: parseInt(req.params.id), userId: req.user.id } });
    res.json({ message: 'Address deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete address' });
  }
});

// Admin: list all users
router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const users = await req.prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
