import React, { useCallback, useState } from 'react';
import axios from 'axios';
import SearchBar from './search_bar';
import ResponseDisplay from './response_display';
import customDebounce from '../services/debouncer'; // Ensure path is correct

function App() {
  const [response, setResponse] = useState('');

  const fetchChatGPTResponse = async (query) => {
    console.log('Topic To Learn:', query); // Inside SearchBar onFormSubmit
    try {
      const chatGPTResponse = await axios.post('http://localhost:5172/generate-content', { // Added full URL for clarity
        topic: query,
        detailLevel: 'high',
      });
      setResponse(chatGPTResponse.data.lessonContent);
      console.log('API Response:', chatGPTResponse.data); // Inside fetchChatGPTResponse after API call
    } catch (error) {
      setResponse('Failed to fetch response');
      console.error('API Call Error:', error); // Inside catch block in fetchChatGPTResponse
    }
  };

  const debouncedFetch = useCallback(customDebounce(fetchChatGPTResponse, 500), []);

  return (
    <div>
      <SearchBar onSearchSubmit={debouncedFetch} />
      <ResponseDisplay response={response} />
    </div>
  );
}

export default App;
