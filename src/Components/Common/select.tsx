import React from 'react'
import Select, { components } from 'react-select'
import { useColor } from './../../Context/ColorModeContext';

type selectProps = {
  options: any;
  isMulti: boolean;
  handleChange?: any;
  name: string;
  value: Array<object>;
};

const Option = (props: any) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          className="custom-check-box"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

const LightStyles = {
  control: (base: any, state: any) => ({
    ...base,
    boxShadow: "none",
    border: "none",
    backgroundColor: "#F5F5F5",
  }),
  option: (base: any, state: any) => ({
    ...base,
    background: state.isFocused ? "#f5f5f5" : '#F5F5F5',
    color: state.isFocused ? "#333333" : undefined,
  }),
};

const DarkStyles = {
  control: (base: any, state: any) => ({
    ...base,
    boxShadow: "none",
    border: "none",
    backgroundColor: "#333333",
    color: "#ffffff",
  }),
  menuList: (base: any) => ({
    ...base,
    backgroundColor: "#333333",
    color: "#ffffff",
  }),
  option: (base: any, state: any) => ({
    ...base,
    background: state.isFocused ? "#f5f5f5" : undefined,
    color: state.isFocused ? "#333333" : undefined,
  }),
};

const SelectField = (props: selectProps) => {
  const colorModeContext = useColor();

  return <Select className="f-width cp3-react-select" getOptionLabel={(option: any) => option.name}
    getOptionValue={(option: any) => option.id}
    options={props.options}
    isMulti={props.isMulti}
    name={props.name}
    closeMenuOnSelect={false}
    components={{
      Option
    }}
    value={props.value}
    defaultValue={props.value}
    onChange={(data) => props.handleChange(data, props.name)}
    styles={colorModeContext.colorMode === 'light' ? LightStyles : DarkStyles}
  />
}


export default SelectField;
