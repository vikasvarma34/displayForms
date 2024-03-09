import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Container } from 'react-bootstrap';
import './Survey.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosService';

const Surveyfile = () => {
  const [survey, setSurvey] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurveyData = async () => {
      try {
        const response = await axiosInstance.get('forms/65ea2943d830e61354341072'); 
        const surveyData = response.data;
        const initialSurvey = {
          title: surveyData.formName,
          formId: surveyData._id,
          description: surveyData.description,
          questions: mapQuestions(surveyData.questions),
        };
        setSurvey(initialSurvey);
      } catch (error) {
        console.error('Failed to fetch survey data:', error);
      }
    };

    fetchSurveyData();
  }, []);

  const mapQuestions = (questionData) => {
    return questionData
      .sort((a, b) => a.order - b.order)
      .map((question) => ({
        id: question._id,
        questionText: question.questionText,
        type: question.type,
        order: question.order,
        options: question.options ? question.options.map((option, index) => ({
          value: index + 1,
          text: option.text,
          jump: option.jump,
          jumpTo: option.jumpTo,
        })) : [],
        selectedOption: [],
        textAnswer: '',
      }));
  };

  const handleOptionSelect = (optionValue, currentQuestion) => {
    const updatedQuestions = survey.questions.map((question) => {
      if (question.id === currentQuestion.id) {
        if (currentQuestion.type === 'single-choice') {
          return {
            ...question,
            selectedOption: [optionValue],
          };
        } else if (currentQuestion.type === 'multiple-choice') {
          const isOptionSelected = question.selectedOption.includes(optionValue);
          return {
            ...question,
            selectedOption: isOptionSelected
              ? question.selectedOption.filter((val) => val !== optionValue)
              : [...question.selectedOption, optionValue],
          };
        }
      }
      return question;
    });

    setSurvey((prevSurvey) => ({
      ...prevSurvey,
      questions: updatedQuestions,
    }));
  };

  const handleTextChange = (e, currentQuestion) => {
    const text = e.target.value;
    const updatedQuestions = survey.questions.map((question) => {
      if (question.id === currentQuestion.id) {
        return {
          ...question,
          textAnswer: text,
        };
      }
      return question;
    });

    setSurvey((prevSurvey) => ({
      ...prevSurvey,
      questions: updatedQuestions,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    //  setSubmissionSuccess(true);
    // navigate('/surveysubmit');
  };


  const handleNextQuestion = () => {
    const currentQuestion = survey.questions[currentQuestionIndex];
    const selectedOption = currentQuestion.options.find(option => currentQuestion.selectedOption.includes(option.value));

    if (selectedOption && selectedOption.jump) {
      if (selectedOption.jumpTo === 0) {

        handleSurveySubmit();
        return;
      } else {
        const jumpToQuestionIndex = survey.questions.findIndex(question => question.order === selectedOption.jumpTo);
        if (jumpToQuestionIndex !== -1) {
          setCurrentQuestionIndex(jumpToQuestionIndex);
          return;
        }
      }
    }

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < survey.questions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      // Logic to handle the end of the survey
    }
  };


  // const handleSurveySubmit = () => {
  //   const formId = survey.formId;
  //   const answeredQuestions = survey.questions.filter(q =>
  //     q.selectedOption.length > 0 || q.textAnswer.trim() !== ''
  //   );
  //   const responses = answeredQuestions.map((q) => {
  //     let answer;
  //     if (q.type === 'single-choice') {
  //       answer = q.selectedOption[0];
  //     } else if (q.type === 'multiple-choice') {
  //       answer = [...q.selectedOption].sort((a, b) => a - b);
  //     } else if (q.type === 'text') {
  //       answer = q.textAnswer;
  //     }
  //     return {
  //       questionId: q.id,
  //       questionOrder: q.order,
  //       answer: answer,
  //       metadata: {
  //         answeredAt: new Date(),
  //       }
  //     };
  //   });
  //   const surveyResponse = {
  //     formId: formId,
  //     responses: responses,
  //     timestamps: true,
  //   };
  //   console.log('Formatted Survey Response:', surveyResponse);
  //   setSubmissionSuccess(true);
  //   // window.alert('Form successfully submitted!');
  //   navigate('/surveysubmit', { replace: true });
  // };

  const handleSurveySubmit = async () => {
    const formId = survey.formId;
    const answeredQuestions = survey.questions.filter(q =>
      q.selectedOption.length > 0 || q.textAnswer.trim() !== ''
    );
    const responses = answeredQuestions.map((q) => {
      let answer;
      if (q.type === 'single-choice') {
        answer = q.selectedOption[0];
      } else if (q.type === 'multiple-choice') {
        answer = [...q.selectedOption].sort((a, b) => a - b);
      } else if (q.type === 'text') {
        answer = q.textAnswer;
      }
      return {
        questionId: q.id,
        questionOrder: q.order,
        answer: answer,
        metadata: {
          answeredAt: new Date(),
        }
      };
    });
    const surveyResponse = {
      formId: formId,
      responses: responses,
      timestamps: true,
    };
  
    try {
      const response = await fetch('http://localhost:8080/response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyResponse),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const responseData = await response.json();
      console.log('Server Response:', responseData);
      setSubmissionSuccess(true);
      navigate('/surveysubmit', { replace: true });
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      // Handle the error according to your application's needs, e.g., show an error message to the user
    }
  };

  if (!survey) {
    return <div>Loading...</div>;
  }

  const currentQuestion = survey.questions[currentQuestionIndex];
  const isNextQuestionButtonEnabled = currentQuestion.type === 'text' ? currentQuestion.textAnswer.trim() !== '' : currentQuestion.isOptional || currentQuestion.selectedOption.length > 0;

  return (
    <Container className="survey-container">
      {currentQuestion && (
        <Form onSubmit={handleFormSubmit}>
          <h3>{currentQuestion.questionText}</h3>
          {currentQuestion.type === 'text' ? (
            <Form.Control
              type="text"
              value={currentQuestion.textAnswer}
              onChange={(e) => handleTextChange(e, currentQuestion)}
              placeholder="Enter your answer here" 
            />
          ) : currentQuestion.options.map((option, index) => (
            <Form.Check
              type={currentQuestion.type === 'single-choice' ? 'radio' : 'checkbox'}
              id={`${currentQuestion.id}-${index}`}
              key={index}
              name={currentQuestion.type === 'single-choice' ? `question-${currentQuestion.id}` : undefined}
              label={option.text}
              onChange={() => handleOptionSelect(option.value, currentQuestion)}
              checked={currentQuestion.selectedOption.includes(option.value)}
            />
          ))}
          <div className="navigation-buttons">
            {currentQuestionIndex < survey.questions.length - 1 ? (
              <Button onClick={handleNextQuestion} disabled={!isNextQuestionButtonEnabled || submissionSuccess}>Next Question</Button>
            ) : (
              <Button onClick={handleSurveySubmit} disabled={!isNextQuestionButtonEnabled || submissionSuccess}>Submit</Button>
            )}
          </div>
        </Form>
      )}
    </Container>
  );
};

export default Surveyfile;
