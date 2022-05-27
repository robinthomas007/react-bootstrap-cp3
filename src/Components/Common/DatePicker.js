import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import moment from 'moment';

const DateField = (props) => {
  const { disabled, readOnly, placeholder, showTimeSelect, selected } = props;

  const onChange = (date) => {
    console.log(date, "asdadadas")
    props.handleDateChange(moment(date).format('MM-DD-YYYY'))
  }

  return (
    <DatePicker
      {...props}
      dateFormat="MM-dd-yyyy"
      onChange={onChange}
      customInput={
        <CustomInput placeholder={placeholder} isreadOnly={readOnly} {...props} />
      }
      disabled={disabled}
      placeholderText={placeholder}
      showTimeSelect={showTimeSelect}
      showYearDropdown
      selected={selected ? new Date(selected) : null}
    />

  );
}


const CustomInput = props => {
  return (
    <div className="custom-date-picker">
      <input disabled={props.disabled} onClick={props.onClick} value={props.value} type="text" readOnly={props.isreadOnly} />
      <CalendarTodayIcon onClick={props.onClick} />
    </div>
  );
};


export default DateField;
