import React, { useState, useCallback } from 'react';
import axios from 'axios';
import ResultsDisplay from '../../ResultsDisplay'; // Ensure this is properly imported

function App() {
  const [topic, setTopic] = useState('');
  const [numStudents, setNumStudents] = useState('');
  const [duration, setDuration] = useState('20');
  const [responseData, setResponseData] = useState({
    overview: '',
    objectives: '',
    materials: '',
    activity: '',
    assessment: '',
  });

  const handleTopicChange = (event) => {
    setTopic(event.target.value);
  };

  const handleNumStudentsChange = (event) => {
    setNumStudents(event.target.value);
  };

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };

  const handleSubmit = useCallback(async (event) => {
    event.preventDefault();
    try {
      const chatGPTResponse = await axios.post('http://localhost:5172/generate-content', {
        topic,
        numStudents,
        duration,
      });
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
  }, [topic, numStudents, duration]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div id="topic">
          <input
            type="text"
            value={topic}
            onChange={handleTopicChange}
            placeholder="Enter topic here"
          />
        </div>
        <div id="num-students">
          <input
            type="text"
            value={numStudents}
            onChange={handleNumStudentsChange}
            placeholder="Enter number of students here"
          />
        </div>
        <div id="duration">
          <select value={duration} onChange={handleDurationChange}>
            <option value="20">Less than 20 minutes</option>
            <option value="60">20 minutes - 1 hour</option>
            <option value="120">1+ hours</option>
            <option value="180">3+ hours</option>
          </select>
        </div>
        <button type="submit" className="generate-button">Generate new plan</button>
      </form>
      <ResultsDisplay data={responseData} />
    </div>
  );
}

export default App;
