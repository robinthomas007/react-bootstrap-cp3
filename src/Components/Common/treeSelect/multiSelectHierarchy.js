/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import { Form } from 'react-bootstrap';
import './multiSelectHierarchy.css';
import Dropdown from 'react-bootstrap/Dropdown';
import _ from 'lodash';
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import { getApi } from "./../Utils";


export default function MultiSelectHierarchy({
  handleChangeCheckbox,
  type,
  isMultiSelect,
  isAdmin,
  releasingLabels,
  selectedLabelIds,
}) {
  const [companyList, setcompanyList] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedList, setSelectedList] = useState([]);

  const didMountRef = useRef(false);

  const addSelectedList = (e, data) => {
    if (e.target.checked) {
      if (isMultiSelect) setSelectedList([...selectedList, data]);
      else setSelectedList([data]);
    } else {
      const modificedList = selectedList.filter(item => item.id !== data.id);
      setSelectedList(modificedList);
    }
  };

  useEffect(() => {
    if (didMountRef.current) {
      handleChangeCheckbox(selectedList);
    } else {
      didMountRef.current = true;
    }
  }, [selectedList]);

  useEffect(() => {
    if (releasingLabels && releasingLabels.length > 0) {
      setcompanyList(releasingLabels);
    }
  }, [releasingLabels]);

  useEffect(() => {
    console.log(selectedLabelIds, "selectedLabelIdsselectedLabelIds")
    if (selectedList.length !== selectedLabelIds.length) {
      setSelectedList(selectedLabelIds);
    }
  }, [selectedLabelIds]);

  useEffect(() => {
    if (searchInput.length >= 3) {
      setLoading(true);
      getApi({ SearchTerm: searchInput }, "Label/LabelSearch")
        .then((res) => {
          setLoading(false)
          setcompanyList(res.result);
        })
        .catch((error) => {
          console.log("error feching data", error);
          setLoading(false)
        });
    } else {
      if (searchInput.length === 0) {
        if (releasingLabels && releasingLabels.length > 0) setcompanyList(releasingLabels);
      }
    }
  }, [searchInput]);

  const checkIfIdPresent = id => {
    let lablelIds = _.map(selectedList, 'id');
    if (lablelIds.includes(id)) return true;
    else return false;
  };

  const renderCompanies = companyList => {
    return (
      <div>
        {isAdmin && <span className="sub-title">Select Options from Search Results</span>}
        {companyList.map((company, i) => {
          const { companyId, companyName } = company;
          const hasComapny = companyId ? true : false;
          return (
            <div className="company-wrapper" key={i}>
              {companyId && (
                <div className="inside-wrapper">
                  <label className="custom-checkbox msh-checkbox">
                    <input
                      id="company"
                      className="form-check-input"
                      type="checkbox"
                      name={companyId}
                      checked={checkIfIdPresent(String(companyId))}
                      onChange={e =>
                        addSelectedList(e, { id: String(companyId), name: companyName })
                      }
                    />
                    <span>{companyName} (Company)</span>
                  </label>
                </div>
              )}
              {company.divisionList &&
                company.divisionList.length > 0 &&
                renderDivisions(company.divisionList, hasComapny)}
            </div>
          );
        })}
      </div>
    );
  };

  const renderDivisions = (divisionList, hasComapny) => {
    return (
      <div className={`${!hasComapny ? 'rmvPadDivisonLabel' : ''} divison-wrapper`}>
        {divisionList.map((division, i) => {
          const { divisionId, divisionName } = division;
          const hasDivision = divisionId ? true : false;
          return (
            <div key={i}>
              {divisionId && (
                <div className="inside-wrapper ">
                  {hasComapny && (
                    <div className="tree">
                      <div className={`${i === 0 ? 'vl' : 'vl ex-ht'}`}></div>
                      <div className="hl"></div>
                    </div>
                  )}
                  <label className="custom-checkbox msh-checkbox">
                    <input
                      id="division"
                      className="form-check-input"
                      type="checkbox"
                      name={divisionId}
                      checked={checkIfIdPresent(String(divisionId))}
                      onChange={e =>
                        addSelectedList(e, { id: String(divisionId), name: divisionName })
                      }
                    />
                    <span>{divisionName} (Division)</span>
                  </label>
                </div>
              )}
              {division.labelList.length > 0 && renderLabels(division.labelList, hasDivision)}
            </div>
          );
        })}
      </div>
    );
  };

  const renderLabels = (labelList, hasDivision) => {
    return (
      <div className={`${!hasDivision ? 'rmvPadDivisonLabel' : ''} label-wrapper`}>
        {labelList.map((label, i) => {
          const { labelId, labelName } = label;
          return (
            <div key={i}>
              {hasDivision && (
                <div className="tree">
                  <div className={`${i === 0 ? 'vl' : 'vl ex-ht'}`}></div>
                  <div className="hl"></div>
                </div>
              )}
              <label className="custom-checkbox msh-checkbox">
                <input
                  id="label"
                  className="form-check-input"
                  type="checkbox"
                  name={labelId}
                  checked={checkIfIdPresent(String(labelId))}
                  onChange={e => addSelectedList(e, { id: String(labelId), name: labelName })}
                />
                <span>{labelName} (Label)</span>
              </label>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="ms-dropdown-wrapper">
      <Dropdown className={`d-inline ${type}`} autoclose="inside">
        <Dropdown.Toggle id="dropdown-autoclose-inside" className="ms-dropdown-toggle">
          {selectedList.length > 1
            ? selectedList.length + ' Selected'
            : selectedList.length === 1
              ? selectedList[0].name
              : 'Select Options'}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <div className="msh-wrapper">
            <div className="main-title">Companies, Divisions & Labels</div>
            {isAdmin && (
              <div className="search-input">
                <Form.Control
                  type="text"
                  name="searchInput"
                  className="form-control requiredInput"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                />
                <SearchIcon className='search-icon' />
              </div>
            )}
            <div className="msh-content">
              {loading && <span className='d-flex justify-content-center'>
                <CircularProgress size="25px" style={{ color: "#F57F17" }} />
              </span>}
              <h1>{_.values(companyList).every(_.isEmpty)}</h1>

              {companyList.length > 0 && renderCompanies(companyList)}
            </div>

            <div className="invalid-tooltip">Label is required.</div>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}
