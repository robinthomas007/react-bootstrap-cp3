import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const DateField = (props) => {
  const { disabled, readOnly, placeholder, showTimeSelect, selected } = props;
  return (
    <DatePicker
      {...props}
      dateFormat="MM-dd-yyyy"
      onChange={props.handleDateChange}
      customInput={
        <CustomInput placeholder={placeholder} isreadOnly={readOnly} {...props} />
      }
      disabled={disabled}
      placeholderText={placeholder}
      showTimeSelect={showTimeSelect}
      showYearDropdown
      selected={selected ? new Date(selected) : null}
      isClearable={true}
    />

  );
}


const CustomInput = props => {
  return (
    <div className="custom-date-picker">
      <input onClick={props.onClick} value={props.value} type="text" readOnly={props.isreadOnly} />
      {!props.value && (
        <CalendarTodayIcon onClick={props.onClick} />
      )}
    </div>
  );
};


export default DateField;
