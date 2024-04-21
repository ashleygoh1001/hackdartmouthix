document.addEventListener('DOMContentLoaded', () => {
  async function fetchLessonPlan() {
    try {
      const response = await fetch('http://localhost:5172/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: 'Quantum Mechanics' }), // Example topic
      });
      const data = await response.json();

      document.getElementById('overview').innerHTML = data.overview;
      document.getElementById('lesson-structure').innerHTML = `<ul><li>${data.objectives}</li></ul>`;
      document.getElementById('content').innerHTML = `<ul><li>${data.materials}</li></ul>`;
      document.getElementById('additional-materials').innerHTML = data.activity;
      document.getElementById('resources').innerHTML = data.assessment;

      // Set up the download button
      const downloadButton = document.querySelector('button');
      downloadButton.addEventListener('click', downloadLessonPlan);
    } catch (error) {
      console.error('Failed to fetch lesson plan:', error);
    }
  }

  fetchLessonPlan();
});
