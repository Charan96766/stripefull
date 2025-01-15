import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for API calls
import '../components/Products.css'; // Importing the CSS file

const stripe = require('stripe')('sk_test_51NXNS9SHnZYTSMbTUj3LcD8QFcpFHtearqe03HJAXDxBGmPBJJpexfHBBL1cnLkD62s5a266XFXawKjnSAT7TRP700friK4DeZ');

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({}); // State to manage quantities for each price
 
  console.log(quantities);
  useEffect(() => {
    const fetchProductsAndPrices = async () => {
      try {
        const pricesResponse = await stripe.prices.list({ limit: 100 }); 
        console.log(pricesResponse);
        const productsResponse = await stripe.products.list({ limit: 100 }); 
        console.log(productsResponse);

        const prices = pricesResponse.data;
        const products = productsResponse.data;

        const productsWithPrices = products.map((product) => {
          const productPrices = prices.filter((price) => price.product === product.id);
          const defaultImageUrl =
            'https://play-lh.googleusercontent.com/Q3wzk5aulWZyYPHur93uTY3lSt4CKTIiQOOOxPvsKHJbVMux3xpBxcmdCLpIxdZ0Ss89=w600-h300-pc0xffffff-pd';

          const imageUrl =
            product.images.length > 0 && !product.images[0].endsWith('undefined') && !product.images[0].endsWith('7782')
              ? product.images[0]
              : defaultImageUrl;

          return {
            ...product,
            prices: productPrices.map((price) => ({
              amount: price.unit_amount / 100,
              currency: price.currency,
              id: price.id,
            })),
            image: imageUrl,
          };
        });

        setProducts(productsWithPrices);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndPrices();
  }, []);

  const handleSubscribe = async (priceId, quantity) => {
    try {
      const response = await axios.post('https://wh7qgkozi1.execute-api.ap-south-1.amazonaws.com/prod/subscription', {
        priceId,
        quantity,
      });
      console.log('Subscription successful:', response.data);   
      localStorage.setItem("sessionid", response.data.session.id);
      console.log(response.data.session);
      window.location.href = response.data.sessionUrl;
      alert('Subscription successful!');
    } catch (error) {
      console.error('Subscription failed:', error);
      alert('Subscription failed. Please try again.');
    }
  };

  const handleQuantityChange = (priceId, delta) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [priceId]: Math.max(1, (prevQuantities[priceId] || 1) + delta),
    }));
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="products-container">
      <h1 className="products-header">Products</h1>
      <div className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="quantity-container">
                <button
                  className="quantity-button"
                  onClick={() => handleQuantityChange(product.id, -1)}
                >
                  -
                </button>
                <span className="quantity-value">
                  {quantities[product.id] || 1}
                </span>
                <button
                  className="quantity-button"
                  onClick={() => handleQuantityChange(product.id, 1)}
                >
                  +
                </button>
              </div>
              <div className="prices-container">
                {product.prices.map((price) => (
                  <div key={price.id} className="price-card">
                    <p className="price-text">
                      Price: {price.amount} {price.currency.toUpperCase()}
                    </p>
                    <button
                      className="subscribe-button"
                      onClick={() =>
                        handleSubscribe(price.id, quantities[product.id] || 1)
                      }
                    >
                      Subscribe
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="no-products">No products available.</p>
        )}
      </div>
    </div>
  );
};

export default Products;
