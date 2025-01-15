const stripe = require('stripe')('sk_test_51NXNS9SHnZYTSMbTUj3LcD8QFcpFHtearqe03HJAXDxBGmPBJJpexfHBBL1cnLkD62s5a266XFXawKjnSAT7TRP700friK4DeZ');

exports.handler = async (event) => {
  const payload = event.body; // Do not parse the body, keep it as a string
  const sig = event.headers['Stripe-Signature']; // Get the signature from the headers
  const endpointSecret = 'whsec_EOItQ2mTBIB9LxE0YJRb1HDeZohPTtrA'; // Replace with your webhook secret

  console.log('Received headers:', event.headers); // Debugging log to check headers

  try {
    if (!sig) {
      throw new Error('No stripe-signature header value was provided.');
    }

    // Verify the webhook signature using the raw payload (string) and the signature
    const stripeEvent = stripe.webhooks.constructEvent(payload, sig, endpointSecret); 
    console.log('Stripe Event:', stripeEvent);

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (err) {
    console.error('Webhook Error:', err.message);

    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }
};
