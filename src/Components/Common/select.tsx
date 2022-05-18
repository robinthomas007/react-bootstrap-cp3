import React from "react";
import Select from "react-select";
import { useColor } from "./../../Context/ColorModeContext";

type selectProps = {
  options: any;
  isMulti: boolean;
  handleChange?: any;
  name: string;
  value: Array<object>;
};

const LightStyles = {
  control: (base: any, state: any) => ({
    ...base,
    boxShadow: "none",
    border: "none",
    backgroundColor: "#F5F5F5",
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

  return (
    <Select
      {...props}
      className="f-width cp3-react-select"
      styles={colorModeContext.colorMode === "light" ? LightStyles : DarkStyles}
    />
  );
};

export default SelectField;
