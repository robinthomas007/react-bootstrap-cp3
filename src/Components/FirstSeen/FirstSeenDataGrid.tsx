/** @format */

import React, { useEffect } from "react";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Col from "react-bootstrap/Col";
import { useColor } from "../../Context/ColorModeContext";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Table from "react-bootstrap/Table";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArchiveIcon from "@mui/icons-material/Archive";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Popover from "react-bootstrap/Popover";
import SelectField from "./../Common/select";
import Button from "./../Common/button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import {
  capitalizeFirstLetter,
  FormatPlatforms,
  getApi,
  truncateWithEllipsis,
} from "./../Common/Utils";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import CircularProgress from "@mui/material/CircularProgress";

type searchProps = {
  loading: boolean | Boolean;
  tracks: any;
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
  openCreateModal: any;
  deleteTrack: any;
  role: string;
  TITLES: any;
};

type tableHeaderObj = {
  id: any;
  name: string;
};

export default function ProjectSearchDataGrid(props: searchProps) {
  const [selectedRows, setSelectedRows] = React.useState<any>([]);
  const [activeSort, setActiveSort] = React.useState("updatedDate");
  const [sortOrder, setSortOrder] = React.useState("desc");
  const [columnFilter, setcolumnFilter] = React.useState<Array<tableHeaderObj>>(
    [{ id: "", name: "" }]
  );
  const [filterSearch, setFilterSearch] = React.useState<any>({});
  const [hideColumns, setHideColumns] = React.useState<Array<string>>([]);
  const [active, setActive] = React.useState<any>("");
  const [notes, setNotes] = React.useState<any>([]);
  const [loadingNotes, setLoadingNotes] = React.useState<any>(false);

  const colorModeContext = useColor();

  const [headers, setHeaders] = React.useState(props.TITLES);

  React.useEffect(() => {
    setHeaders(props.TITLES);
    setcolumnFilter([props.TITLES[0]]);
  }, [props.TITLES]);

  useEffect(() => {
    setSelectedRows([]);
  }, [props.pageNumber]);

  const NotesModal = (track: object) => {
    props.openNotesModal(track);
  };

  const editModal = (track: object) => {
    if (selectedRows.length > 0) {
      props.openCreateModal(
        props.tracks.filter((o: any) => selectedRows.includes(o.trackId))
      );
    } else {
      props.openCreateModal([track]);
    }
  };

  const deleteTrack = (track: any) => {
    if (selectedRows.length > 0) {
      props.deleteTrack(selectedRows);
    } else {
      props.deleteTrack([track.trackId]);
    }
  };

  const handleCheckboxAll = (e: any) => {
    if (e.target.checked) {
      setSelectedRows(props.tracks.map((t: any) => t.trackId));
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

  const getHeaderCell = (
    header: string,
    track: any,
    options: { tab: any; emptyEx: any; activeTabData: any; exData: any }
  ) => {
    if (header === "title") {
      return track.subTitle ? (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="button-tooltip">{track.subTitle}</Tooltip>}
        >
          <span>{truncateWithEllipsis(track.title, 20)}</span>
        </OverlayTrigger>
      ) : (
        truncateWithEllipsis(track.title, 20)
      );
    }
    if (header === "source") {
      return (
        <span className={`soruce-box ${track.source}`}>
          {track.source === "FS" ? "1st" : track.source}
        </span>
      );
    }
    if (header === "blockPolicyName") {
      return track.policyDetails ? (
        <OverlayTrigger
          onEnter={() => setActive("")}
          trigger={["click", "focus"]}
          placement="top"
          overlay={
            <Popover id="popover-basic" className="policy-popover">
              <Popover.Body className="plcy-bdy-pad">
                <div className="d-flex justify-center">
                  <strong>Policy Name: {track.blockPolicyName} </strong>
                </div>
                <div className="policy-tl-nav">
                  <span
                    className={
                      active === "pre-release"
                        ? "active"
                        : active === "" && options.tab === "pre-release"
                        ? "active"
                        : "non-active"
                    }
                    onClick={() => setActive("pre-release")}
                  >
                    Pre-Release Policy
                  </span>
                  <span
                    className={
                      active === "post-release"
                        ? "active"
                        : active === "" && options.tab === "post-release"
                        ? "active"
                        : "non-active"
                    }
                    onClick={() => setActive("post-release")}
                  >
                    Post-Release Policy
                  </span>
                  <span
                    className={active === "always" ? "active" : "non-active"}
                    onClick={() => setActive("always")}
                  >
                    Always
                  </span>
                  <span>
                    <strong>Release Date:</strong> {track.releaseDate}
                  </span>
                </div>
                {!options.activeTabData && !options.emptyEx && (
                  <div className="d-flex justify-content-center">
                    <p>
                      <strong>No Policy Applied</strong>
                    </p>
                  </div>
                )}
                {track.policyDetails.release.toLowerCase() ===
                  (active === "" ? options.tab : active) && (
                  <div className="policy-popover-bg">
                    <div className="d-flex mb-2">
                      <div className="po-plcy-pltfm">
                        <strong>Platforms:</strong>{" "}
                        {FormatPlatforms(track.policyDetails.platform)}
                      </div>
                    </div>
                    <div className="d-flex">
                      <div className="po-plcy-action">
                        <strong>Action:</strong>{" "}
                        {capitalizeFirstLetter(track.policyDetails.action)}
                      </div>
                      <div className="po-plcy-duration">
                        <strong>Duration:</strong>{" "}
                        {track.policyDetails.duration}
                      </div>
                      <div className="po-plcy-until">
                        <strong>
                          {track.policyDetails.release === "Post-Release"
                            ? "After"
                            : "Until"}
                          :
                        </strong>{" "}
                        {track.policyDetails.date}
                      </div>
                    </div>
                  </div>
                )}

                {track.exceptionDetails &&
                  track.exceptionDetails.map((exec: any, id: any) => {
                    return (
                      <div key={id}>
                        {exec.release.toLowerCase() ===
                          (active === "" ? options.tab : active) && (
                          <div className="po-exception" key={id}>
                            <div className="d-flex mb-2">
                              <div className="po-plcy-pltfm">
                                <strong>Platforms:</strong>{" "}
                                {FormatPlatforms(exec.platform)}
                              </div>
                            </div>
                            <div className="d-flex">
                              <div className="po-plcy-action">
                                <strong>Action:</strong>{" "}
                                {capitalizeFirstLetter(exec.action)}
                              </div>
                              <div className="po-plcy-duration">
                                <strong>Duration:</strong> {exec.duration}
                              </div>
                              <div className="po-plcy-when">
                                <strong>
                                  {exec.release === "Post-Release"
                                    ? "After"
                                    : "Until"}
                                  :
                                </strong>{" "}
                                {exec.date}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </Popover.Body>
            </Popover>
          }
          rootClose
        >
          <span>{track.blockPolicyName}</span>
        </OverlayTrigger>
      ) : (
        <span>{track.blockPolicyName}</span>
      );
    }
    if (header === "artist") {
      <span>{truncateWithEllipsis(track.artist, 15)}</span>;
    }
    if (header === "album") {
      <span>{truncateWithEllipsis(track.album, 15)}</span>;
    }
    return track[header];
  };

  const handleCheckboxChange = (e: any, trackId: Number) => {
    if (e.target.checked) {
      setSelectedRows([...selectedRows, trackId]);
    } else {
      setSelectedRows(selectedRows.filter((id: any) => id !== trackId));
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

  const getNotes = (trackId: number, source: string) => {
    setLoadingNotes(true);
    setNotes([]);
    getApi({ sourceId: trackId, source: source }, "Track/GetTrackNotes")
      .then((res: any) => {
        setNotes(res);
        setLoadingNotes(false);
      })
      .catch((error: any) => {
        console.log("error feching data", error);
        setLoadingNotes(false);
      });
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

  const getActiveTabToolTip = (releaseDate: string) => {
    const relDate = moment(releaseDate).format("MM-DD-YYYY");
    const currentDate = moment().format("MM-DD-YYYY");
    return moment(relDate) > moment(currentDate)
      ? "pre-release"
      : "post-release";
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
                      checked={selectedRows.length === props.tracks.length}
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
          {props.tracks.map((track: any, index: number) => {
            const tab = getActiveTabToolTip(track.releaseDate);
            const exData =
              track.exceptionDetails &&
              track.exceptionDetails.map((item: any) =>
                item.release.toLowerCase()
              );
            const emptyEx =
              exData && exData.includes(active === "" ? tab : active);
            const activeTabData =
              track.policyDetails &&
              track.policyDetails.release.toLowerCase() ===
                (active === "" ? tab : active);
            return (
              <React.Fragment key={index}>
                <tr
                  key={index}
                  className={`${
                    selectedRows.includes(track.trackId) ? "selected-row" : ""
                  }`}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(track.trackId)}
                      onChange={(e) => handleCheckboxChange(e, track.trackId)}
                      className="form-check-input"
                    />
                  </td>
                  {headers.map(
                    (header: any) =>
                      !hideColumns.includes(header.id) && (
                        <td key={header.id}>
                          {getHeaderCell(header.id, track, {
                            tab,
                            emptyEx,
                            activeTabData,
                            exData,
                          })}
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
                          onClick={() => NotesModal(track)}
                          onMouseEnter={() =>
                            getNotes(track.trackId, track.source)
                          }
                        />
                      </OverlayTrigger>
                      {props.role === "admin" && (
                        <EditIcon
                          className="icon editIcon"
                          onClick={() => editModal(track)}
                        />
                      )}
                      {props.role === "admin" && (
                        <ArchiveIcon
                          className={
                            track.source === "CP3" || track.source === "FS"
                              ? ""
                              : "disabled"
                          }
                          onClick={() =>
                            (track.source === "CP3" || track.source === "FS") &&
                            deleteTrack(track)
                          }
                        />
                      )}
                      {/*props.role === 'admin' && <DeleteIcon onClick={(() => deleteTrack(track))} />*/}
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
