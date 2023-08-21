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
import { toast } from "react-toastify";
import {
  feedbackReducer,
  feedbackInitialState,
} from "./Reducer/feedbackReducer";

export default function Feedback() {

  const [state, dispatch] = React.useReducer(
    feedbackReducer,
    feedbackInitialState
  );
  const [csvData, setcsvData] = React.useState([]);
  const csvLink = React.createRef<any>();

  const getSearchPageData = React.useCallback(
    (isExport: any) => {
      const {
        searchTerm,
        itemsPerPage,
        pageNumber,
        sortColumn,
        sortOrder,
      } = state.searchCriteria;

      dispatch({ type: "FETCH_REQUEST", payload: "" });
      axios
        .get(BASE_URL + "FeedBackSearch", {
          params: {
            searchTerm: searchTerm,
            itemsPerPage: isExport ? "" : itemsPerPage,
            pageNumber: isExport ? "" : pageNumber,
            sortColumn: sortColumn,
            sortOrder: sortOrder,
            isExport: isExport ? true : false,
          },
          headers: {
            cp3_auth: getCookie("cp3_auth"),
          },
        })
        .then((res) => {
          if (res.data.isExport) {
            setcsvData(res.data.feedBackList);
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

  const onSortModelChange = (data: any[]) => {
    dispatch({ type: "SORT_CHANGE", payload: data });
  };

  const updateFeedBackStatus = (statusId: number, feedbackId: number) => {
    dispatch({ type: "STATUS_CHANGE", payload: { statusId: statusId, feedbackId: feedbackId } });
  }

  React.useEffect(() => {
    const isExport = false;
    getSearchPageData(isExport);
  }, [getSearchPageData]);

  React.useEffect(() => {
    if (csvData.length > 0 && csvLink) {
      csvLink.current.link.click();
    }
  }, [csvData]);

  const deleteFeedback = (ids: Array<any>) => {
    console.log(ids, "idsids")
    if (window.confirm("Are you sure to delete this Feedback?"))
      axios
        .delete(BASE_URL + `FeedBack/DeleteFeedBack`, {
          data: {
            feedbackId: ids,
          },
          headers: {
            cp3_auth: getCookie("cp3_auth"),
          },
        })
        .then((res: any) => {
          if (res) {
            toast.success("Feedback deleted successfully!", {
              autoClose: 3000,
              closeOnClick: true,
            });
            dispatch({ type: "DELETE_SUCCESS", payload: ids });
          } else {
            toast.error("Error deleting Feedback", {
              autoClose: 3000,
              closeOnClick: true,
            });
          }
        })
        .catch((err) => {
          console.log("error feching data", err);
        });
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    dispatch({ type: "PAGE_CHANGE", payload: { pageNumber: pageNumber } });
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "CHANGE_LIMIT", payload: event.target.value });
  };

  const exportData = () => {
    getSearchPageData(true);
    dispatch({ type: "EXPORT_START", payload: "" });
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
                onChange={handleLimitChange}
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
                count={state.totalPages ? Number(state.totalPages) : 0}
                shape="rounded"
                color="primary"
                page={state.pageNumber}
                onChange={handlePageChange}
              />
            </Col>
            <Col md={4} className=" d-flex footer-actions justify-content-end">
              <Button
                handleClick={exportData}
                variant="light"
                startIcon={<FileDownloadIcon />}
                label={"Export"}
                className=""
              />
            </Col>
          </Row>
        </Col>
        <CSVLink
          data={csvData}
          headers={FEEDBACK_TITLES.map((elm: any) => ({
            key: elm.id,
            label: elm.name,
          }))}
          filename="projects.csv"
          className="hidden"
          ref={csvLink}
          target="_blank"
        />
      </Row>
      <Row className="justify-content-md-center">
        <FeedbackDataGrid
          loading={state.loading}
          feedBackList={state.feedBackList}
          updateFeedBackStatus={updateFeedBackStatus}
          limit={state.limit}
          onSortModelChange={onSortModelChange}
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
