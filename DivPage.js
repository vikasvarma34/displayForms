import React from 'react';
import { Div } from '@aura-ui/react';

const DivPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '20px',
        backgroundColor: 'lightgray',
        height: '100vh',
      }}
    >
      <Div
        style={{
          padding: '20px',
          borderRadius: '5px',
          backgroundColor: 'lightblue',
        }}
      >
        Div 1
      </Div>
      <Div
        style={{
          padding: '20px',
          borderRadius: '5px',
          backgroundColor: 'lightgreen',
        }}
      >
        Div 2
      </Div>
      <Div
        style={{
          padding: '20px',
          borderRadius: '5px',
          backgroundColor: 'lightcoral',
        }}
      >
        Div 3
      </Div>
    </div>
  );
};

export default DivPage;
