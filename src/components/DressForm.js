import React, { useState } from 'react';
import config from './config';

/* eslint-disable react/prop-types */
const AddClothForm = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [age, setAge] = useState('');
  const [brand, setBrand] = useState('');
  const [image, setImage] = useState(null);
  const [selectedTags, setSelectedTags] = useState('');

  const tags = selectedTags.split(',').map(tag => tag.trim()).filter(tag => tag);
  const userId = localStorage.getItem('userId');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const params = {};
      params['name'] = name.toLowerCase();
      params['color'] = color.toLowerCase();
      params['image'] = image.toLowerCase();
      if (age) params['purchased_year'] = age;
      if (brand) params['brand'] = brand.toLowerCase();
      if (tags.length > 0) {
        for (let index = 0; index < tags.length; index++) {
          tags[index] = tags[index].toLowerCase();
        }
        params['tags'] = tags;
      }
      params['user_id'] = userId;

      const response = await fetch(`${config.host}/outfit/add`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' , 'Accept': 'application/json', 'X-User-ID': userId },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error('Failed to add cloth');
      }
      onSave();
      onClose();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      getBase64(file)
        .then((base64Image) => {
          setImage(base64Image);
        })
        .catch((error) => {
          console.error('Error converting image to base64:', error);
        });
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="cloth-form-overlay">
      <div className="form-container">
        <h2>Add New Garment</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Color:
            <input type="text" value={color} onChange={(e) => setColor(e.target.value)} required />
          </label>
          <label>
            Year Purchased:
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
          </label>
          <label>
            Brand:
            <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} />
          </label>
          <label>
            Image:
            <input type="file" accept="image/*" onChange={handleImageChange} required />
          </label>
          <label>
            Tags:
            <input type="text" value={selectedTags} onChange={(e) => setSelectedTags(e.target.value)} />
          </label>
          <button type="submit">Add Cloth</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddClothForm;
