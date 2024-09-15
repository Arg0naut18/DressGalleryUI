import React, { useEffect, useState } from 'react';
import config from './config';

const UpdateClothForm = ({ onClose, onSave, cloth }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [age, setAge] = useState('');
  const [brand, setBrand] = useState('');
  const [image, setImage] = useState(null);
  const [tagsString, setTagsString] = useState('');

  useEffect(() => {
    if (cloth) {
      setName(cloth.name || '');
      setColor(cloth.color || '');
      setAge(cloth.age || '');
      setBrand(cloth.brand || '');
      setTagsString(cloth.tags ? cloth.tags.join(', ') : '');
      setImage(cloth.image || null);
    }
  }, [cloth]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const tags = tagsString.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag);

    try {
      const params = {};
      params['name'] = name.toLowerCase();
      params['color'] = color.toLowerCase();
      if (age) params['purchased_year'] = age;
      if (brand) params['brand'] = brand.toLowerCase();
      if (tags.length > 0) {
        params['tags'] = tags;
      }
      if (image) {
        params['image'] = image;
      }
      const userId = localStorage.getItem("userId");
      console.log(params);
      console.log(userId);

      const url = `${config.host}/outfit/update/${cloth._id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-User-ID': userId
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        throw new Error('Failed to update the cloth');
      }

      onSave();
    } catch (error) {
      console.error('Error:', error);
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
            <h2>Update Garment</h2>
            <form onSubmit={handleSubmit} id='dress-update-form'>
              <table cellSpacing={5} cellPadding={5} align='center'>
                <tbody>
                  <tr>
                    <th>Name:</th>
                    <th><input type="text" value={name} name='dress-update-name' onChange={(e) => setName(e.target.value)} required /></th>
                  </tr>
                  <tr>
                    <th>Color:</th>
                    <th><input type="text" value={color} name='dress-update-color' onChange={(e) => setColor(e.target.value)} required /></th>
                  </tr>
                  <tr>
                    <th>Year Purchased:</th>
                    <th><input type="text" value={age} name='dress-update-year' onChange={(e) => setAge(e.target.value)} /></th>
                  </tr>
                  <tr>
                    <th>Brand:</th>
                    <th><input type="text" value={brand} name='dress-update-brand' onChange={(e) => setBrand(e.target.value)} /></th>
                  </tr>
                  <tr>
                    <th>Tags (comma-separated):</th>
                    <th><input
                        type="text"
                        value={tagsString}
                        name='dress-update-tags'
                        onChange={(e) => setTagsString(e.target.value)}
                        placeholder="e.g., summer, hoodie, casual"
                    /></th>
                  </tr>
                  <tr>
                    <th>Image:</th>
                    <th><input type="file" name='dress-update-image' onChange={handleImageChange} /></th>
                  </tr>
                  <tr>
                    <th><button type="button" onClick={onClose}>Cancel</button></th>
                    <th><button type="submit" onClick={handleSubmit}>Update Outfit</button></th>
                  </tr>
                </tbody>
              </table>
            </form>
        </div>
    </div>
  );
};

export default UpdateClothForm;
