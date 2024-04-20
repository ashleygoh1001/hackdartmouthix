// src/components/response_display.jsx
import React from 'react';

function ResponseDisplay({ response }) {
  return (
    <div id="response-display" className="mt-3">
      <textarea className="form-control" rows="5" value={response} readOnly />
    </div>
  );
}

export default ResponseDisplay;
