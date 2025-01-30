import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Home.scss";

const categories = [
  "Mobile",
  "Laptop",
  "Accessories",
  "Earbud",
  "Trimmer",
  "Charger",
  "Emergency",
  "Speaker",
  "Cable",
  "Power Bank",
  "Camera",
];

const Home = ({ name }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState(200000);

  useEffect(() => {
    const fetchAllOtherProducts = async () => {
      if (!token) {
        const res = await axios.get("http://localhost:3001/api/getAllProducts");

        if (res.status === 200) {
          setProducts(res.data.products);
        }
      } else {
        try {
          const res = await axios.get("http://localhost:3001/api/getAllOtherProducts", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.status === 200) {
            setProducts(res.data.products);
          }
        } catch (error) {
          console.error("Error fetching products:", error);
          localStorage.removeItem("token");
          location.reload();
        }
      }
    };

    fetchAllOtherProducts();
  }, [token]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory;
    const matchesName =
      product.name?.toLowerCase().includes(name?.toLowerCase() || "");
    const matchesPrice = product.price <= priceRange; // Filter by price
    return matchesCategory && matchesName && matchesPrice;
  });

  return (
    <div className="home-page">
      <h2>All Products</h2>

      {/* Category Filter */}
      <div className="categories">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-button ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
        {selectedCategory && (
          <button
            className="clear-filter-button"
            onClick={() => setSelectedCategory("")}
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Price Filter Slider */}
      <div className="price-filter">
        <label>Max Price: ₹{priceRange}</label>
        <input
          type="range"
          min="0"
          max="200000"
          step="500"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
        />
      </div>

      {filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <Link
              to={`/products/${product._id}`}
              key={product._id}
              className="product-item"
            >
              <img
                src={product.thumbnail}
                alt={product.name}
                className="product-thumbnail"
              />
              <span className="product-name">{product.name}</span>
              <span className="product-price">₹{product.price}</span> {/* Display Price */}
            </Link>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default Home;
