import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import axios from "axios";
import { reducer, initialState } from "./Reducer/greenListReducer";
import GreenListDataGrid from "./GreenListDataGrid";
import ClearIcon from "@mui/icons-material/Clear";
import FilterModal from "./Modals/FilterModal";
import NotesModal from "./Modals/NotesModal";
import Loader from "./../Common/loader";
import Badge from "react-bootstrap/Badge";
import { BASE_URL } from "../../App";
import getCookie from "../Common/cookie";
import { toast } from "react-toastify";
import { useAuth } from "./../../Context/authContext";
import Search from './../Search/search'
import { GREEN_LIST_TITLES } from './../Common/staticDatas';
import CreateModal from "./Modals/CreateModal"

type notesPropTypes = {
  greenListId?: number;
};

const GreenList = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [search, setSearch] = React.useState("");
  const [openFilter, setOpenFilter] = React.useState(false);
  const [openNotes, setOpenNotes] = React.useState(false);
  const [selectedFilters, setSelectedFilters] = React.useState<any>({});
  const [selectedNotes, setSelectedNotes] = React.useState<notesPropTypes>({});
  const [showCreate, setShowCreate] = React.useState(false);
  const [editParams, setEditParams] = React.useState([]);
  const [csvData, setcsvData] = React.useState([]);
  const auth = useAuth();

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
            source: filter.source ? getIds(filter.source) : "",
            EndFrom: filter.EndFrom,
            EndTo: filter.EndTo,
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
            setcsvData(res.data.greenList);
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
    [state.searchCriteria]
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
    if (window.confirm("Are you sure to delete this GreenList?"))
      axios
        .delete(BASE_URL + 'GreenList/DeleteGreenList', {
          data: {
            greenListIds: ids,
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
        <CreateModal
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
            clearSearch={clearSearch}
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
