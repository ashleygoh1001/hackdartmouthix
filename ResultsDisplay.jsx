import React from 'react';

function ResultsDisplay({ data }) {
  const downloadLessonPlan = () => {
    const element = document.createElement("a");
    const file = new Blob([document.getElementById('content-to-download').innerText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "LessonPlan.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <main className="final-lesson-plan" id="content-to-download">
      <div className="results-title">
        <h1>Lesson plan:</h1>
        <div className="lesson-plan">
          <p><strong>Overview:</strong> {data.overview}</p>
          <p><strong>Objectives:</strong> {data.objectives}</p>
          <p><strong>Materials Needed:</strong> {data.materials}</p>
          <p><strong>Activities:</strong> {data.activity}</p>
          <p><strong>Assessment Methods:</strong> {data.assessment}</p>
        </div>
        <button type="button" onClick={downloadLessonPlan}>Download as PDF</button>
      </div>
    </main>
  );
}

export default ResultsDisplay;
