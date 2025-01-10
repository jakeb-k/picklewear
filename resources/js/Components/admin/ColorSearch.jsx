import React, { useState } from 'react';
import tinycolor from 'tinycolor2';

const ColourSearch = () => {
  const [query, setQuery] = useState('');
  const [filteredColours, setFilteredColours] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    // Check if the input is a valid colour name
    if (value) {
      const isValid = tinycolor(value).isValid();
      const suggestions = isValid ? [value] : [];
      setFilteredColours(suggestions);
    } else {
      setFilteredColours([]);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search colour names..."
        style={{ marginBottom: '10px', padding: '5px', width: '200px' }}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {filteredColours.map((colour, index) => (
          <div
            key={index}
            style={{
              background: tinycolor(colour).toHexString(),
              width: '50px',
              height: '50px',
              border: '1px solid #000',
            }}
            title={colour}
          />
        ))}
      </div>
    </div>
  );
};

export default ColourSearch;
