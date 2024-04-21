import React, { useState } from 'react';

function SearchBar({ onSearchSubmit }) {
  const [term, setTerm] = useState('');

  const onFormSubmit = (event) => {
    event.preventDefault();
    onSearchSubmit(term);
  };

  return (
    <form onSubmit={onFormSubmit} className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Enter a topic to learn about..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
      />
      <div className="input-group-append">
        <button className="btn btn-outline-secondary" type="submit">Submit</button>
      </div>
    </form>
  );
}

export default SearchBar;
