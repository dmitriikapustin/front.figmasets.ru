'use client'

import React, { useState } from 'react';

const Checkbox = ({ label, onCheck }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    onCheck(!isChecked)
    setIsChecked(!isChecked);
  };

  return (
    <div className="custom-checkbox">
      <label className={isChecked ? 'checked' : ''}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="custom-checkbox__input"
        />
        <span className="custom-checkbox__checkmark"></span>
        {label && <span className="custom-checkbox__label">{label}</span>}
      </label>
    </div>
  );
};

export default Checkbox;
