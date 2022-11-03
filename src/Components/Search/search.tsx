import React from 'react'
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { InputGroup, FormControl } from "react-bootstrap";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import Button from "../Common/button";
import Form from "react-bootstrap/Form";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
// @ts-ignore
import { CSVLink } from "react-csv";
import Pagination from "@mui/material/Pagination";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ClearIcon from "@mui/icons-material/Clear";
import { useAuth } from "./../../Context/authContext";

export default function Search(props: any) {
  const auth = useAuth();
  const csvLink = React.createRef<any>();
  const { state, dispatch } = props

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "CHANGE_LIMIT", payload: event.target.value });
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    dispatch({ type: "PAGE_CHANGE", payload: { pageNumber: pageNumber } });
  };

  React.useEffect(() => {
    if (props.csvData.length > 0 && csvLink) {
      csvLink.current.link.click();
    }
  }, [props.csvData]);


  return (
    <Container fluid className="fixed-search">
      <Row className="justify-content-md-center min-row-ht-100 mt-5">
        <Col md={4} className="align-item-center align-items-center ">
          <InputGroup>
            <Button
              handleClick={props.openFilterModal}
              variant="light"
              label={<SettingsIcon />}
              className="mr-btn no-border-rd"
            />
            <SearchIcon className="txt-fld-search-icon" />
            <FormControl
              value={props.search}
              aria-label="search value"
              placeholder={props.placeholder}
              onChange={props.handleChange}
              className="txt-fld-search-main"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  props.setSearchTerm(props.search);
                }
              }}
            />
            {props.search && (
              <ClearIcon className="close-icon" onClick={props.clearSearch} />
            )}
            <Button
              handleClick={() => props.setSearchTerm(props.search)}
              variant="secondary"
              label="Search"
              className="text-white"
            />
          </InputGroup>
          {props.selectedFilterKeys.length > 0 && (
            <div className="selected-filter-wrapper">
              <label>Selected Filters: </label>
              {props.renderSelectedFilters()}
            </div>
          )}
        </Col>
      </Row>
      <Row className="pt-20 pb-20 justify-content-md-center">
        <Col md={11}>
          <Row>
            <Col
              md={4}
              className="d-flex justify-content-start align-items-center"
            >
              <span>Viewing </span> &nbsp;
              <Form.Control
                as="select"
                size="sm"
                style={{ width: "40px" }}
                onChange={handleLimitChange}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Form.Control>
              &nbsp;
              <span> of {state.totalItems} Results</span>
            </Col>
            <Col md={4} className="d-flex justify-content-center">
              <Pagination
                count={state.totalPages ? Number(state.totalPages) : 0}
                shape="rounded"
                color="primary"
                page={state.pageNumber}
                onChange={handlePageChange}
              />
            </Col>
            <Col md={4} className=" d-flex footer-actions justify-content-end">
              {auth.user.role === "admin" && (
                <Button
                  handleClick={props.openCreateModal}
                  variant="light"
                  startIcon={<AddCircleIcon />}
                  label="Create"
                  className=""
                />
              )}
              <Button
                handleClick={props.exportData}
                variant="light"
                startIcon={<FileDownloadIcon />}
                label={state.exportLoading ? "Exporting" : "Export"}
                className=""
              />
              <CSVLink
                data={props.csvData}
                headers={props.CSV_HEADERS.map((elm: any) => ({ key: elm.id, label: elm.name }))}
                filename="projects.csv"
                className="hidden"
                ref={csvLink}
                target="_blank"
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  )
}
