import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/Cart.scss";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const [bill, setBill] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

    useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/getCart", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          setCartItems(res.data.cartItems); 
        }
      } catch (err) {
        console.error("Error fetching cart items:", err);
        setError("Failed to load cart items. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [token]);

  useEffect(() => {
    const calculateBill = () => {
      const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setBill(total);
    };

    calculateBill();
  }, [cartItems]);


  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/getUserAddresses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 200) {
          setAddresses(res.data.data); // Assuming your API returns 'addresses'
        }
      } catch (err) {
        console.error("Error fetching addresses:", err);
        setError("No address added. Please add one !");
      }
    };

    fetchAddresses();
  }, [token]);

  const incrementQuantity = async (productId) => {
    try {
      const res = await axios.put(`http://localhost:3001/api/incrementCartQuantity/${productId}`,{},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.productID === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Error incrementing quantity:", err);
    }
  };

  const decrementQuantity = async (productId) => {
    try {
      const res = await axios.put(
        `http://localhost:3001/api/decrementCartQuantity/${productId}`,{},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 200) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.productID === productId && item.quantity > 1
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
        );
      }
    } catch (err) {
      console.error("Error decrementing quantity:", err);
    }
  };


  const deleteItem = async (productId) => {
    try {
      const res = await axios.delete(`http://localhost:3001/api/deleteCartItem/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        setCartItems(cartItems.filter((item) => item.productID !== productId));
        alert("Product removed from cart.");
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      setError("Failed to delete the item. Please try again.");
    }
  };


  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select an address to place the order.");
      return;
    }
    const fullAddress = `${selectedAddress.city}, ${selectedAddress.district}, ${selectedAddress.pincode}, ${selectedAddress.country}`;
    const orderData = {
      cartItems,
      address: fullAddress,
    };
  
    try {
      const res = await axios.post("http://localhost:3001/api/placeOrder", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (res.status === 200) {
        alert("Order placed successfully!");
        setCartItems([]);
        setSelectedAddress(null);
      }
    } catch (err) {
      console.error("Error placing order:", err);
      setError("Failed to place the order. Please try again.");
    }
  };

  if (loading) {
    return <div className="cart-content">Loading your cart...</div>;
  }

  if (error) {
    return <div className="cart-content error">{error}</div>;
  }

  return (
    <div className="cart-container">
      <div className="cart-items-section">
        <h2>Your Cart</h2>
        {cartItems.length > 0 ? (
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.productID} className="cart-item">
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>Price: ₹{item.price}</p>
                  <div className="quantity-controls">
                    <button
                      onClick={() => decrementQuantity(item.productID)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => incrementQuantity(item.productID)}>
                      +
                    </button>
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => deleteItem(item.productID)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>No items in your cart yet.</div>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="bill-section">
          <h2>Bill</h2>
          <p>Total Amount: ₹{bill}</p>
          <div className="address-section">
            <h3>Select Address</h3>
            {addresses.length > 0 ? (
              <div className="address-options">
                {addresses.map((address, index) => (
                  <div key={index}>
                  <label  className="address-option">
                    <input
                      type="radio"
                      name="address"
                      value={address}
                      onChange={() => setSelectedAddress(address)}
                    />
                    {`${address.city}, ${address.district}, ${address.pincode}, ${address.country}`}
                  </label>
                  </div>
                ))}
              </div>
            ) : (
              <p>No addresses found. Please add an address in your profile.</p>
            )}
          </div>
          <button className="place-order-button" onClick={handlePlaceOrder}>
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;