import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from '../../Common/button'
import CloseIcon from '@mui/icons-material/Close';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import SelectField from './../../Common/select'
import Datepicker from './../../Common/DatePicker'
import { SOURCE_LIST, RIGHTS_LIST } from './../../Common/staticDatas'
import MultiSelectHierarchy from './../../Common/treeSelect/multiSelectHierarchy'
import { sortArrayByName } from './../../Common/Utils'

type selectedFiltersProps = {
  searchWithins: Array<string>,
  labelIds: Array<object>,
  policy: Array<object>,
  leakFrom: string,
  leakTo: string,
  releaseFrom: string,
  releaseTo: string,
  updatedFrom: string,
  updatedTo: string,
  policyIds: Array<object>,
  source: Array<object>,
  pre_releasese: boolean,
  RightsIds: Array<object>,
}

type filterProps = {
  show: boolean;
  handleSubmit: any;
  handleClose: any;
  labelFacets: Array<any>;
  policyFacets: Array<any>;
  guardianPolicyFacets: Array<any>;
  selectedFilters: selectedFiltersProps;
  setSelectedFilters: any;
}


export default function FilterModal(props: filterProps) {
  const { searchWithins, labelIds, policy, leakFrom, leakTo, releaseFrom, releaseTo, policyIds, source, updatedFrom, updatedTo, pre_releasese, RightsIds } = props.selectedFilters

  const [searchFilter, setSearchFilter] = React.useState<any>(
    {
      searchWithins: searchWithins || ["ALL"],
      labelIds: labelIds || null,
      policy: policy || null,
      leakFrom: leakFrom || null,
      leakTo: leakTo || null,
      releaseFrom: releaseFrom || null,
      releaseTo: releaseTo || null,
      updatedFrom: updatedFrom || null,
      updatedTo: updatedTo || null,
      policyIds: policyIds || null,
      source: source || null,
      RightsIds: RightsIds || null,
      pre_releasese: pre_releasese || false
    }
  );

  const handleChange = (e: React.ChangeEvent<any>) => {
    if (e.target.type === 'checkbox') {
      let arr = searchFilter.searchWithins
      if (e.target.checked) {
        if (e.target.id === 'ALL') {
          arr = []
        } else {
          let index = arr.indexOf('ALL');
          if (index !== -1) {
            arr.splice(index, 1);
          }
        }
        arr.push(e.target.id)
      } else {
        arr = arr.filter(function (item: string) {
          return item !== e.target.id
        })
        if (arr.length === 0) {
          arr.push('ALL')
        }
      }
      setSearchFilter({ ...searchFilter, searchWithins: arr });
    } else {
      setSearchFilter({ ...searchFilter, [e.target.id]: e.target.value });
    }
    props.setSelectedFilters({})
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const filterdItems = Object.entries(searchFilter).reduce((a: any, [k, v]) => (v ? (a[k] = v, a) : a), {})
    props.handleSubmit(filterdItems)
  }

  const handleSelectChange = (data: any, e: any, name: string) => {
    setSearchFilter({ ...searchFilter, [name]: data.length > 0 ? data : null });
  }

  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      backdrop="static"
      keyboard={false}
      size="lg"
      className="filter-modal-wrapper"
    >
      <Modal.Header>
        <Modal.Title>Search Filters</Modal.Title>
        <CloseIcon fontSize="inherit" className="modal-cls-btn" onClick={props.handleClose} />
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Form>
            <Row className="pb-20">
              <Col md={2}>
                <label>Search Within </label>
              </Col>
              <Col>
                <Form.Check type='checkbox' disabled={searchFilter.searchWithins.includes('ALL')} checked={searchFilter.searchWithins.includes('ALL')} label="All" id="ALL" onChange={handleChange} />
              </Col>
              <Col>
                <Form.Check type='checkbox' checked={searchFilter.searchWithins.includes('title')} label="Title" id="title" onChange={handleChange} />
              </Col>
              <Col>
                <Form.Check type='checkbox' checked={searchFilter.searchWithins.includes('artist')} label="Artist" id="artist" onChange={handleChange} />
              </Col>
              <Col>
                <Form.Check type='checkbox' checked={searchFilter.searchWithins.includes('isrc')} label="ISRC" id="isrc" onChange={handleChange} />
              </Col>
              <Col>
                <Form.Check type='checkbox' checked={searchFilter.searchWithins.includes('notes')} label="Notes" id="notes" onChange={handleChange} />
              </Col>
              <Col>
                <Form.Check type='checkbox' checked={searchFilter.searchWithins.includes('album')} label="Album" id="album" onChange={handleChange} />
              </Col>
            </Row>
            <Row className="pb-20">

            </Row>
            <Row className="pb-20">
              <Col md={6}>

                <Form.Group controlId="labelIds" className="d-flex align-items-center">
                  <Form.Label className="form-label-width">Label</Form.Label>
                  <MultiSelectHierarchy
                    handleChangeCheckbox={(data: any) => setSearchFilter({ ...searchFilter, labelIds: data.length > 0 ? data : null })}
                    type={'requestFormInput'}
                    isMultiSelect={true}
                    isAdmin={true}
                    selectedLabelIds={searchFilter.labelIds ? searchFilter.labelIds : []}
                    releasingLabels={[]}
                  />
                  {/* <SelectField value={searchFilter.labelIds} options={props.labelFacets} isMulti={true} name="labelIds" handleChange={handleSelectChange} />*/}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="policyIds" className="d-flex align-items-center">
                  <Form.Label className="form-label-width">Policy</Form.Label>
                  <SelectField value={searchFilter.policyIds} options={sortArrayByName(props.policyFacets.concat(props.guardianPolicyFacets))} isMulti={true} name="policyIds" handleChange={handleSelectChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row className="pb-20">
              <Col md={6}>
                <Form.Group controlId="source" className="d-flex align-items-center">
                  <Form.Label className="form-label-width">Source</Form.Label>
                  <SelectField value={searchFilter.source} options={SOURCE_LIST} isMulti={true} name="source" handleChange={handleSelectChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="RightsIds" className="d-flex align-items-center">
                  <Form.Label className="form-label-width">Rights</Form.Label>
                  <SelectField value={searchFilter.RightsIds} options={RIGHTS_LIST} isMulti={true} name="RightsIds" handleChange={handleSelectChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row className="pb-20">
              <Col md={6}>
                <Form.Group controlId="labelIds" className="d-flex align-items-center">
                  <Form.Label className="form-label-width"></Form.Label>
                  <Form.Check type='checkbox' checked={searchFilter.pre_releasese} label="Pre Release Only" id="pre_release" onChange={(e) => {
                    setSearchFilter({ ...searchFilter, pre_releasese: e.target.checked })
                  }} />
                </Form.Group>
              </Col>
            </Row>
            <Row className="pb-20">
              <Col md={10} className="d-flex">
                <div>
                  <Form.Group controlId="leakFrom" className="d-flex align-items-center">
                    <Form.Label className="form-label-width">Leak Date</Form.Label>
                    <Datepicker selected={searchFilter.leakFrom} handleDateChange={(date: string) => {
                      setSearchFilter({ ...searchFilter, leakFrom: date })
                    }} />
                  </Form.Group>
                </div>
                <div>
                  <Form.Group controlId="leakTo" className="d-flex align-items-center">
                    <Form.Label className="form-label-sm-width">to</Form.Label>
                    <Datepicker selected={searchFilter.leakTo} handleDateChange={(date: string) => {
                      setSearchFilter({ ...searchFilter, leakTo: date })
                    }} />
                  </Form.Group>
                </div>
              </Col>
            </Row>
            <Row className="pb-20">
              <Col md={12} className="d-flex align-items-center">
                <div>
                  <Form.Group controlId="releaseFrom" className="d-flex align-items-center">
                    <Form.Label className="form-label-width">Release Date</Form.Label>
                    <Datepicker selected={searchFilter.releaseFrom} handleDateChange={(date: string) => {
                      setSearchFilter({ ...searchFilter, releaseFrom: date })
                    }} />
                  </Form.Group>
                </div>
                <div>
                  <Form.Group controlId="releaseTo" className="d-flex align-items-center">
                    <Form.Label className="form-label-sm-width">to</Form.Label>
                    <Datepicker selected={searchFilter.releaseTo} handleDateChange={(date: string) => {
                      setSearchFilter({ ...searchFilter, releaseTo: date })
                    }} />
                  </Form.Group>
                </div>
              </Col>
            </Row>
            <Row className="pb-20">
              <Col md={10} className="d-flex">
                <div>
                  <Form.Group controlId="updatedFrom" className="d-flex align-items-center">
                    <Form.Label className="form-label-width">Updated Date</Form.Label>
                    <Datepicker selected={searchFilter.updatedFrom} handleDateChange={(date: string) => {
                      setSearchFilter({ ...searchFilter, updatedFrom: date })
                    }} />
                  </Form.Group>
                </div>
                <div>
                  <Form.Group controlId="updatedTo" className="d-flex align-items-center">
                    <Form.Label className="form-label-sm-width">to</Form.Label>
                    <Datepicker selected={searchFilter.updatedTo} handleDateChange={(date: string) => {
                      setSearchFilter({ ...searchFilter, updatedTo: date })
                    }} />
                  </Form.Group>
                </div>
              </Col>
            </Row>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button label='Apply' handleClick={handleSubmit} className="text-white" variant="secondary" />
        <Button label='Cancel' handleClick={props.handleClose} variant="light" />
      </Modal.Footer>
    </Modal >
  )
}
