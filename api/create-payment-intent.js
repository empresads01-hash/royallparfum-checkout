const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, phone, ttclid } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 8000, // 80.00 EUR em centavos
      currency: 'eur',
      metadata: {
        customer_name: name || '',
        customer_email: email || '',
        customer_phone: phone || '',
        ttclid: ttclid || '',
        product_name: 'Set Douglas Promo',
      },
      receipt_email: email,
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
};
