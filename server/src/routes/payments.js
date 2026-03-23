const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

router.post('/create-intent', authenticate, async (req, res) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: { userId: String(req.user.id) },
    });

    res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      await req.prisma.order.updateMany({
        where: { stripePaymentIntentId: paymentIntent.id },
        data: { status: 'paid' },
      });
    }

    res.json({ received: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Webhook error' });
  }
});

module.exports = router;
