import React from 'react'
import Select, { components, ValueContainerProps } from 'react-select'
import { useColor } from './../../Context/ColorModeContext';

type selectProps = {
  options: any;
  isMulti: boolean;
  handleChange?: any;
  name: string;
  value: Array<object>;
};

export const handleSelectAll = (data: any, e: any, options: any) => {
  if (e.action === "select-option" && e.option.id === "ALL") {
    return options
  } else if (e.action === "deselect-option" && e.option.id === "ALL") {
    return []
  } else if (e.action === "deselect-option") {
    return data.filter((o: any) => o.id !== "ALL")
  } else if (data.length === options.length - 1) {
    return data.filter((o: any) => o.id !== "ALL")
  } else {
    return data
  }
}

const Option = (props: any) => {
  return (
    <div>
      <components.Option {...props}>
        {props.isMulti && <input
          type="checkbox"
          className="form-check-input"
          checked={props.isSelected}
          onChange={() => null}
        />}{" "}
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

const ValueContainer = ({
  children,
  ...props
}: ValueContainerProps<any>) => {
  let [values, input] = children as any;

  if (Array.isArray(values)) {
    const plural = values.length === 1 ? "" : "s";
    if (values && values.some((o: any) => o.key === "ALL-ALL")) {
      values = `All ${values.length - 1} selected`;
    } else {
      values = `${values.length} item${plural} selected`;
    }
  }

  return (
    <components.ValueContainer {...props} className="select-val-section">
      {values}
      {input}
    </components.ValueContainer>
  );
};


const SelectField = (props: selectProps) => {
  const colorModeContext = useColor();

  return <Select className="f-width cp3-react-select" getOptionLabel={(option: any) => option.name}
    getOptionValue={(option: any) => option.id}
    options={props.options}
    isMulti={props.isMulti}
    hideSelectedOptions={false}
    name={props.name}
    closeMenuOnSelect={!props.isMulti}
    components={{
      Option, ValueContainer
    }}
    value={props.value}
    defaultValue={props.value}
    onChange={(data, e) => props.handleChange(data, e, props.name)}
    styles={colorModeContext.colorMode === 'light' ? LightStyles : DarkStyles}
  />
}


export default SelectField;
