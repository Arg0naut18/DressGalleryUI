import React, { useEffect, useState } from 'react';
import DressForm from './DressForm';
import DressUpdateForm from './DressUpdateForm'
import { FaPencilAlt, FaTrash } from 'react-icons/fa';



const Gallery = () => {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [clothToEdit, setClothToEdit] = useState(null);

  const userId = localStorage.getItem("userId");

  const [filters, setFilters] = useState({
    searchTerm: '',
    selectedTags: [],
    ageFilter: '',
    colorFilter: ''
  });

  const fetchClothes = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if(filters.searchTerm && filters.searchTerm!=='') params.append('name', filters.searchTerm.toLowerCase());
      if(filters.colorFilter && filters.colorFilter!=='') params.append('color', filters.colorFilter.toLowerCase());
      if (filters.ageFilter) params.append('purchased_year', filters.ageFilter);
      if (filters.brandFilter) params.append('brand', filters.brandFilter.toLowerCase());
      if (filters.selectedTags.length>0) {
        let tags = filters.selectedTags.split(',');
        let lowerCaseTags = "";
        tags.map((tag) => {
          lowerCaseTags+=(tag.toLowerCase()+',')
        })
        params.append('tags', lowerCaseTags.substring(0, lowerCaseTags.length-1));
      }

      let finalUrl = `${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/outfit/view?${params.toString()}`;
      console.log(finalUrl);

      const response = await fetch(finalUrl, {
        headers: {
          'X-User-ID': userId
      }});
      if (!response.ok) {
        throw new Error('Failed to fetch clothes');
      }
      const data = await response.json();
      setClothes(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClothes();
  }, [filters]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleTagChange = (event) => {
    setSelectedTags(event.target.value);
  };

  const handleAgeChange = (event) => {
    setAgeFilter(event.target.value);
  };

  const handleColorChange = (event) => {
    setColorFilter(event.target.value);
  };

  const handleBrandChange = (event) => {
    setBrandFilter(event.target.value);
  };

  const applyFilters = () => {
    setFilters({
      searchTerm,
      selectedTags,
      ageFilter,
      colorFilter,
      brandFilter
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedTags('');
    setAgeFilter('');
    setColorFilter('');
    setBrandFilter('');
    setFilters({
      searchTerm: '',
      selectedTags: '',
      ageFilter: '',
      colorFilter: '',
      brandFilter: ''
    });
  };

  const handleFormSave = () => {
    fetchClothes(); // Refresh the gallery after saving
    setIsFormOpen(false);
    setIsUpdateMode(false);
    setClothToEdit(null);
  };

  const handleOpenForm = () => {
    setIsFormOpen(true);
    setIsUpdateMode(false);
    setClothToEdit(null);
  };

  const handleUpdate = (cloth) => {
    setIsFormOpen(true);
    setIsUpdateMode(true);
    setClothToEdit(cloth); // Set the cloth to be edited
  };

  const handleDelete = async (clothId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this outfit from the wardrobe?");
    if (!confirmDelete) {
      return;
    }
    const response = await fetch(`${process.env.REACT_APP_BACKEND_HOST}:${process.env.REACT_APP_BACKEND_PORT}/outfit/delete/${clothId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': userId
      }
    });

    if (response.ok) {
      fetchClothes();
    } else {
      alert('Failed to delete the item.');
    }
  };

  return (
    <div className="clothes-catalog">
      <h1 className='title'>Outfit Wardrobe</h1>
      <div className="filters">
        Name:
        <input
          type="text"
          placeholder="Search by name"
          className='name-search'
          value={searchTerm}
          onChange={handleSearchChange}
        />
        Year Purchased:
        <input
          type="number"
          placeholder="Year"
          className='age-search'
          value={ageFilter}
          onChange={handleAgeChange}
        />
        Color:
        <input
          type="text"
          placeholder="Color"
          className='color-search'
          value={colorFilter}
          onChange={handleColorChange}
        />
        Brand:
        <input
          type="text"
          placeholder="Brand"
          className='brand-search'
          value={brandFilter}
          onChange={handleBrandChange}
        />
        Tags:
        <div className="tags">
        <input
          type="text"
          placeholder="Tags separated by ,"
          className='tags-search'
          value={selectedTags}
          onChange={handleTagChange}
        />
        </div>
        <button onClick={applyFilters}>Apply Filters</button>
        <button onClick={resetFilters}>Reset Filters</button>
      </div>
      <div className="clothes-grid">
        {clothes.map((item) => (
          <div key={item._id} className="clothes-item">
            <img src={`data:image/jpeg;base64,${item.image}`} alt={item.name} />
            <h2>{item.name}</h2>
            <p>Color: {item.color}</p>
            {item.brand && <p>Brand: {item.brand}</p>}
            {item.purchased_year && <p>Year Purchased: {item.purchased_year}</p>}
            {item.tags?.slice(0, 3).map((tag) => (
              <p key={tag}>{tag}</p>
            ))}
            <button className="update-button" onClick={() => handleUpdate(item)}><FaPencilAlt /></button>
            <button className="delete-button" onClick={() => handleDelete(item._id)}><FaTrash /></button>
          </div>
        ))}
      </div>
      <button className="floating-button" onClick={handleOpenForm}>+</button>
      {isFormOpen && (
        isUpdateMode ? (
          <DressUpdateForm
            onClose={() => setIsFormOpen(false)}
            onSave={handleFormSave}
            cloth={clothToEdit} // Pass the cloth to be edited
          />
        ) : (
          <DressForm
            onClose={() => setIsFormOpen(false)}
            onSave={handleFormSave}
          />
        )
      )}
    </div>
  );
};

export default Gallery;
