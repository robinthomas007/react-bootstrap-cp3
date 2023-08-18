/** @format */

import React, { useEffect } from "react";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import Col from "react-bootstrap/Col";
import { useColor } from "../../Context/ColorModeContext";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Table from "react-bootstrap/Table";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArchiveIcon from "@mui/icons-material/Archive";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Popover from "react-bootstrap/Popover";
import SelectField from "./../Common/select";
import Button from "./../Common/button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import { getApi } from "./../Common/Utils";
import moment from "moment";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import CircularProgress from "@mui/material/CircularProgress";

type searchProps = {
  loading: boolean | Boolean;
  feedBackList: any;
  limit: number;
  height: number;
  totalPages: number;
  totalItems: number;
  pageNumber: number;
  onSortModelChange: any;
  onFilterColumnSearch: any;
  // clearSearch: any;
  openNotesModal: any;
  dispatch: any;
  role: string;
  TITLES: any;
};

type tableHeaderObj = {
  id: any;
  name: string;
};

export default function FeedbackDataGrid(props: searchProps) {
  const [selectedRows, setSelectedRows] = React.useState<any>([]);
  const [activeSort, setActiveSort] = React.useState("updatedDate");
  const [sortOrder, setSortOrder] = React.useState("desc");
  const [columnFilter, setcolumnFilter] = React.useState<Array<tableHeaderObj>>(
    [{ id: "", name: "" }]
  );
  const [filterSearch, setFilterSearch] = React.useState<any>({});
  const [hideColumns, setHideColumns] = React.useState<Array<string>>([]);
  const [notes, setNotes] = React.useState<any>([]);
  const [loadingNotes, setLoadingNotes] = React.useState<any>(false);

  const colorModeContext = useColor();

  const [headers, setHeaders] = React.useState(props.TITLES);

  React.useEffect(() => {
    console.log("state", props.feedBackList);
  });
  React.useEffect(() => {
    setHeaders(props.TITLES);
    setcolumnFilter([props.TITLES[0]]);
  }, [props.TITLES]);

  useEffect(() => {
    setSelectedRows([]);
  }, [props.pageNumber]);

  const NotesModal = (feedBackList: object) => {
    props.openNotesModal(feedBackList);
  };

  const handleCheckboxAll = (e: any) => {
    if (e.target.checked) {
      setSelectedRows(props.feedBackList.map((t: any) => t.feedBackListId));
    } else {
      setSelectedRows([]);
    }
  };

  const getNotes = (feedBackListId: number, source: string) => {
    setLoadingNotes(true);
    setNotes([]);
    getApi({ sourceId: feedBackListId, source: source }, "Track/GetTrackNotes")
      .then((res: any) => {
        setNotes(res);
        setLoadingNotes(false);
      })
      .catch((error: any) => {
        console.log("error feching data", error);
        setLoadingNotes(false);
      });
  };

  const notePopover = (
    <Popover id="popover-basic" className="albumList-popover">
      <Popover.Body className="plcy-bdy-pad">
        <div>
          <ul>
            {notes.length === 0 && loadingNotes && (
              <span>
                <CircularProgress size="25px" style={{ color: "#F57F17" }} />
              </span>
            )}
            {notes.length === 0 && !loadingNotes && (
              <span>No Notes Available</span>
            )}
            {notes.map((note: any, id: any) => {
              return (
                <li key={id}>
                  <span className="notes-name-date">
                    {note.userName} -{" "}
                    {moment(note.createdOn).format("DD/MM/YYYY")}
                  </span>{" "}
                  <span> {note.noteDescription}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </Popover.Body>
    </Popover>
  );

  const reorderColumns = (options: DropResult) => {
    if (options?.destination?.index) {
      const headersCopy = [...headers];
      const item = headersCopy.splice(options.source.index, 1)[0];
      headersCopy.splice(options.destination.index, 0, item);
      setHeaders(headersCopy);
    }
  };

  const getHeaderCell = (header: string, feedBackList: any) => {
    return feedBackList[header];
  };

  const handleCheckboxChange = (e: any, feedBackListId: Number) => {
    if (e.target.checked) {
      setSelectedRows([...selectedRows, feedBackListId]);
    } else {
      setSelectedRows(selectedRows.filter((id: any) => id !== feedBackListId));
    }
  };

  const handleSortOrderChange = (order: string, column: string) => {
    setActiveSort(column);
    setSortOrder(order);
    props.onSortModelChange({ sortColumn: column, sortOrder: order });
  };

  const clearColumnFilter = (key: string, callApi: boolean) => {
    setFilterSearch((current: any) => {
      // remove the key from an object
      const copy = { ...current };
      delete copy[key];
      callApi && props.onFilterColumnSearch(copy);
      return copy;
    });
  };

  const getHiddenTitles = () => {
    return props.TITLES.filter((o: any) => hideColumns.includes(o.id)).map(
      (data: any) => {
        return (
          <div className="hide-ttl-strips">
            {data.name}{" "}
            <CloseIcon
              onClick={() =>
                setHideColumns(
                  hideColumns.filter((element) => element !== data.id)
                )
              }
            />
          </div>
        );
      }
    );
  };

  const popover = (
    <Popover id="popover-basic" className="filter-popover">
      <Popover.Body>
        <div className="clmn-filter-bdy">
          {hideColumns.includes(columnFilter[0].id) ? (
            <VisibilityOffIcon
              onClick={() =>
                setHideColumns(
                  hideColumns.filter(
                    (element) => element !== columnFilter[0].id
                  )
                )
              }
            />
          ) : (
            <VisibilityIcon
              onClick={() =>
                setHideColumns([...hideColumns, columnFilter[0].id])
              }
            />
          )}
          <SelectField
            value={columnFilter}
            isMulti={false}
            options={props.TITLES}
            name="labelIds"
            handleChange={(data: any) => setcolumnFilter([data])}
          />
          <input
            value={filterSearch[columnFilter[0].id] || ""}
            type="text"
            onChange={(e: any) =>
              e.target.value === ""
                ? clearColumnFilter(columnFilter[0].id, false)
                : setFilterSearch({
                    ...filterSearch,
                    [columnFilter[0].id]: e.target.value,
                  })
            }
          />
          {filterSearch[columnFilter[0].id] && (
            <CloseIcon
              className="filter-close"
              onClick={() => clearColumnFilter(columnFilter[0].id, true)}
            />
          )}
          <Button
            type="submit"
            variant="secondary"
            label="Search"
            className="text-white mr-20"
            handleClick={() => handleFilterSearch()}
          />
        </div>
        {hideColumns.length > 0 && (
          <div className="hd-list">
            <strong>Hide Columns </strong>
            <div className="hd-cl-wrapper">{getHiddenTitles()}</div>
          </div>
        )}
      </Popover.Body>
    </Popover>
  );

  const handleFilterSearch = () => {
    props.onFilterColumnSearch(filterSearch);
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
          <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={popover}
            rootClose
          >
            <FilterAltIcon
              className="header-filter-icon"
              onClick={() => setcolumnFilter([{ id: active, name: title }])}
            />
          </OverlayTrigger>
        </span>
      </span>
    );
  };

  return (
    <Col md={11}>
      <Table
        responsive
        className={`${
          colorModeContext.colorMode === "light"
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
                      !hideColumns.includes(ele.id) && (
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
                      )
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
                    className={`${
                      selectedRows.includes(feedBackList.feedBackListId)
                        ? "selected-row"
                        : ""
                    }`}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(
                          feedBackList.feedBackListId
                        )}
                        onChange={(e) =>
                          handleCheckboxChange(e, feedBackList.feedBackListId)
                        }
                        className="form-check-input"
                      />
                    </td>
                    {headers.map(
                      (header: any) =>
                        !hideColumns.includes(header.id) && (
                          <td key={header.id} id={header.id}>
                            {getHeaderCell(header.id, feedBackList)}
                          </td>
                        )
                    )}
                    <td>
                      <div className="action-icons justify-content-space-between">
                        <OverlayTrigger
                          trigger={["hover", "focus"]}
                          placement="left"
                          overlay={notePopover}
                          rootClose
                        >
                          <QuestionAnswerIcon
                            onClick={() => NotesModal(feedBackList)}
                            onMouseEnter={() =>
                              getNotes(feedBackList.feedBackListId, "GL")
                            }
                          />
                        </OverlayTrigger>
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
