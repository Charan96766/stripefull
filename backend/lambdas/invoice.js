const stripe = require('stripe')('sk_test_51NXNS9SHnZYTSMbTUj3LcD8QFcpFHtearqe03HJAXDxBGmPBJJpexfHBBL1cnLkD62s5a266XFXawKjnSAT7TRP700friK4DeZ');

exports.handler = async (event) => {
  try {
    // Parse the session ID from the request body
    const { sessionId } = JSON.parse(event.body);

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('Session:', session);  // Log the session for debugging

    // Check if the session is in subscription mode
    if (session.mode === 'subscription') {
      // Retrieve the subscription associated with the session, expanding the latest_invoice
      const subscription = await stripe.subscriptions.retrieve(session.subscription, {
        expand: ['latest_invoice'],
      });
      console.log('Subscription:', subscription);  // Log the subscription for debugging

      // Get the latest invoice from the subscription
      const latestInvoice = subscription.latest_invoice;
      console.log('Latest Invoice:', latestInvoice);  // Log the latest invoice for debugging

      // Check if the latest invoice has the invoice_pdf attribute
      if (latestInvoice && latestInvoice.invoice_pdf) {
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*', // Allow all origins or specify your frontend URL
            'Access-Control-Allow-Methods': 'OPTIONS, POST, GET', // Allow specific HTTP methods
            'Access-Control-Allow-Headers': 'Content-Type', // Allow specific headers
          },
            body: JSON.stringify({
                invoicePdfUrl: latestInvoice.invoice_pdf, 
                hostedUrl: latestInvoice.hosted_invoice_url
              
           }),  // Return the invoice PDF URL
        };
      } else {
        throw new Error('Invoice PDF URL is not available or invoice is not finalized yet.');
      }
    } else {
      throw new Error('Session is not in subscription mode.');
    }
  } catch (error) {
    console.error('Error retrieving invoice PDF:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow all origins or specify your frontend URL
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: error.message }),  // Return the error message
    };
  }
};
