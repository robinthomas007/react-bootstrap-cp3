import React from "react";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Col from "react-bootstrap/Col";
import { useColor } from "../../Context/ColorModeContext";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Table from "react-bootstrap/Table";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArchiveIcon from "@mui/icons-material/Archive";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Popover from "react-bootstrap/Popover";
import SelectField from "./../Common/select";
import Button from "./../Common/button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

type searchProps = {
  loading: boolean | Boolean;
  greenList: any;
  limit: number;
  height: number;
  totalPages: number;
  totalItems: number;
  pageNumber: number;
  onSortModelChange: any;
  onFilterColumnSearch: any;
  clearSearch: any;
  openNotesModal: any;
  dispatch: any;
  openCreateModal: any;
  deleteTrack: any;
  role: string;
  TITLES: any
};

type tableHeaderObj = {
  id: any;
  name: string;
};

export default function GreenListDataGrid(props: searchProps) {
  const [selectedRows, setSelectedRows] = React.useState<any>([]);
  const [activeSort, setActiveSort] = React.useState("updatedDate");
  const [sortOrder, setSortOrder] = React.useState("desc");
  const [columnFilter, setcolumnFilter] = React.useState<Array<tableHeaderObj>>([{ id: '', name: '' }]);
  const [filterSearch, setFilterSearch] = React.useState("");
  const [hideColumns, setHideColumns] = React.useState<Array<string>>([]);

  const colorModeContext = useColor();

  const [headers, setHeaders] = React.useState(props.TITLES);

  React.useEffect(() => {
    setHeaders(props.TITLES)
    setcolumnFilter([props.TITLES[0]])
  }, [props.TITLES]);

  const NotesModal = (greenList: object) => {
    props.openNotesModal(greenList);
  };

  const editModal = (greenList: object) => {
    if (selectedRows.length > 0) {
      props.openCreateModal(
        props.greenList.filter((o: any) => selectedRows.includes(o.greenListId))
      );
    } else {
      props.openCreateModal([greenList]);
    }
  };

  const deleteGreenList = (greenList: any) => {
    if (selectedRows.length > 0) {
      props.deleteTrack(selectedRows);
    } else {
      props.deleteTrack([greenList.greenListId]);
    }
  };

  const handleCheckboxAll = (e: any) => {
    if (e.target.checked) {
      setSelectedRows(props.greenList.map((t: any) => t.greenListId));
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
    greenList: any,
  ) => {
    if (header === "url") {
      return (
        <a href={greenList.url} rel="noreferrer" target="_blank">{greenList.url}</a>
      )
    }
    if (header === "type") {
      return (
        <span className={`soruce-box ${greenList.type === '3rd Party' ? 'third_party' : greenList.type}`}>{greenList.type}</span>
      )
    }
    return greenList[header];
  };

  const handleCheckboxChange = (e: any, greenListId: Number) => {
    if (e.target.checked) {
      setSelectedRows([...selectedRows, greenListId]);
    } else {
      setSelectedRows(selectedRows.filter((id: any) => id !== greenListId));
    }
  };

  const handleSortOrderChange = (order: string, column: string) => {
    setActiveSort(column);
    setSortOrder(order);
    props.onSortModelChange({ sortColumn: column, sortOrder: order });
  };

  const clearColumnFilter = () => {
    setFilterSearch("");
    props.clearSearch();
  };

  const getHiddenTitles = () => {
    return props.TITLES.filter((o: any) => hideColumns.includes(o.id)).map((data: any) => {
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
    });
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
            value={filterSearch}
            type="text"
            onChange={(e: any) => setFilterSearch(e.target.value)}
          />
          {filterSearch && (
            <CloseIcon
              className="filter-close"
              onClick={() => clearColumnFilter()}
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
    props.onFilterColumnSearch(filterSearch, columnFilter[0].id);
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
            <MoreVertIcon
              className="header-filter-icon"
              onClick={() =>
                !filterSearch && setcolumnFilter([{ id: active, name: title }])
              }
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
                      checked={selectedRows.length === props.greenList.length}
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
          {props.greenList.map((greenList: any, index: number) => {
            return (
              <React.Fragment key={index}>
                <tr
                  key={index}
                  className={`${selectedRows.includes(greenList.greenListId) ? "selected-row" : ""
                    }`}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(greenList.greenListId)}
                      onChange={(e) => handleCheckboxChange(e, greenList.greenListId)}
                      className="form-check-input"
                    />
                  </td>
                  {headers.map(
                    (header: any) =>
                      !hideColumns.includes(header.name) && (
                        <td key={header.id} id={header.id}>
                          {getHeaderCell(header.id, greenList)}
                        </td>
                      )
                  )}
                  <td>
                    <div className="action-icons justify-content-space-between">
                      <QuestionAnswerIcon onClick={() => NotesModal(greenList)} />
                      {props.role === "admin" && (
                        <EditIcon
                          className="icon editIcon"
                          onClick={() => editModal(greenList)}
                        />
                      )}
                      {props.role === "admin" && (
                        <ArchiveIcon
                          className=""
                          onClick={() => deleteGreenList(greenList)
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
