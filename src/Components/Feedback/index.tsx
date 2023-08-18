/** @format */

import React, { useEffect } from "react";
import { Row, Col, Container } from "react-bootstrap";
import Button from "../Common/button";
import Form from "react-bootstrap/Form";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
// @ts-ignore
import { CSVLink } from "react-csv";
import Pagination from "@mui/material/Pagination";
import FeedbackDataGrid from "./FeedbackDataGrid";
import { BASE_URL } from "../../App";
import getCookie from "../Common/cookie";
import axios from "axios";
import "./feedback.css";
import { FEEDBACK_TITLES } from "../Common/staticDatas";
import { isSessionExpired } from "../Common/Utils";
import { useLocation } from "react-router-dom";
import {
  feedbackReducer,
  feedbackInitialState,
} from "./Reducer/feedbackReducer";

export default function Feedback() {
  const [state, dispatch] = React.useReducer(
    feedbackReducer,
    feedbackInitialState
  );
  const [search, setSearch] = React.useState("");
  const [openFilter, setOpenFilter] = React.useState(false);
  const [openNotes, setOpenNotes] = React.useState(false);
  const [selectedFilters, setSelectedFilters] = React.useState({});
  // const [selectedNotes, setSelectedNotes] =
  //   React.useState < notesPropTypes > {};
  const [showCreate, setShowCreate] = React.useState(false);
  const [editParams, setEditParams] = React.useState([]);
  const [csvData, setcsvData] = React.useState([]);
  // const auth = useAuth();
  // const location = useLocation();
  const getSearchPageData = React.useCallback(
    (isExport: any) => {
      const {
        searchTerm,
        itemsPerPage,
        pageNumber,
        sortColumn,
        sortOrder,
        filter,
        tableSearch,
      } = state.searchCriteria;

      dispatch({ type: "FETCH_REQUEST", payload: "" });
      axios
        .get(BASE_URL + "FeedBackSearch", {
          headers: {
            cp3_auth: getCookie("cp3_auth"),
          },
        })
        .then((res) => {
          console.log("responsefnffk", res);
          if (res.data.isExport) {
            setcsvData(res.data.greenList);
            dispatch({ type: "EXPORT_END", payload: "" });
          } else {
            console.log("test", res.data);
            dispatch({ type: "FETCH_SUCCESS", payload: res.data });
          }
        })
        .catch((err) => {
          dispatch({ type: "FETCH_FAILURE", payload: err.Message });
          console.log("error feching data", err);
          isSessionExpired(err);
        });
    },
    [state.searchCriteria]
  );

  React.useEffect(() => {
    const isExport = false;
    getSearchPageData(isExport);
  }, [getSearchPageData]);

  const getIds = (data: any) => {
    let res = data.map((item: any) => item.id);
    return res.toString();
  };

  const deleteFeedback = (ids: Array<any>) => {
    if (window.confirm("Are you sure to delete this Feedback?"))
      axios
        .delete(BASE_URL + "FeedBack/DeleteFeedBack", {
          data: {
            feedbackIds: ids,
          },
          headers: {
            cp3_auth: getCookie("cp3_auth"),
          },
        })
        .then((res: any) => {
          if (res) {
            // toast.success("Track details deleted successfully!", {
            //   autoClose: 3000,
            //   closeOnClick: true,
            // });
            dispatch({ type: "DELETE_SUCCESS", payload: ids });
          } else {
            // toast.error("Error deleting Track details", {
            //   autoClose: 3000,
            //   closeOnClick: true,
            // });
          }
        })
        .catch((err) => {
          console.log("error feching data", err);
        });
  };

  return (
    <Container fluid className="feedback-wrapper">
      <Row className="mt-5">
        <Col md={4}>
          <h3 className="feedback-heading">Feedback Dashboard</h3>
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
              // onChange={handleLimitChange}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Form.Control>
              &nbsp;
              <span> of {10} Results</span>
            </Col>
            <Col md={4} className="d-flex justify-content-center">
              <Pagination
                count={10}
                shape="rounded"
                color="primary"
                page={1}
              // onChange={handlePageChange}
              />
            </Col>
            <Col md={4} className=" d-flex footer-actions justify-content-end">
              <Button
                // handleClick={props.exportData}
                variant="light"
                startIcon={<FileDownloadIcon />}
                label={"Export"}
                className=""
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <FeedbackDataGrid
          loading={state.loading}
          feedBackList={state.feedBackList}
          limit={state.limit}
          height={100}
          totalPages={state.totalPages}
          totalItems={state.totalItems}
          pageNumber={state.pageNumber}
          dispatch={dispatch}
          deleteFeedback={deleteFeedback}
          role={"admin"}
          TITLES={FEEDBACK_TITLES}
        />
      </Row>
    </Container>
  );
}
