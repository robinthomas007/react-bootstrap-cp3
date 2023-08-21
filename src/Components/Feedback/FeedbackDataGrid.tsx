/** @format */

import React, { useEffect } from "react";
import Col from "react-bootstrap/Col";
import { useColor } from "../../Context/ColorModeContext";
import Table from "react-bootstrap/Table";
import ArchiveIcon from "@mui/icons-material/Archive";
import SelectField from "./../Common/select";
import Preview from "./preview";
import { FEEDBACK_STATUS } from './../Common/staticDatas'
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import getCookie from "../Common/cookie";
import axios from "axios";
import { BASE_URL } from "../../App";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

type searchProps = {
  loading: boolean | Boolean;
  feedBackList: any;
  limit: number;
  height: number;
  totalPages: number;
  totalItems: number;
  pageNumber: number;
  deleteFeedback: any;
  onSortModelChange: any;
  updateFeedBackStatus: any,
  dispatch: any;
  role: string;
  TITLES: any;
};


export default function FeedbackDataGrid(props: searchProps) {
  const [selectedRows, setSelectedRows] = React.useState<any>([]);
  const [openPreview, setOpenPreview] = React.useState(false);
  const [screenshot, setScreenshot] = React.useState<string | null>(null);
  const [headers, setHeaders] = React.useState(props.TITLES);
  const [comments, setComments] = React.useState();
  const [sortOrder, setSortOrder] = React.useState("desc");
  const [activeSort, setActiveSort] = React.useState("updatedDate");

  const colorModeContext = useColor();

  React.useEffect(() => {
    setHeaders(props.TITLES);
  }, [props.TITLES]);

  useEffect(() => {
    setSelectedRows([]);
  }, [props.pageNumber]);


  const handleCheckboxAll = (e: any) => {
    if (e.target.checked) {
      setSelectedRows(props.feedBackList.map((t: any) => t.feedBackId));
    } else {
      setSelectedRows([]);
    }
  };


  const reorderColumns = (options: DropResult) => {
    if (options?.destination?.index) {
      const headersCopy = [...headers];
      const item = headersCopy.splice(options.source.index, 1)[0];
      headersCopy.splice(options.destination.index, 0, item);
      setHeaders(headersCopy);
    }
  };

  const openThumbnail = (thumbnail: any, comments: any) => {
    setScreenshot(thumbnail)
    setOpenPreview(true)
    setComments(comments)
  }

  const handleStatusChange = (data: any, feedBackList: any) => {
    const config = {
      headers: {
        cp3_auth: getCookie("cp3_auth"),
      },
    };
    axios
      .post(
        BASE_URL + "feedback/addfeedback",
        {
          statusId: data.id,
          feedbackId: feedBackList.feedBackId,
        },
        config
      )
      .then((res) => {
        console.log(res, "Ssss")
        props.updateFeedBackStatus(data.id, feedBackList.feedBackId)
      }).catch((e) => {
      })
  }

  const handleSortOrderChange = (order: string, column: string) => {
    setActiveSort(column);
    setSortOrder(order);
    props.onSortModelChange({ sortColumn: column, sortOrder: order });
  };

  const getTableIcons = (active: string, title: string) => {
    return (
      <span>
        <span>{title}</span>
        <span className="sort-icons">
          {sortOrder === "desc" && activeSort === active ? (
            <KeyboardArrowUpIcon
              onClick={() => handleSortOrderChange("asc", active)}
            />
          ) : (
            <KeyboardArrowDownIcon
              onClick={() => handleSortOrderChange("desc", active)}
            />
          )}
        </span>
      </span>
    );
  };

  const getHeaderCell = (header: string, feedBackList: any) => {
    if (header === 'feedBackStatusId') {
      const status = FEEDBACK_STATUS.find((v) => v.id === feedBackList[header]) || {}
      return <div>
        <SelectField
          value={[status]}
          options={FEEDBACK_STATUS}
          name="configuration"
          isMulti={false}
          handleChange={(data: any) =>
            handleStatusChange(data, feedBackList)
          }
        />
      </div>
    }
    if (header === 'imageUrl') {
      return <div className="feeedback-thumbnail">
        <img src={feedBackList[header]} alt="feedback" onClick={() => openThumbnail(feedBackList[header], feedBackList['comments'])} width={115} height={70} />
      </div>
    }
    return feedBackList[header];
  };

  const handleCheckboxChange = (e: any, feedBackId: Number) => {
    if (e.target.checked) {
      setSelectedRows([...selectedRows, feedBackId]);
    } else {
      setSelectedRows(selectedRows.filter((id: any) => id !== feedBackId));
    }
  };

  const deleteFeedback = (feedback: any) => {
    console.log(feedback, "feedback")
    if (selectedRows.length > 0) {
      props.deleteFeedback(selectedRows);
    } else {
      props.deleteFeedback([feedback.feedBackId]);
    }
  };

  return (
    <Col md={11}>
      {openPreview && (
        <Preview
          show={openPreview}
          handleClose={() => setOpenPreview(false)}
          screenshot={screenshot}
          comments={comments}
        />
      )}
      <Table
        responsive
        className={`${colorModeContext.colorMode === "light"
          ? "srch-dg-tbl"
          : "srch-dg-tbl text-white"
          }`}
      >
        <thead>
          <DragDropContext onDragEnd={reorderColumns}>
            <Droppable droppableId="headers" direction="horizontal">
              {(provided) => (
                <tr {...provided.droppableProps} ref={provided.innerRef}>
                  <th>
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.length === props?.feedBackList?.length
                      }
                      className="form-check-input"
                      onChange={handleCheckboxAll}
                    />
                  </th>

                  {headers.map((ele: any, index: any) => {
                    return (
                      <Draggable
                        key={ele.id}
                        draggableId={ele.id}
                        index={index}
                      >
                        {(provided) => (
                          <th
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            id={ele.id}
                          >
                            {getTableIcons(ele.id, ele.name)}
                          </th>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                  <th className="text-center">Actions</th>
                </tr>
              )}
            </Droppable>
          </DragDropContext>
        </thead>
        <tbody className="tbale-bdy">
          {props.feedBackList &&
            props.feedBackList.map((feedBackList: any, index: number) => {
              return (
                <React.Fragment key={index}>
                  <tr
                    key={index}
                    className={`${selectedRows.includes(feedBackList.feedBackId)
                      ? "selected-row"
                      : ""
                      }`}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(
                          feedBackList.feedBackId
                        )}
                        onChange={(e) =>
                          handleCheckboxChange(e, feedBackList.feedBackId)
                        }
                        className="form-check-input"
                      />
                    </td>
                    {headers.map(
                      (header: any) =>
                      (
                        <td key={header.id} id={header.id}>
                          {getHeaderCell(header.id, feedBackList)}
                        </td>
                      )
                    )}
                    <td>
                      <div className="action-icons justify-content-space-between">
                        <ArchiveIcon onClick={(() => deleteFeedback(feedBackList))} />
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
        </tbody>
      </Table>
    </Col>
  );
}
