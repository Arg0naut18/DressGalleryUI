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

  const tags = selectedTags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag);
  const userId = localStorage.getItem('userId');

  let endpoint;
  if(`${config.environment}`==='Production') {
    endpoint = `${config.host}`
  } else {
    endpoint = `${config.host}:${config.port}`
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const params = {};
      params['name'] = name.toLowerCase();
      params['color'] = color.toLowerCase();
      params['image'] = image;
      if (age) params['purchased_year'] = age;
      if (brand) params['brand'] = brand.toLowerCase();
      if (tags.length > 0) {
        params['tags'] = tags;
      }
      params['user_id'] = userId;

      const response = await fetch(`${endpoint}/outfit/add`, {
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
        <form onSubmit={handleSubmit} id='dress-form'>
          <table cellSpacing={5} cellPadding={5} align='center'>
            <tbody>
              <tr>
                <th>Name:</th>
                <th><input type="text" value={name} name="dress-form-name" onChange={(e) => setName(e.target.value)} required /></th>
              </tr>
              <tr>
                <th>Color:</th>
                <th><input type="text" value={color} name='dress-form-color' onChange={(e) => setColor(e.target.value)} required /></th>
              </tr>
              <tr>
                <th>Year Purchased:</th>
                <th><input type="number" value={age} name='dress-form-year' onChange={(e) => setAge(e.target.value)} /></th>
              </tr>
              <tr>
                <th>Brand:</th>
                <th><input type="text" value={brand} name='dress-form-brand' onChange={(e) => setBrand(e.target.value)} /></th>
              </tr>
              <tr>
                <th>Image:</th>
                <th><input type="file" accept="image/*" name='dress-form-image' onChange={handleImageChange} required /></th>
              </tr>
              <tr>
                <th>Tags:</th>
                <th><input type="text" value={selectedTags} name='dress-form-tags' onChange={(e) => setSelectedTags(e.target.value)} /></th>
              </tr>
              <tr>
                <th><button type="button" onClick={onClose}>Cancel</button></th>
                <th><button type="submit">Add Outfit</button></th>
              </tr>
          </tbody>
          </table>
        </form>
      </div>
    </div>
  );
};

export default AddClothForm;
