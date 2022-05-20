import React, { useEffect, useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import AutoComplete from "../Common/AutoComplete";
import SelectField from "../Common/select";
import axios from "axios";
import Button from "../Common/button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Loader from "./../Common/loader";
import "./policy.css";
import { BASE_URL } from "../../App";
import getCookie from "../Common/cookie";
import jwt_decode from "jwt-decode";
import CloseIcon from '@mui/icons-material/Close';
import { PLATFORM_LIST, DURATIONS_LIST } from './../Common/staticDatas'
import { handleSelectAll } from "../Common/select";
import { toast } from 'react-toastify';
import moment from 'moment';

export default function Policy() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadData, setLoadData] = useState(false)
  const defaultPolicy = {
    policyName: "",
    platform: [],
    action: "",
    duration: "",
    date: "",
    exceptions: []
  };
  const [policy, setPolicy] = useState(defaultPolicy);
  const defaultException = {
    platform: [],
    action: "",
    duration: "",
    date: "",
  }
  const [policyException, setPolicyException] = useState([]);


  useEffect(() => {
    axios
      .get(BASE_URL + "BlockPolicy/GetBlockPolicy", {
        headers: {
          cp3_auth: getCookie("cp3_auth"),
        },
      })
      .then((res) => {
        setOptions(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [loadData]);

  const getUsername = () => {
    try {
      const token = getCookie("cp3_auth");
      let user = jwt_decode(token);
      return user.name;
    } catch (err) {
      console.log("Error getting Token", err);
    }
  };

  const onChange = (optionArray) => {
    const [option] = optionArray;
    if (option) {
      const platformsList = option.platform.split(",");
      setPolicy({
        ...option,
        policyName: option.policyName,
        platform: PLATFORM_LIST.filter((p) =>
          platformsList.includes(p.id)
        ),
        duration: DURATIONS_LIST.filter((duration) =>
          option.duration.includes(duration.id)
        )[0]
      });

      if (option.exceptions && option.exceptions.length > 0) {
        const exceptionDetails = []
        option.exceptions.forEach(element => {
          const exceptionPlatformsList = element.platform.split(",");
          const obj = {
            ...element,
            platform: PLATFORM_LIST.filter((p) =>
              exceptionPlatformsList.includes(p.id)
            ),
            duration: DURATIONS_LIST.filter((duration) =>
              element.duration.includes(duration.id)
            )[0]
          }
          exceptionDetails.push(obj)
        });
        setPolicyException(exceptionDetails);
      }
    } else {
      setPolicy(defaultPolicy);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    const config = {
      headers: {
        cp3_auth: getCookie("cp3_auth"),
      },
    };
    const exception = []

    policyException.forEach((exec) => {
      exception.push({
        ...exec,
        platform: exec.platform ? exec.platform.map((p) => p.id).join(",") : '',
        duration: exec.duration ? exec.duration.id : ''
      })
    })
    const data = {
      ...policy,
      platform: policy.platform ? policy.platform.map((p) => p.id).join(",") : '',
      duration: policy.duration ? policy.duration.id : '',
      exceptions: exception,
      username: getUsername(),
    };

    if (policy.blockPolicyId) {
      axios
        .put(BASE_URL + "BlockPolicy/UpdateBlockPolicy", data, config)
        .then(() => {
          toast.success('Policy Saved!', {
            autoClose: 5000,
            closeOnClick: true,
          });
          setLoadData(loadData => !loadData);
        })
        .catch((err) => {
          console.log("error feching data", err);
        })
        .finally(() => setLoading(false));
    } else {
      axios
        .post(BASE_URL + "BlockPolicy/AddBlockPolicy", data, config)
        .then(() => {
          toast.success('Policy Saved!', {
            autoClose: 5000,
            closeOnClick: true,
          });
          setLoadData(loadData => !loadData);
        })
        .catch((err) => {
          console.log("error feching data", err);
        })
        .finally(() => setLoading(false));
    }
  };

  const createExceptionRow = () => {
    setPolicyException([...policyException, defaultException])
  }

  const removeException = (index) => {
    let newArr = [...policyException]
    newArr.splice(index, 1);
    setPolicyException(newArr)
  }

  const destructurePolicyPlatform = (platform) => {
    platform = platform.filter((p) => p.id !== 'ALL')
    for (let i = 0; i < platform.length; i++) {
      platform[i] = platform[i].id.charAt(0).toUpperCase() + platform[i].id.slice(1);
    }
    return platform ? platform.join(",") : ''
  }

  const getExceptions = () => {
    return policyException.map((exc, index) => {
      let newArr = [...policyException];
      return (
        <div className="create-policy-wrapper exceptions" key={index}>
          <Row>
            <Col md={2}>
              <div className="bg-secondary-light exception-field">
                <strong>Exception</strong>
              </div>
            </Col>
            <Col md={3}>
              <Form.Group controlId="platform">
                <Form.Label>Platforms</Form.Label>
                <SelectField
                  options={PLATFORM_LIST}
                  isMulti={true}
                  value={exc.platform}
                  name="exceptionPlatform"
                  handleChange={(data, e) => {
                    newArr[index].platform = handleSelectAll(data, e, PLATFORM_LIST)
                    setPolicyException(newArr)
                  }
                  }
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group controlId="action">
                <Form.Label>Action</Form.Label>
                <div className="d-flex">
                  <Form.Check
                    type="radio"
                    checked={exc.action === "block"}
                    label="Block"
                    onChange={() => {
                      newArr[index].action = 'block';
                      setPolicyException(newArr)
                    }}
                  />
                  <Form.Check
                    type="radio"
                    label="Allow"
                    checked={exc.action === "allow"}
                    onChange={() => {
                      newArr[index].action = 'allow';
                      setPolicyException(newArr)
                    }}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group controlId="duration">
                <Form.Label>Duration</Form.Label>
                <SelectField
                  options={DURATIONS_LIST}
                  name="exceptionDuration"
                  value={exc.duration}
                  handleChange={(data) => {
                    newArr[index].duration = data;
                    setPolicyException(newArr)
                  }
                  }
                />
              </Form.Group>
            </Col>
            <Col md={2} style={{ position: 'relative' }}>
              <Form.Group controlId="until">
                <Form.Label>Until</Form.Label>
                <Form.Control
                  type="date"
                  name="exceptionUntil"
                  value={exc.date}
                  placeholder="Release Date"
                  onChange={(e) => {
                    newArr[index].date = e.target.value;
                    setPolicyException(newArr)
                  }
                  }
                />
              </Form.Group>
              <span className="exception-close">
                <CloseIcon fontSize="inherit" className="bg-secondary modal-cls-btn" onClick={() => removeException(index)} />
              </span>
            </Col>
          </Row>
        </div>
      )
    })
  }

  const getSummeryException = () => {
    return policyException.map((exc, index) => {
      return (
        <div className="create-policy-wrapper exception-summary" key={index}>
          <Row className="align-items-center">
            <Col>
              <div className="bg-secondary-light exception-summary">
                <strong>Exception</strong>
              </div>
            </Col>
            <Col>
              <strong>Platforms: </strong>
              <span> {destructurePolicyPlatform(exc.platform)}</span>
            </Col>
            <Col>
              <strong>Action: </strong>
              <span> {exc.action}</span>
            </Col>
            <Col>
              <strong>Duration: </strong>
              <span> {exc.duration ? exc.duration.name : ''}</span>
            </Col>
            <Col>
              <strong>Until: </strong>
              <span> {exc.date ? moment(exc.date).format('MM-DD-YYYY') : ''}</span>
            </Col>
          </Row>
        </div>
      )
    })
  }

  const handlePlatformChange = (data, e) => {
    setPolicy({ ...policy, platform: handleSelectAll(data, e, PLATFORM_LIST) })
  }

  return (
    <div className="policy-wrapper">
      {loading && <Loader />}
      <Row className="pt-70">
        <Col md={3}>
          <h3 className="heading">Find Policy</h3>
          <label className="sub-title">Select a Policy to Edit</label>
          <AutoComplete options={options} onChange={onChange} />
        </Col>
      </Row>
      <Row className="pt-70">
        <Col md={12}>
          <h3 className="heading">Create/Edit Policies</h3>
          <label className="sub-title">Create and Edit Policies</label>
          <div className="create-policy-wrapper">
            <Row>
              <Col md={2}>
                <Form.Group controlId="policyName">
                  <Form.Label>Policy Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={policy.policyName}
                    name="policyName"
                    placeholder="Policy Name"
                    onChange={(e) =>
                      setPolicy({ ...policy, policyName: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="platform">
                  <Form.Label>Platforms</Form.Label>
                  <SelectField
                    options={PLATFORM_LIST}
                    value={policy.platform}
                    isMulti={true}
                    name="platform"
                    handleChange={(data, e) => { handlePlatformChange(data, e) }}
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="action">
                  <Form.Label>Action</Form.Label>
                  <div className="d-flex">
                    <Form.Check
                      checked={policy.action === "block"}
                      type="radio"
                      label="Block"
                      onChange={() => setPolicy({ ...policy, action: "block" })}
                    />
                    <Form.Check
                      checked={policy.action === "allow"}
                      type="radio"
                      label="Allow"
                      onChange={() => setPolicy({ ...policy, action: "allow" })}
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="duration">
                  <Form.Label>Duration</Form.Label>
                  <SelectField
                    options={DURATIONS_LIST}
                    value={policy.duration}
                    name="duration"
                    handleChange={(data) =>
                      setPolicy({ ...policy, duration: data })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group controlId="date">
                  <Form.Label>Until</Form.Label>
                  <Form.Control
                    value={policy.date}
                    type="date"
                    name="date"
                    placeholder="Date"
                    onChange={(e) =>
                      setPolicy({ ...policy, date: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={1}></Col>
            </Row>
          </div>
          {getExceptions()}
          <hr />
        </Col>
      </Row>
      <Row className="pt-70">
        <Col>
          <h3 className="heading">Policy Summary</h3>
          <hr />
          <div className="summary-headings">
            <Row>
              <Col>
                <strong>Policy: </strong> <span> {policy.policyName}</span>
              </Col>
              <Col>
                <strong>Platforms: </strong> <span> {destructurePolicyPlatform(policy.platform)}</span>
              </Col>
              <Col>
                <strong>Action: </strong> <span> {policy.action}</span>
              </Col>
              <Col>
                <strong>Duration: </strong> <span> {policy.duration ? policy.duration.name : ''}</span>
              </Col>
              <Col>
                <strong>Until: </strong> <span> {policy.date ? moment(policy.date).format('MM-DD-YYYY') : ''}</span>
              </Col>
            </Row>
          </div>
          {getSummeryException()}
        </Col>
      </Row>
      <Row className="pt-70">
        <Col md={10}>
          <Button
            handleClick={createExceptionRow}
            variant="secondary"
            startIcon={<AddCircleIcon />}
            label="Create Exception"
            className="text-white"
          />
        </Col>
        <Col md={2} className="d-flex justify-content-end">
          <Button
            variant="secondary"
            label="Save"
            className="text-white mr-20"
            handleClick={handleSubmit}
          />
          <Button
            handleClick={() => { }}
            variant="light"
            label="Cancel"
            className=""
          />
        </Col>
      </Row>
    </div>
  );
}
