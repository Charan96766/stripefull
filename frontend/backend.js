const stripe = require('stripe')('sk_test_51NXNS9SHnZYTSMbTUj3LcD8QFcpFHtearqe03HJAXDxBGmPBJJpexfHBBL1cnLkD62s5a266XFXawKjnSAT7TRP700friK4DeZ');

// Function to create multiple prices for a product
const createPricesForProduct = async (productId) => {
  try {
    // Array of price data
    const pricesData = [
      { amount: 0, interval: 'month' },
      { amount: 1000, interval: 'month' }, // 10 USD
      { amount: 2000, interval: 'month' }, // 20 USD
      { amount: 3000, interval: 'month' }, // 30 USD
    ];

    // Create prices for the given product
    const prices = await Promise.all(
      pricesData.map((price) =>
        stripe.prices.create({
          currency: 'usd',
          unit_amount: price.amount,
          recurring: {
            interval: price.interval,
          },
          product: productId, // Associate price with the specific product ID
        })
      )
    );

    console.log('Prices created:', prices);
  } catch (error) {
    console.error('Error creating prices:', error.message);
  }
};

// Replace 'your_product_id_here' with the actual product ID
const productId = 'prod_RWSZIgrdemci6m';
createPricesForProduct(productId);
