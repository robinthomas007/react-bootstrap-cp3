import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import axios from "axios";
import { greenListReducer, greenListInitialState } from "./Reducer/greenListReducer";
import GreenListDataGrid from "./GreenListDataGrid";
import ClearIcon from "@mui/icons-material/Clear";
import FilterModal from "./Modals/FilterModal";
import NotesModal from "./../Common/Modals/NotesModal";
import Loader from "./../Common/loader";
import Badge from "react-bootstrap/Badge";
import { BASE_URL } from "../../App";
import getCookie from "../Common/cookie";
import { toast } from "react-toastify";
import { useAuth } from "./../../Context/authContext";
import Search from './../Search/search'
import { GREEN_LIST_TITLES } from './../Common/staticDatas';
import EditBulkModal from "./Modals/EditBulkModal"

import { isSessionExpired } from "./../Common/Utils";
import { useLocation } from 'react-router-dom';

type notesPropTypes = {
  greenListId?: number;
  account?: any
};

type LocationState = {
  notificationId: number
};

const GreenList = () => {
  const [state, dispatch] = React.useReducer(greenListReducer, greenListInitialState);
  const [search, setSearch] = React.useState("");
  const [openFilter, setOpenFilter] = React.useState(false);
  const [openNotes, setOpenNotes] = React.useState(false);
  const [selectedFilters, setSelectedFilters] = React.useState<any>({});
  const [selectedNotes, setSelectedNotes] = React.useState<notesPropTypes>({});
  const [showCreate, setShowCreate] = React.useState(false);
  const [editParams, setEditParams] = React.useState([]);
  const [csvData, setcsvData] = React.useState([]);
  const auth = useAuth();
  const location = useLocation()

  const notificationId = (location.state as LocationState)?.notificationId;

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

      dispatch({ type: "FETCH_REQUEST", payload: '' });
      axios
        .get(BASE_URL + "GreenListSearch", {
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
            types: filter.type ? getIds(filter.type) : "",
            source: filter.source ? getIds(filter.source) : "",
            EndFrom: filter.EndFrom,
            IsExpired: filter.is_expired,
            EndTo: filter.EndTo,
            updatedTo: filter.updatedTo,
            updatedFrom: filter.updatedFrom,
            isExport: isExport ? true : false,
            tableSearch: tableSearch,
            notificationId: notificationId ? notificationId : null
          },
          headers: {
            cp3_auth: getCookie("cp3_auth"),
          },
        })
        .then((res) => {
          if (res.data.isExport) {
            setcsvData(res.data.greenList);
            dispatch({ type: "EXPORT_END", payload: "" });
          } else {
            dispatch({ type: "FETCH_SUCCESS", payload: res.data });
          }
        })
        .catch((err) => {
          dispatch({ type: "FETCH_FAILURE", payload: err.Message });
          console.log("error feching data", err);
          isSessionExpired(err)
        });
    },
    [state.searchCriteria, notificationId]
  );

  React.useEffect(() => {
    const isExport = false;
    getSearchPageData(isExport);
  }, [getSearchPageData]);


  const onSortModelChange = (data: any[]) => {
    dispatch({ type: "SORT_CHANGE", payload: data });
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

  const onFilterColumnSearch = (searchTerm: string) => {
    dispatch({
      type: "SET_SEARCH_TABLE",
      payload: {
        tableSearch: searchTerm,
        searchTerm: state.searchCriteria.searchTerm,
        filter: state.searchCriteria.filter
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

  const clearFilter = (name: string, label?: string) => {
    let filterValues = selectedFilters;
    if (!label) {
      delete filterValues[name];
    } else {
      if (name === 'searchWithins') {
        filterValues[name] = filterValues[name].filter((val: any, key: number) => val !== label)

      } else {
        filterValues[name] = filterValues[name].filter((val: any, key: number) => val.name !== label)
      }
      if (filterValues[name].length === 0) {
        delete filterValues[name];
      }
    }
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
    if (window.confirm("Are you sure to delete this GreenList?"))
      axios
        .delete(BASE_URL + 'GreenList/DeleteGreenList', {
          data: {
            trackIds: ids,
          },
          headers: {
            cp3_auth: getCookie("cp3_auth"),
          },
        })
        .then((res: any) => {
          if (res) {
            toast.success("GreenList details deleted successfully!", {
              autoClose: 3000,
              closeOnClick: true,
            });
            dispatch({ type: "DELETE_SUCCESS", payload: ids });
          } else {
            toast.error("Error deleting GreenList details", {
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

  const selectedFilterKeys = Object.keys(selectedFilters);

  const renderBadge = (selectedLabel: any, item: string, labelName: string) => {
    return <span className=""> {labelName} : &nbsp;
      {selectedLabel.map((label: string, i: number) => {
        return <Badge pill bg="secondary" key={i}>
          <span> {label} </span>
          <ClearIcon
            className="fltr-bdg-cls-icon"
            onClick={() => clearFilter(item, label)}
          />
        </Badge>
      })}
    </span>
  }

  const renderSelectedFilters = () => {
    const labelObj: any = {
      EndFrom: "End From",
      EndTo: "End To",
      updatedFrom: "Updated From",
      updatedTo: "Updated To",
    };
    const dateLabelsArr = [
      "EndFrom",
      "EndTo",
      "updatedFrom",
      "updatedTo",
    ];
    return selectedFilterKeys.map((item, index) => {
      if (item === "is_expired") {
        return (
          <span className="">
            {" "}
            {labelObj[item]} : &nbsp;
            <Badge pill bg="secondary" key={index}>
              <span>
                {" "}
                {selectedFilters[item] && "Expired"}{" "}
              </span>
              <ClearIcon
                className="fltr-bdg-cls-icon"
                onClick={() => clearFilter(item)}
              />
            </Badge>
          </span>
        );
      }
      if (dateLabelsArr.includes(item)) {
        return <span className=""> {labelObj[item]} : &nbsp;
          <Badge pill bg="secondary" key={index}>
            <span> {selectedFilters[item]} </span>
            <ClearIcon
              className="fltr-bdg-cls-icon"
              onClick={() => clearFilter(item)}
            />
          </Badge>
        </span>
      }
      if (item === "labelIds") {
        const selectedLabel = selectedFilters[item].map(
          (label: any) => label.name
        );
        if (selectedLabel.length > 0)
          return renderBadge(selectedLabel, item, 'Label')

      }
      if (item === "type") {
        const selectedType = selectedFilters[item].map(
          (type: any) => type.name
        );
        if (selectedType.length > 0)
          return renderBadge(selectedType, item, 'Type')

      }
      if (item === "searchWithins") {
        if (selectedFilters[item].length > 0)
          return renderBadge(selectedFilters[item], item, 'Search with in')
      }
      return null;

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
        />
      )}
      {openNotes && (
        <NotesModal
          labelFacets={state.labelFacets}
          show={openNotes}
          handleClose={() => setOpenNotes(false)}
          selectedNotes={selectedNotes}
          source="Feedback"
          sourceId={selectedNotes.greenListId}
          heading={selectedNotes.account}
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
          editParams={editParams}
          getSearchPageData={getSearchPageData}
          policyFacets={state.policyFacets}
        />
      )}
      <Search
        openFilterModal={openFilterModal}
        selectedFilterKeys={selectedFilterKeys}
        selectedFilters={selectedFilters}
        renderSelectedFilters={renderSelectedFilters}
        openCreateModal={openCreateModal}
        exportData={exportData}
        CSV_HEADERS={GREEN_LIST_TITLES}
        csvData={csvData}
        state={state}
        dispatch={dispatch}
        handleChange={handleChange}
        setSearchTerm={setSearchTerm}
        clearSearch={clearSearch}
        search={search}
        placeholder="Search on Artist, Account, Label or URL"
      />
      <Container fluid className="search-table">
        <Row className="justify-content-md-center">
          <GreenListDataGrid
            loading={state.loading}
            greenList={state.greenList}
            limit={state.limit}
            height={state.height}
            totalPages={state.totalPages}
            totalItems={state.totalItems}
            pageNumber={state.pageNumber}
            onSortModelChange={onSortModelChange}
            openNotesModal={openNotesModal}
            dispatch={dispatch}
            // clearSearch={clearSearch}
            openCreateModal={openCreateModal}
            deleteTrack={deleteTrack}
            onFilterColumnSearch={onFilterColumnSearch}
            role={auth.user.role}
            TITLES={GREEN_LIST_TITLES}
          />
        </Row>
      </Container>
    </Container>
  );
};

export default GreenList;
