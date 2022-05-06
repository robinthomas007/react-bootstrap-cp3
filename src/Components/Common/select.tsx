import React from 'react'
import Select from 'react-select'

type selectProps = {
  options: any,
  isMulti: boolean,
  handleChange?: any,
  name: string
  value: Array<object>
  theme: string
}

const LightStyles = {
  control: (base: any, state: any) => ({
    ...base,
    boxShadow: "none",
    border: 'none',
    backgroundColor: '#F5F5F5'
  })
};

const DarkStyles = {
  control: (base: any, state: any) => ({
    ...base,
    boxShadow: "none",
    border: 'none',
    backgroundColor: '#333333',
    color: '#ffffff',
  }),
  menuList: (base: any) => ({
    ...base,
    backgroundColor: '#333333',
    color: '#ffffff',
  }),
  option: (base: any, state: any) => ({
    ...base,
    background: state.isFocused ? '#f5f5f5' : undefined,
    color: state.isFocused ? '#333333' : undefined,
  }),
};

const SelectField = (props: selectProps) => (
  <Select className="f-width cp3-react-select" getOptionLabel={(option: any) => option.name}
    getOptionValue={(option: any) => option.id}
    options={props.options}
    isMulti={props.isMulti}
    name={props.name}
    defaultValue={props.value}
    onChange={(data) => props.handleChange(data, props.name)}
    styles={props.theme === 'light' ? LightStyles : DarkStyles}
  />
)


export default SelectField
