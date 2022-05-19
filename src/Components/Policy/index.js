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
import youtube from './../../Static/Images/youtube.png'
import facebook from './../../Static/Images/facebook.png'
import soundCloud from './../../Static/Images/soundCloud.png'
import instagram from './../../Static/Images/instagram.png'

const platformOptions = [
  { id: 'ALL', name: 'ALL' },
  { id: "youtube", name: <div className="select-platform-images"><img alt="youtube" src={youtube} /></div> },
  { id: 'soundCloud', name: <div className="select-platform-images"><img alt="soundCloud" src={soundCloud} /></div> },
  { id: 'facebook', name: <div className="select-platform-images"><img alt="facebook" src={facebook} /></div> },
  { id: 'instagram', name: <div className="select-platform-images"><img alt="instagram" src={instagram} /></div> }
];

const DURATIONS_LIST = [
  { id: ">30 sec", name: ">30 sec" },
  { id: ">1:00", name: ">1:00" },
  { id: ">1:30", name: ">1:30" },
  { id: ">2:00", name: ">2:00" },
  { id: ">2:30", name: ">2:30" },
]

export default function Policy() {
  const [options, setOptions] = useState([]);
  // const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [loading, setLoading] = useState(false);
  const defaultPolicy = {
    policyName: "",
    platforms: [],
    action: "",
    duration: "",
    date: "",
    exceptions: []
  };
  const [policy, setPolicy] = useState(defaultPolicy);

  useEffect(() => {
    axios
      .get(BASE_URL + "BlockPolicy/GetBlockPolicy", {
        headers: {
          cp3_auth: getCookie("cp3_auth"),
        },
      })
      .then((res) => {
        console.log(res.data, "Asasd")
        setOptions(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
      const platformsList = option.platforms.split(",");
      setPolicy({
        ...option,
        policyName: option.policyName,
        platforms: platformOptions.filter((platform) =>
          platformsList.includes(platform.id)
        ),
        duration: DURATIONS_LIST.filter((duration) =>
          option.duration.includes(duration.id)
        )
      });
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
    const data = {
      ...policy,
      platform: policy.platforms ? policy.platforms.map((platform) => platform.id).join(",") : '',
      duration: policy.duration ? policy.duration.id : '',
      username: getUsername(),
    };
    if (policy.blockPolicyId) {
      axios
        .put(BASE_URL + "BlockPolicy/UpdateBlockPolicy", data, config)
        .then(() => alert("Policy Saved"))
        .catch((err) => {
          console.log("error feching data", err);
        })
        .finally(() => setLoading(false));
    } else {
      axios
        .post(BASE_URL + "BlockPolicy/AddBlockPolicy", data, config)
        .then(() => alert("Policy Saved"))
        .catch((err) => {
          console.log("error feching data", err);
        })
        .finally(() => setLoading(false));
    }
  };


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
        <Col>
          <h3 className="heading">Create/Edit Policies</h3>
          <label className="sub-title">Create and Edit Policies</label>
          <div className="create-policy-wrapper">
            <Row>
              <Col>
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
              <Col>
                <Form.Group controlId="platform">
                  <Form.Label>Platforms</Form.Label>
                  <SelectField
                    options={platformOptions}
                    value={policy.platforms}
                    isMulti={true}
                    name="platform"
                    handleChange={(data) =>
                      setPolicy({ ...policy, platforms: data })
                    }
                  />
                </Form.Group>
              </Col>
              <Col>
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
              <Col>
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
              <Col>
                <Form.Group controlId="date">
                  <Form.Label>Untill</Form.Label>
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
            </Row>
          </div>
          <div className="create-policy-wrapper exceptions">
            <Row>
              <Col>
                <div className="bg-secondary-light exception-field">
                  Exception
                </div>
              </Col>
              <Col>
                <Form.Group controlId="platform">
                  <Form.Label>Platforms</Form.Label>
                  <SelectField
                    options={[]}
                    isMulti={true}
                    name="platform"
                    handleChange={console.log()}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="action">
                  <Form.Label>Action</Form.Label>
                  <div className="d-flex">
                    <Form.Check
                      type="radio"
                      label="Block"
                      onChange={console.log()}
                    />
                    <Form.Check
                      type="radio"
                      label="Allow"
                      onChange={console.log()}
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="duration">
                  <Form.Label>Duration</Form.Label>
                  <SelectField
                    options={[]}
                    isMulti={true}
                    name="duration"
                    handleChange={console.log()}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="until">
                  <Form.Label>Untill</Form.Label>
                  <Form.Control
                    type="date"
                    name="untill"
                    placeholder="Release Date"
                    onChange={console.log()}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
          <hr />
        </Col>
      </Row>
      <Row className="pt-70">
        <Col>
          <h3 className="heading">Policy Summary</h3>
          <hr />
          <div className="">
            <Row>
              <Col>
                <strong>Policy: </strong> <span>Policy Name</span>
              </Col>
              <Col>
                <strong>Platforms: </strong> <span>All</span>
              </Col>
              <Col>
                <strong>Action: </strong> <span>Block</span>
              </Col>
              <Col>
                <strong>Duration: </strong> <span>All</span>
              </Col>
              <Col>
                <strong>Until: </strong> <span>Release Date (Default)</span>
              </Col>
            </Row>
          </div>
          <div className="create-policy-wrapper exception-summary">
            <Row className="align-items-center">
              <Col>
                <div className="bg-secondary-light exception-summary">
                  Exception
                </div>
              </Col>
              <Col>
                <strong>Platforms :</strong>
                <span>YouTube</span>
              </Col>
              <Col>
                <strong>Action :</strong>
                <span>Allow</span>
              </Col>
              <Col>
                <strong>Duration :</strong>
                <span> Less than 30 seconds</span>
              </Col>
              <Col>
                <strong>Untill :</strong>
                <span>Sep 6, 2022</span>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={10}>
          <Button
            handleClick={() => { }}
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
