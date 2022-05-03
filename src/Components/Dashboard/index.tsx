import React from 'react'
import Button from '../Common/button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { InputGroup, FormControl } from 'react-bootstrap'
import SettingsIcon from '@mui/icons-material/Settings';
import axios from 'axios';
import { reducer, initialState } from './searchReducer'
import ProjectSearchDataGrid from './ProjectSearchDataGrid'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Pagination from '@mui/material/Pagination';
import ClearIcon from '@mui/icons-material/Clear';
import Form from 'react-bootstrap/Form'
import FilterModal from './Modals/FilterModal'
import NotesModal from './Modals/NotesModal'
import SearchIcon from '@mui/icons-material/Search';
import Loader from './../Common/loader'
import Badge from 'react-bootstrap/Badge'
import './dashboard.css'

type notesPropTypes = {
  trackId?: number
}

const Dashboard = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const [search, setSearch] = React.useState('');
  const [openFilter, setOpenFilter] = React.useState(false);
  const [openNotes, setOpenNotes] = React.useState(false);
  const [selectedFilters, setSelectedFilters] = React.useState<any>({});
  const [selectedNotes, setSelectedNotes] = React.useState<notesPropTypes>({})

  React.useEffect(() => {
    const { searchTerm, itemsPerPage, pageNumber, sortColumn, sortOrder, filter } = state.searchCriteria
    axios.get('https://api.dev.cp3.umgapps.com/api/TrackSearch', {
      params: {
        'SearchCriteria.searchTerm': searchTerm,
        'SearchCriteria.itemsPerPage': itemsPerPage,
        'SearchCriteria.pageNumber': pageNumber,
        'SearchCriteria.sortColumn': sortColumn,
        'SearchCriteria.sortOrder': sortOrder,
        'SearchCriteria.filter.searchWithins': filter.searchWithins ? filter.searchWithins.toString() : [],
        'SearchCriteria.filter.labelIds': filter.labelIds ? getIds(filter.labelIds) : [],
        'SearchCriteria.filter.releaseFrom': filter.releaseFrom,
        'SearchCriteria.filter.releaseTo': filter.releaseTo,
        'SearchCriteria.filter.leakFrom': filter.leakFrom,
        'SearchCriteria.filter.leakTo': filter.leakTo,
      },
    }).then(res => {
      dispatch({ type: 'FETCH_SUCCESS', payload: res.data })
    }).catch((err) => {
      dispatch({ type: 'FETCH_FAILURE', payload: err.Message })
      console.log("error feching data", err)
    })
  }, [state.searchCriteria])

  const getIds = (data: any) => {
    let res = data.map((item: any) => (item.id));
    return res.toString()
  }

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'CHANGE_LIMIT', payload: event.target.value })
  }
  const onSortModelChange = (data: any[]) => {
    dispatch({ type: 'SORT_CHANGE', payload: data })
  }

  const handlePageChange = (event: React.ChangeEvent<unknown>, pageNumber: number) => {
    dispatch({ type: 'PAGE_CHANGE', payload: { pageNumber: pageNumber } })
  };

  const setSearchTerm = (searchTerm: string) => {
    dispatch({ type: 'SET_SEARCH', payload: { searchTerm: searchTerm } })
  }

  const clearSearch = () => {
    setSearch('')
    setSearchTerm('')
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const openFilterModal = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOpenFilter(true)
  }

  const openNotesModal = (row: object) => {
    setOpenNotes(true)
    setSelectedNotes(row)
  }

  const handleFilterModalClose = () => {
    setOpenFilter(false)
  }
  const handleNotesModalClose = () => {
    setOpenNotes(false)
  }

  const handleFlterModalSubmit = (filterValues: object) => {
    setSelectedFilters(filterValues)
    dispatch({ type: 'SET_FILTER', payload: { filter: filterValues } })
    setOpenFilter(false)
  }

  const selectedFilterKeys = Object.keys(selectedFilters);

  const clearFilter = (name: string) => {
    let filterValues = selectedFilters
    delete filterValues[name];
    setSelectedFilters(filterValues)
    dispatch({ type: 'SET_FILTER', payload: { filter: filterValues } })
  }

  const renderSelectedFilters = () => {
    const labelObj: any = {
      releaseFrom: 'Release From',
      releaseTo: 'Release To',
      leakFrom: 'Leak From',
      leakTo: 'Leak To'
    }
    return selectedFilterKeys.map((item, index) => {
      let content = null
      if (['releaseFrom', 'releaseTo', 'leakFrom', 'leakTo'].includes(item)) {
        content = <span> {labelObj[item]} : {selectedFilters[item]} </span>
      }
      if (item === 'labelIds') {
        const selectedLabel = selectedFilters[item].map((label: any) => (label.name));
        if (selectedLabel.length > 0)
          content = <span> Labels : {selectedLabel && selectedLabel.toString()} </span>
      }
      if (item === 'policy') {
        const selectedPolicy = selectedFilters[item].map((policy: any) => (policy.name));
        if (selectedPolicy.length > 0)
          content = <span> Policy : {selectedPolicy && selectedPolicy.toString()} </span>
      }
      if (item === 'searchWithins') {
        if (selectedFilters[item].length > 0)
          content = <span> Search with in : {selectedFilters[item].toString()} </span>
      }
      if (!content) {
        return null
      }
      return (
        <Badge pill bg="secondary" key={index}>
          {content}
          <ClearIcon className='fltr-bdg-cls-icon' onClick={() => clearFilter(item)} />
        </Badge>
      )
    });
  };

  return (
    <Container fluid>
      {state.loading && <Loader />}
      <FilterModal
        labelFacets={state.labelFacets}
        show={openFilter}
        handleClose={handleFilterModalClose}
        handleSubmit={handleFlterModalSubmit}
        selectedFilters={selectedFilters}
        setSelectedFilters={setSelectedFilters}
      />
      {openNotes && <NotesModal
        labelFacets={state.labelFacets}
        show={openNotes}
        handleClose={handleNotesModalClose}
        selectedNotes={selectedNotes}
      // setSelectedFilters={setSelectedFilters}
      />}

      <Row className='bg-header-theme text-white justify-content-md-center min-row-ht-100'>
        <Col md={4}>
          <InputGroup>
            <Button handleClick={openFilterModal} variant="light" label={<SettingsIcon />} className='mr-btn no-border-rd' />
            <SearchIcon className="txt-fld-search-icon" />
            <FormControl value={search} aria-label="search value" onChange={handleChange} className="txt-fld-search-main" />
            {search && <ClearIcon className='close-icon' onClick={clearSearch} />}
            <Button handleClick={() => setSearchTerm(search)} variant="secondary" label="search" className="text-white" />
          </InputGroup>
          {selectedFilterKeys.length > 0 &&
            <div className="selected-filter-wrapper">
              <label>Selected Filters: </label>
              {renderSelectedFilters()}
            </div>
          }
        </Col>
      </Row>
      <Row className="pt-20 pb-20 justify-content-md-center">
        <Col md={11}>
          <Row>
            <Col md={2} className="d-flex justify-content-around align-items-center">
              <span>Viewing</span>
              <Form.Control as="select" size="sm" style={{ width: '20%' }} onChange={handleLimitChange}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </Form.Control>
              <span>of {state.totalItems} Results</span>
            </Col>
            <Col md={8} className="d-flex justify-content-center">
              <Pagination
                count={state.totalPages ? Number(state.totalPages) : 0}
                shape="rounded"
                color="primary"
                page={state.pageNumber}
                onChange={handlePageChange}
              />
            </Col>
            <Col md={1}>
              <Button handleClick={() => { }} variant="light" startIcon={<AddCircleIcon />} label="Create" className='' />
            </Col>
            <Col md={1}>
              <Button handleClick={() => { }} variant="light" startIcon={<FileDownloadIcon />} label="Export" className='' />
            </Col>
          </Row >
        </Col>
      </Row >
      <Row className='justify-content-md-center'>
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
        />
      </Row>
    </Container >
  )
}


export default Dashboard