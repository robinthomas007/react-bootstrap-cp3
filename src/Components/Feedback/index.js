import React from 'react'
import { Row, Col, Container } from "react-bootstrap";
import Button from "../Common/button";
import Form from "react-bootstrap/Form";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
// @ts-ignore
import { CSVLink } from "react-csv";
import Pagination from "@mui/material/Pagination";
import FeedbackDataGrid from './FeedbackDataGrid'
import './feedback.css'
import { FEEDBACK_TITLES } from './../Common/staticDatas'
import { feedbackReducer, feedbackInitialState } from './Reducer/feedbackReducer';

export default function Feedback() {
  const [state, dispatch] = React.useReducer(feedbackReducer, feedbackInitialState);

  return (
    <Container fluid className="feedback-wrapper">
      <Row className="mt-5">
        <Col md={4}>
          <h3 className='feedback-heading'>Feedback Dashboard</h3>
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
          loading={false}
          greenList={[]}
          limit={10}
          height={100}
          totalPages={10}
          totalItems={100}
          pageNumber={1}
          onSortModelChange={() => { console.log('test') }}
          openNotesModal={() => { console.log('test') }}
          dispatch={dispatch}
          onFilterColumnSearch={() => { console.log('test') }}
          role={'admin'}
          TITLES={FEEDBACK_TITLES}
        />
      </Row>
    </Container>
  )
}
