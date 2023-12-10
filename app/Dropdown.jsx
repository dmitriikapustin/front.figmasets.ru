import React, { useState } from 'react';

const Dropdown = ({ options, onSelect, label, def }) => {
  const [selectedOption, setSelectedOption] = useState(options[def]);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    onSelect(value);
  };

  return (
    <div className="flex flex-row gap-4 items-center">
      <p className='opacity-50'>{label}</p>
      <div className="dropdown w-fit pr-2">
        <select className="dropdown-select px-4 py-2" value={selectedOption} onChange={handleChange}>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className='h-full w-s block'/>
      </div>
    </div>
  );
};

export default Dropdown;