import React, { useCallback, useState } from 'react';
import axios from 'axios';
import SearchBar from './search_bar';
import ResultsDisplay from '../../ResultsDisplay'; // This should be a React component equivalent to handling the results.html structure
import customDebounce from '../services/debouncer'; // Verify the path

function App() {
  const [responseData, setResponseData] = useState({
    overview: '',
    objectives: '',
    materials: '',
    activity: '',
    assessment: '',
  });

  const fetchChatGPTResponse = async (query) => {
    console.log('Sending topic to learn:', query);
    try {
      const chatGPTResponse = await axios.post('http://localhost:5172/generate-content', {
        topic: query,
      });
      console.log('Received API Response:', chatGPTResponse.data);
      setResponseData(chatGPTResponse.data);
    } catch (error) {
      console.error('API Call Error:', error);
      setResponseData({
        overview: 'Failed to fetch response',
        objectives: 'Failed to fetch response',
        materials: 'Failed to fetch response',
        activity: 'Failed to fetch response',
        assessment: 'Failed to fetch response',
      });
    }
  };

  const debouncedFetch = useCallback(customDebounce(fetchChatGPTResponse, 500), [fetchChatGPTResponse]);

  return (
    <div>
      <SearchBar onSearchSubmit={debouncedFetch} />
      <ResultsDisplay data={responseData} />
    </div>
  );
}

export default App;
