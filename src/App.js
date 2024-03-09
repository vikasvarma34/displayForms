import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Surveyfile from './component/survey/Surveyfile';
import Home from './component/home/Home'; 
import SurveySubmit from './component/survey/SurveySubmit';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/survey" element={<Surveyfile />} />
      <Route path="/surveysubmit" element={<SurveySubmit />} />
    </Routes>
  </Router>
  );
}

export default App;