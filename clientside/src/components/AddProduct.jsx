import React, { useState } from "react";
import axios from "axios";
import "../css/AddProduct.scss"; // Import SCSS file for styling
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
    const navigate=useNavigate()
    const token=localStorage.getItem('token')
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    quantity: "",
    thumbnail: "",
    images: [],
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [imagesPreview, setImagesPreview] = useState([]);

  // Convert images to base64
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input for thumbnail
  const handleThumbnailChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertBase64(file);
      setFormData((prevData) => ({
        ...prevData,
        thumbnail: base64,
      }));
      setThumbnailPreview(URL.createObjectURL(file)); // Preview image
    }
  };

  // Handle file input for product images
  const handleImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    const base64Images = await Promise.all(files.map(convertBase64));
    setFormData((prevData) => ({
      ...prevData,
      images: base64Images,
    }));
    setImagesPreview(files.map((file) => URL.createObjectURL(file))); // Preview images
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    

    try {
      const res = await axios.post(
        "http://localhost:3001/api/addProduct",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 201) {
        alert("Product added successfully!");
        navigate('/sellerPage')
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <div className="add-product-container">
      <h2 className="title">Add Product</h2>
      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-field">
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div className="form-field">
          <label htmlFor="category">Category:</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="input"
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="Mobile">Mobile</option>
            <option value="Laptop">Laptop</option>
            <option value="Accessories">Accessories</option>
            <option value="Earbud">Earbud</option>
            <option value="Trimmer">Trimmer</option>
            <option value="Charger">Charger</option>
            <option value="Emergency">Emergency</option>
            <option value="Speaker">Speaker</option>
            <option value="Cable">Cable</option>
            <option value="Power Bank">Power Bank</option>
            <option value="Camera">Camera</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="price">Price (₹):</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div className="form-field">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div className="form-field">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="input"
          />
        </div>

        <div className="form-field">
          <label htmlFor="thumbnail">Thumbnail Image:</label>
          <input
            type="file"
            id="thumbnail"
            name="thumbnail"
            accept="image/*"
            onChange={handleThumbnailChange}
            required
            className="file-input"
          />
          {thumbnailPreview && (
            <div className="image-preview">
              <img src={thumbnailPreview} alt="Thumbnail Preview" />
            </div>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="images">Product Images:</label>
          <input
            type="file"
            id="images"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
            required
            className="file-input"
          />
          {imagesPreview.length > 0 && (
            <div className="image-previews">
              {imagesPreview.map((img, index) => (
                <div key={index} className="image-preview">
                  <img src={img} alt={`Product Preview ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
