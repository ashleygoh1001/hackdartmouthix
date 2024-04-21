import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function ResultsDisplay({ data }) {
  function downloadLessonPlan() {
    const content = document.getElementById('content-to-download');

    html2canvas(content, {
      scale: 3, // Adjust scale for better quality
      useCORS: true, // To handle cross-origin images
      onclone: (clonedDoc) => {
        const clonedHead = clonedDoc.head || clonedDoc.querySelector('head');
        const styleEl = clonedDoc.createElement('style');

        // Ensure that the head element exists in the clone
        if (clonedHead) {
          styleEl.textContent = `
          @media screen { 
            body, html {
              display: block;
              height: 100%;
              margin: 0;
              padding: 0;
              font-family: 'Montserrat', sans-serif;
              background: #fff; /* Assuming a white background */
              color: #333; /* Primary text color */
            }
            
            header {
              padding: 20px;
              text-align: center;
              background: #eee; /* Header background */
            }
            
            .logo h1 {
              margin: 0;
              font-size: 1.5em;
            }
            
            nav a {
              margin: 0 10px;
              text-decoration: none;
              color: #333;
            }
            
            nav a.selected {
              font-weight: bold;
            }
            
            main {
              padding: 40px;
              box-sizing: border-box;
            }
            
            .final-lesson-plan .results-title {
              margin-bottom: 20px;
            }
            
            .final-lesson-plan .results-title h1,
            .final-lesson-plan .results-title h3 {
              margin: 10px 0;
            }
            
            .final-lesson-plan .heading {
              background-color: #f4f4f4;
              border-radius: 8px;
              padding: 20px;
              margin: 20px auto;
              width: 90%;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1); /* subtle shadow for depth */
            }
            
            button {
              background: #0084ff;
              color: #fff;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
              font-size: 1em;
            }
            
            button:hover {
              background: #005299;
            }
            
            footer {
              background: #eee;
              padding: 20px;
              text-align: center;
              position: absolute;
              bottom: 0;
              width: 100%;
            }
            
           }`;
          // Replace '...' with actual screen styles
          clonedHead.appendChild(styleEl);
        }
      },
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const canvasRatio = canvasWidth / canvasHeight;
      const pdfRatio = pdfWidth / pdfHeight;

      let finalWidth, finalHeight;
      if (canvasRatio > pdfRatio) {
        finalWidth = pdfWidth;
        finalHeight = pdfWidth / canvasRatio;
      } else {
        finalHeight = pdfHeight;
        finalWidth = pdfHeight * canvasRatio;
      }

      pdf.addImage(imgData, 'PNG', 0, 0, finalWidth, finalHeight);
      pdf.save('download.pdf');
    });
  }

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
