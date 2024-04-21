import React from 'react';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

function ResultsDisplay({ data }) {
  const downloadLessonPlan = async () => {
    const lessonText = document.getElementById('content-to-download').innerText;
    try {
      const response = await fetch('http://localhost:5172/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: lessonText }),
      });
      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'LessonPlan.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
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
