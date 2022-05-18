import React, { useState } from "react";
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

export default function Policy() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [policy, setPolicy] = useState({
    blockPolicyName: "",
    platform: "",
    action: "",
    duration: "",
    date: "",
  });

  const onInputChange = (text) => {
    if (text.length > 0)
      axios
        .get("https://jsonplaceholder.typicode.com/comments", {})
        .then((res) => {
          console.log(res);
          setOptions(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
  };

  const onChange = (data) => {
    console.log("onChange", data);
  };

  const handleSubmit = () => {
    setLoading(true);
    axios
      .post(
        BASE_URL + "BlockPolicy/AddBlockPolicy",
        {
          ...policy,
        },
        {
          headers: {
            cp3_auth: getCookie("cp3_auth"),
          },
        }
      )
      .then(() => alert("Policy Saved"))
      .catch((err) => {
        console.log("error feching data", err);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="policy-wrapper">
      {loading && <Loader />}
      <Row className="pt-70">
        <Col md={3}>
          <h3 className="heading">Find Policy</h3>
          <label className="sub-title">Select a Policy to Edit</label>
          <AutoComplete
            options={options}
            onInputChange={onInputChange}
            onChange={onChange}
          />
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
                    name="policyName"
                    placeholder="Policy Name"
                    onChange={(e) =>
                      setPolicy({ ...policy, blockPolicyName: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="platform">
                  <Form.Label>Platforms</Form.Label>
                  <SelectField
                    options={[
                      { name: "Instagram", id: "instagram" },
                      { name: "Facebook", id: "facebook" },
                      { name: "Youtube", id: "youtube" },
                      { name: "Twitter", id: "twitter" },
                    ]}
                    value={policy.platform}
                    name="platform"
                    handleChange={(data) =>
                      setPolicy({ ...policy, platform: data.id })
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
                      checked={policy.action === "monetize"}
                      type="radio"
                      label="Monetize"
                      onChange={() =>
                        setPolicy({ ...policy, action: "monetize" })
                      }
                    />
                  </div>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="duration">
                  <Form.Label>Duration</Form.Label>
                  <SelectField
                    options={[
                      { name: ">30 sec", id: ">30 sec" },
                      { name: ">1:00", id: ">1:00" },
                      { name: ">1:30", id: ">1:30" },
                      { name: ">2:00", id: ">2:00" },
                      { name: ">2:30", id: ">2:30" },
                    ]}
                    value={policy.duration}
                    name="duration"
                    handleChange={(data) =>
                      setPolicy({ ...policy, duration: data.id })
                    }
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="date">
                  <Form.Label>Untill</Form.Label>
                  <Form.Control
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
                      label="Monetize"
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
                <span>Monetize</span>
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
            handleClick={() => {}}
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
            handleClick={() => {}}
            variant="light"
            label="Cancel"
            className=""
          />
        </Col>
      </Row>
    </div>
  );
}
