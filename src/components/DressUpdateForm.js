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

    const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);

    try {
      const params = {};
      params['name'] = name;
      params['color'] = color;
      if (age) params['purchased_year'] = age;
      if (brand) params['brand'] = brand;
      if (tags.length > 0) {
        params['tags'] = tags;
      }
      if (image) {
        params['image'] = image;
      }
      const userId = localStorage.getItem("userId");

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
            <form onSubmit={handleSubmit}>
                <div>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                <label>Color:</label>
                <input type="text" value={color} onChange={(e) => setColor(e.target.value)} required />
                </div>
                <div>
                <label>Year Purchased:</label>
                <input type="text" value={age} onChange={(e) => setAge(e.target.value)} />
                </div>
                <div>
                <label>Brand:</label>
                <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} />
                </div>
                <div>
                <label>Tags (comma-separated):</label>
                <input
                    type="text"
                    value={tagsString}
                    onChange={(e) => setTagsString(e.target.value)}
                    placeholder="e.g., summer, hoodie, casual"
                />
                </div>
                <div>
                <label>Image:</label>
                <input type="file" onChange={handleImageChange} />
                </div>
                <button type="submit" onClick={handleSubmit}>Update</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    </div>
  );
};

export default UpdateClothForm;
