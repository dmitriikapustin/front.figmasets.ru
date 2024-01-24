'use client'


const Checkbox = ({ label, isCheck, setIsCheck }) => {

  return (
    <div className="custom-checkbox">
      <label className={isCheck ? 'checked' : ''}>
        <input
          type="checkbox"
          checked={isCheck}
          onChange={() => {setIsCheck(!isCheck)}}
          className="custom-checkbox__input"
        />
        <span className="custom-checkbox__checkmark"></span>
        {label && <span className="custom-checkbox__label">{label}</span>}
      </label>
    </div>
  );
};

export default Checkbox;
