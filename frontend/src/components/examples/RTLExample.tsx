import React from 'react';
import { useRTL } from '../../contexts/RTLContext';

const ExampleComponent: React.FC = () => {
  const { isRTL, direction, toggleRTL } = useRTL();

  return (
    <div dir={direction} className={isRTL ? 'rtl' : ''}>
      <h1>RTL Example Component</h1>
      <p>Current direction: {direction}</p>
      <p>RTL Enabled: {isRTL ? 'Yes' : 'No'}</p>
      <button onClick={toggleRTL}>
        Toggle RTL ({isRTL ? 'LTR' : 'RTL'})
      </button>
    </div>
  );
};

export default ExampleComponent;