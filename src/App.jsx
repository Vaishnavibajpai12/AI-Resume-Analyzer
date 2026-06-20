import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
function App() {

  const [resume, setResume] = useState("");
  const [score, setScore] = useState("");
  const [missingSkills, setMissingSkills] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [matchScore, setMatchScore] = useState("");
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

const handleFileUpload = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  try {
    const arrayBuffer = await file.arrayBuffer();

   const pdf = await pdfjsLib.getDocument({
  data: arrayBuffer,
}).promise;

    let extractedText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);

      const content = await page.getTextContent();

      extractedText += content.items
        .map((item) => item.str)
        .join(" ");
    }

    alert("PDF Text Extracted Successfully");

    setResume(extractedText);
} catch (error) {
    console.error(error);
    alert(error.message);
}
};
const analyzeResume = () => {
  console.log("Resume State =", resume);
  const text = resume.toLowerCase();

  const skills = [
    "python",
    "java",
    "react",
    "github",
    "project"
  ];

  let ats = 0;
  let missing = [];

  skills.forEach((skill) => {
    if (text.includes(skill)) {
      ats += 20;
    } else {
      missing.push(skill);
    }
  });

  setScore(ats);
  setMissingSkills(missing);
const jdText = jobDescription.toLowerCase();

let matched = 0;

skills.forEach((skill) => {
  if (
    text.includes(skill) &&
    jdText.includes(skill)
  ) {
    matched++;
  }
});

const percentage = Math.round(
  (matched / skills.length) * 100
);

setMatchScore(percentage);

  if (ats >= 80) {
    setFeedback("Excellent Resume");
  } else if (ats >= 60) {
    setFeedback("Good Resume");
  } else {
    setFeedback("Needs Improvement");
  }
};

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">
        AI Resume Analyzer
      </h1>
<div className="mb-3">
  <label className="form-label">
    Upload Resume PDF
  </label>

  <input
    type="file"
    accept=".pdf"
    className="form-control"
    onChange={handleFileUpload}
  />
</div>
      <textarea
        className="form-control"
        rows="12"
        placeholder="Paste your resume here..."
        value={resume}
        onChange={(e) => setResume(e.target.value)}
      />
<h3 className="mt-4">
  Job Description
</h3>

<textarea
  className="form-control"
  rows="8"
  placeholder="Paste Job Description Here..."
  value={jobDescription}
  onChange={(e) =>
    setJobDescription(e.target.value)
  }
/>
      <button
        className="btn btn-primary mt-3"
        onClick={analyzeResume}
      >
        Analyze Resume
      </button>

      {score !== "" && (
        <div className="alert alert-success mt-4">
          ATS Score: {score}/100
        </div>
      )}
     {matchScore !== "" && (
  <div className="alert alert-primary mt-3">
    Job Match Score: {matchScore}%
  </div>
)} 
      {feedback && (
  <div className="alert alert-info mt-3">
    {feedback}
  </div>
)}

{missingSkills.length > 0 && (
  <div className="alert alert-warning mt-3">
    <strong>Missing Skills:</strong>
    <ul>
      {missingSkills.map((skill, index) => (
        <li key={index}>{skill}</li>
      ))}
    </ul>
  </div>
)}
    </div>
  );
}

export default App;