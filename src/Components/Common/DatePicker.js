import React, { forwardRef } from 'react'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import moment from 'moment';

const DateField = (props) => {
  const { disabled, readOnly, placeholder, showTimeSelect, selected } = props;
  const ref = React.createRef()

  const onChange = (date) => {
    props.handleDateChange(moment(date).format('MM-DD-YYYY'))
  }

  return (
    <DatePicker
      {...props}
      dateFormat="MM-dd-yyyy"
      onChange={onChange}
      customInput={
        <CustomInput ref={ref} placeholder={placeholder} isreadOnly={readOnly} {...props} />
      }
      disabled={disabled}
      placeholderText={placeholder}
      showTimeSelect={showTimeSelect}
      showYearDropdown
      selected={selected ? new Date(selected) : null}
    />

  );
}


const CustomInput = forwardRef((props, ref) => {
  return (
    <div className="custom-date-picker">
      <input ref={ref} disabled={props.disabled} onClick={props.onClick} onChange={props.onChange} value={props.value} type="text" readOnly={props.isreadOnly} />
      <CalendarTodayIcon onClick={props.onClick} />
    </div>
  );
})


export default DateField;
