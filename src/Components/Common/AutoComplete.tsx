import React from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import SearchIcon from "@mui/icons-material/Search";

const config = {
  disabled: false,
  dropup: false,
  flip: false,
  highlightOnlyResult: true,
  minLength: 3,
  open: undefined,
};

type AutoCompleteProps = {
  onInputChange: any;
  options: Array<object>;
  onChange: any;
};

const AutoComplete = (props: AutoCompleteProps) => (
  <div className="auto-complete-comp">
    <SearchIcon />
    <Typeahead
      {...config}
      clearButton
      id="auto-complete"
      labelKey="policyName"
      onChange={(s) => props.onChange(s)}
      options={props.options}
      placeholder="Start your search here"
    />
  </div>
);

export default AutoComplete;
