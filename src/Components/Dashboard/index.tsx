import React from "react";
import Button from "../Common/button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { InputGroup, FormControl } from "react-bootstrap";
import SettingsIcon from "@mui/icons-material/Settings";
import axios from "axios";
import { reducer, initialState } from "./searchReducer";
import ProjectSearchDataGrid from "./ProjectSearchDataGrid";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Pagination from "@mui/material/Pagination";
import ClearIcon from "@mui/icons-material/Clear";
import Form from "react-bootstrap/Form";
import FilterModal from "./Modals/FilterModal";
import NotesModal from "./Modals/NotesModal";
// import CreateModal from "./Modals/CreateModal"
import EditBulkModal from "./Modals/EditBulkModal";
import SearchIcon from "@mui/icons-material/Search";
import Loader from "./../Common/loader";
import Badge from "react-bootstrap/Badge";
import "./dashboard.css";
import { BASE_URL } from "../../App";
import getCookie from "../Common/cookie";
import { toast } from "react-toastify";
import { useAuth } from "./../../Context/authContext";
import { useLocation } from 'react-router-dom';

// @ts-ignore
import { CSVLink } from "react-csv";
import { CSV_HEADERS } from "../Common/staticDatas";

type notesPropTypes = {
  trackId?: number;
};

const Dashboard = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [search, setSearch] = React.useState("");
  const [openFilter, setOpenFilter] = React.useState(false);
  const [openNotes, setOpenNotes] = React.useState(false);
  const [selectedFilters, setSelectedFilters] = React.useState<any>({});
  const [selectedNotes, setSelectedNotes] = React.useState<notesPropTypes>({});
  const [showCreate, setShowCreate] = React.useState(false);
  const [editParams, setEditParams] = React.useState([]);
  const [csvData, setcsvData] = React.useState([]);
  const csvLink = React.createRef<any>();
  const auth = useAuth();

  const location = useLocation()

  const PAGE_PATH = location.pathname === '/first_seen' ? 'FIRST_SEEN' : 'DASHBOARD'

  const getSearchPageData = React.useCallback(
    (isExport: any) => {
      const {
        searchTerm,
        itemsPerPage,
        pageNumber,
        sortColumn,
        sortOrder,
        filter,
      } = state.searchCriteria;
      const SUB_URL = PAGE_PATH === 'DASHBOARD' ? 'TrackSearch' : 'TrackLeaksSearch'
      dispatch({ type: "FETCH_REQUEST", payload: '' });
      axios
        .get(BASE_URL + SUB_URL, {
          params: {
            searchTerm: searchTerm,
            itemsPerPage: isExport ? "" : itemsPerPage,
            pageNumber: isExport ? "" : pageNumber,
            sortColumn: sortColumn,
            sortOrder: sortOrder,
            searchWithins: filter.searchWithins
              ? filter.searchWithins.toString()
              : "ALL",
            labelIds: filter.labelIds ? getIds(filter.labelIds) : "",
            policyIds: filter.policyIds ? getIds(filter.policyIds) : "",
            source: filter.source ? getIds(filter.source) : "",
            releaseFrom: filter.releaseFrom,
            releaseTo: filter.releaseTo,
            leakFrom: filter.leakFrom,
            leakTo: filter.leakTo,
            updatedTo: filter.updatedTo,
            updatedFrom: filter.updatedFrom,
            isExport: isExport ? true : false,
          },
          headers: {
            cp3_auth: getCookie("cp3_auth"),
          },
        })
        .then((res) => {
          if (res.data.isExport) {
            setcsvData(res.data.tracks);
            dispatch({ type: "EXPORT_END", payload: "" });
          } else {
            dispatch({ type: "FETCH_SUCCESS", payload: res.data });
          }
        })
        .catch((err) => {
          dispatch({ type: "FETCH_FAILURE", payload: err.Message });
          console.log("error feching data", err);
        });
    },
    [state.searchCriteria, PAGE_PATH]
  );

  React.useEffect(() => {
    const isExport = false;
    getSearchPageData(isExport);
  }, [getSearchPageData]);

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "CHANGE_LIMIT", payload: event.target.value });
  };
  const onSortModelChange = (data: any[]) => {
    dispatch({ type: "SORT_CHANGE", payload: data });
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    dispatch({ type: "PAGE_CHANGE", payload: { pageNumber: pageNumber } });
  };

  const setSearchTerm = (searchTerm: string) => {
    dispatch({
      type: "SET_SEARCH",
      payload: {
        searchTerm: searchTerm,
        filter: { searchWithins: selectedFilters["searchWithins"] || ["ALL"] },
      },
    });
  };

  const onFilterColumnSearch = (searchTerm: string, searchWithins: string) => {
    dispatch({
      type: "SET_SEARCH",
      payload: {
        searchTerm: searchTerm,
        filter: { searchWithins: [searchWithins] },
      },
    });
  };

  const handleFlterModalSubmit = (filterValues: any) => {
    setSelectedFilters(filterValues);
    dispatch({
      type: "SET_FILTER",
      payload: { filter: filterValues, searchTerm: search },
    });
    setOpenFilter(false);
  };

  const clearFilter = (name: string) => {
    let filterValues = selectedFilters;
    delete filterValues[name];
    setSelectedFilters(filterValues);
    dispatch({ type: "SET_FILTER", payload: { filter: filterValues } });
  };

  const getIds = (data: any) => {
    let res = data.map((item: any) => item.id);
    return res.toString();
  };

  const clearSearch = () => {
    setSearch("");
    setSearchTerm("");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const openFilterModal = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOpenFilter(true);
  };

  const openCreateModal = (track: any) => {
    if (track.length > 0) {
      setEditParams(track);
    }
    setShowCreate(true);
  };

  const deleteTrack = (ids: Array<any>) => {
    if (window.confirm("Are you sure to delete this track?"))
      axios
        .delete(BASE_URL + "Track/DeleteTrack", {
          data: {
            trackIds: ids,
          },
          headers: {
            cp3_auth: getCookie("cp3_auth"),
          },
        })
        .then((res: any) => {
          if (res) {
            toast.success("Track details deleted successfully!", {
              autoClose: 3000,
              closeOnClick: true,
            });
            dispatch({ type: "DELETE_SUCCESS", payload: ids });
          } else {
            toast.error("Error deleting Track details", {
              autoClose: 3000,
              closeOnClick: true,
            });
          }
        })
        .catch((err) => {
          console.log("error feching data", err);
        });
  };

  const openNotesModal = (row: object) => {
    setOpenNotes(true);
    setSelectedNotes(row);
  };

  const exportData = () => {
    getSearchPageData(true);
    dispatch({ type: "EXPORT_START", payload: "" });
  };

  React.useEffect(() => {
    if (csvData.length > 0 && csvLink) {
      csvLink.current.link.click();
    }
  }, [csvData]);

  const selectedFilterKeys = Object.keys(selectedFilters);

  const renderSelectedFilters = () => {
    const labelObj: any = {
      releaseFrom: "Release From",
      releaseTo: "Release To",
      leakFrom: "Leak From",
      leakTo: "Leak To",
      updatedFrom: "Updated From",
      updatedTo: "Updated To",
    };
    const dateLabelsArr = [
      "releaseFrom",
      "releaseTo",
      "leakFrom",
      "leakTo",
      "updatedFrom",
      "updatedTo",
    ];
    return selectedFilterKeys.map((item, index) => {
      let content = null;
      if (dateLabelsArr.includes(item)) {
        content = (
          <span>
            {" "}
            {labelObj[item]} : {selectedFilters[item]}{" "}
          </span>
        );
      }
      if (item === "labelIds") {
        const selectedLabel = selectedFilters[item].map(
          (label: any) => label.name
        );
        if (selectedLabel.length > 0)
          content = (
            <span> Labels : {selectedLabel && selectedLabel.toString()} </span>
          );
      }
      if (item === "source") {
        const selectedSource = selectedFilters[item].map(
          (label: any) => label.name
        );
        if (selectedSource.length > 0)
          content = (
            <span>
              {" "}
              Source : {selectedSource && selectedSource.toString()}{" "}
            </span>
          );
      }
      if (item === "policyIds") {
        const selectedPolicy = selectedFilters[item].map(
          (policy: any) => policy.name
        );
        if (selectedPolicy.length > 0)
          content = (
            <span>
              {" "}
              Policy : {selectedPolicy && selectedPolicy.toString()}{" "}
            </span>
          );
      }
      if (item === "searchWithins") {
        if (selectedFilters[item].length > 0)
          content = (
            <span> Search with in : {selectedFilters[item].toString()} </span>
          );
      }
      if (!content) {
        return null;
      }
      return (
        <Badge pill bg="secondary" key={index}>
          {content}
          <ClearIcon
            className="fltr-bdg-cls-icon"
            onClick={() => clearFilter(item)}
          />
        </Badge>
      );
    });
  };

  return (
    <Container fluid className="dashboard-wrapper">
      {state.loading && <Loader />}
      {openFilter && (
        <FilterModal
          labelFacets={state.labelFacets}
          show={openFilter}
          handleClose={() => setOpenFilter(false)}
          handleSubmit={handleFlterModalSubmit}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          policyFacets={state.policyFacets}
        />
      )}
      {openNotes && (
        <NotesModal
          labelFacets={state.labelFacets}
          show={openNotes}
          handleClose={() => setOpenNotes(false)}
          selectedNotes={selectedNotes}
        />
      )}
      {showCreate && (
        <EditBulkModal
          labelFacets={state.labelFacets}
          show={showCreate}
          handleClose={() => {
            setShowCreate(false);
            setEditParams([]);
          }}
          PAGE_PATH={PAGE_PATH}
          editParams={editParams}
          getSearchPageData={getSearchPageData}
          policyFacets={state.policyFacets}
        />
      )}
      <Container fluid className="fixed-search">
        <Row className="justify-content-md-center min-row-ht-100 mt-5">
          <Col md={4} className="align-item-center align-items-center ">
            <InputGroup>
              <Button
                handleClick={openFilterModal}
                variant="light"
                label={<SettingsIcon />}
                className="mr-btn no-border-rd"
              />
              <SearchIcon className="txt-fld-search-icon" />
              <FormControl
                value={search}
                aria-label="search value"
                onChange={handleChange}
                className="txt-fld-search-main"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    setSearchTerm(search);
                  }
                }}
              />
              {search && (
                <ClearIcon className="close-icon" onClick={clearSearch} />
              )}
              <Button
                handleClick={() => setSearchTerm(search)}
                variant="secondary"
                label="Search"
                className="text-white"
              />
            </InputGroup>
            {selectedFilterKeys.length > 0 && (
              <div className="selected-filter-wrapper">
                <label>Selected Filters: </label>
                {renderSelectedFilters()}
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
                    handleClick={openCreateModal}
                    variant="light"
                    startIcon={<AddCircleIcon />}
                    label="Create"
                    className=""
                  />
                )}
                <Button
                  handleClick={exportData}
                  variant="light"
                  startIcon={<FileDownloadIcon />}
                  label={state.exportLoading ? "Exporting" : "Export"}
                  className=""
                />
                <CSVLink
                  data={csvData}
                  headers={CSV_HEADERS}
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
      <Container fluid className="search-table">
        <Row className="justify-content-md-center">
          <ProjectSearchDataGrid
            loading={state.loading}
            tracks={state.tracks}
            limit={state.limit}
            height={state.height}
            totalPages={state.totalPages}
            totalItems={state.totalItems}
            pageNumber={state.pageNumber}
            onSortModelChange={onSortModelChange}
            openNotesModal={openNotesModal}
            dispatch={dispatch}
            clearSearch={clearSearch}
            openCreateModal={openCreateModal}
            deleteTrack={deleteTrack}
            onFilterColumnSearch={onFilterColumnSearch}
            role={auth.user.role}
          />
        </Row>
      </Container>
    </Container>
  );
};

export default Dashboard;
