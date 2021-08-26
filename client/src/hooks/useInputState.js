import { useState } from 'react';

const useInputState = (init) => {
  const initialState = init || '';
  const [value, setValue] = useState(initialState);

  const handleChange = (e) => setValue(e.target.value);
  const handleReset = () => setValue(initialState);
  
  return { value, handleChange, handleReset };
};

export default useInputState;
