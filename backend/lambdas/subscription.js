const stripe = require('stripe')('sk_test_51NXNS9SHnZYTSMbTUj3LcD8QFcpFHtearqe03HJAXDxBGmPBJJpexfHBBL1cnLkD62s5a266XFXawKjnSAT7TRP700friK4DeZ');

exports.handler = async (event) => {
  try {
    const { priceId, quantity } = JSON.parse(event.body);

    // Validate required fields
    if (!priceId || !quantity) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: priceId or quantity' }),
      };
    }

    // Hardcoded customer ID
    const hardcodedCustomerId = 'cus_RWBX5FGIuiTBRy'; // Replace with your actual customer ID from Stripe

    // Create a checkout session for a subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Accept multiple payment methods
      mode: 'subscription',
      customer: hardcodedCustomerId,  // Use the hardcoded customer ID 
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      success_url: 'http://localhost:3000/success', // Replace with your frontend success route
      cancel_url: 'http://localhost:3000/cancel', // Replace with your frontend cancel route
    }); 

    console.log(session);
    // Return the full session object and session URL to the frontend
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Avoid CORS errors
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({
        session,
        sessionUrl: session.url, // Include the session URL for redirection
      }),
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Avoid CORS errors
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Failed to create checkout session' }),
    };
  }
};
