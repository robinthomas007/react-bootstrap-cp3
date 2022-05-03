import React from 'react'
import Select from 'react-select'

type selectProps = {
  options: any,
  isMulti: boolean,
  handleChange?: any,
  name: string
  value: Array<object>
}

const SelectField = (props: selectProps) => (
  <Select className="f-width" getOptionLabel={(option: any) => option.name}
    getOptionValue={(option: any) => option.id}
    options={props.options}
    isMulti={props.isMulti}
    name={props.name}
    defaultValue={props.value}
    onChange={(data) => props.handleChange(data, props.name)} />
)

export default SelectField
