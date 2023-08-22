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
import { GREEN_LIST_TYPES } from './../../Common/staticDatas'
import MultiSelectHierarchy from './../../Common/treeSelect/multiSelectHierarchy'

type selectedFiltersProps = {
  searchWithins: Array<string>,
  labelIds: Array<object>,
  EndFrom: string,
  EndTo: string,
  updatedFrom: string,
  updatedTo: string,
  type: string,
  source: Array<object>,
}

type filterProps = {
  show: boolean;
  handleSubmit: any;
  handleClose: any;
  labelFacets: Array<any>;
  selectedFilters: selectedFiltersProps;
  setSelectedFilters: any;
}


export default function FilterModal(props: filterProps) {
  const { searchWithins, labelIds, EndFrom, EndTo, updatedFrom, updatedTo, type } = props.selectedFilters

  const [searchFilter, setSearchFilter] = React.useState<any>(
    {
      searchWithins: searchWithins || ["ALL"],
      labelIds: labelIds || null,
      EndFrom: EndFrom || null,
      EndTo: EndTo || null,
      updatedFrom: updatedFrom || null,
      updatedTo: updatedTo || null,
      type: type || null
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
              <Col>
                <label>Search Within </label>
              </Col>
              <Col>
                <Form.Check type='checkbox' disabled={searchFilter.searchWithins.includes('ALL')} checked={searchFilter.searchWithins.includes('ALL')} label="All" id="ALL" onChange={handleChange} />
              </Col>
              <Col>
                <Form.Check type='checkbox' checked={searchFilter.searchWithins.includes('account')} label="Account" id="account" onChange={handleChange} />
              </Col>
              <Col>
                <Form.Check type='checkbox' checked={searchFilter.searchWithins.includes('artist')} label="Artist" id="artist" onChange={handleChange} />
              </Col>
              <Col>
                <Form.Check type='checkbox' checked={searchFilter.searchWithins.includes('accountManager')} label="Manager" id="accountManager" onChange={handleChange} />
              </Col>
              <Col>
                <Form.Check type='checkbox' checked={searchFilter.searchWithins.includes('contact')} label="Contact" id="contact" onChange={handleChange} />
              </Col>
              <Col>
                <Form.Check type='checkbox' checked={searchFilter.searchWithins.includes('url')} label="URL" id="url" onChange={handleChange} />
              </Col>
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
                  {/* <SelectField value={searchFilter.labelIds} options={props.labelFacets} isMulti={true} name="labelIds" handleChange={handleSelectChange} /> */}
                </Form.Group>
              </Col>
            </Row>
            <Row className="pb-20">
              <Col md={6}>
                <Form.Group controlId="type" className="d-flex align-items-center">
                  <Form.Label className="form-label-width">Type</Form.Label>
                  <SelectField value={searchFilter.type} options={GREEN_LIST_TYPES} isMulti={true} name="type" handleChange={handleSelectChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="is_expired" className="d-flex align-items-center">
                  <Form.Label className="form-label-width"></Form.Label>
                  <Form.Check type='checkbox' checked={searchFilter.is_expired} label="Expired Records" id="is_expired" onChange={(e) => {
                    setSearchFilter({ ...searchFilter, is_expired: e.target.checked })
                  }} />
                </Form.Group>
              </Col>
            </Row>
            <Row className="pb-20">
              <Col md={10} className="d-flex">
                <div>
                  <Form.Group controlId="EndFrom" className="d-flex align-items-center">
                    <Form.Label className="form-label-width">End Date</Form.Label>
                    <Datepicker selected={searchFilter.EndFrom} handleDateChange={(date: string) => {
                      setSearchFilter({ ...searchFilter, EndFrom: date })
                    }} />
                  </Form.Group>
                </div>
                <div>
                  <Form.Group controlId="EndTo" className="d-flex align-items-center">
                    <Form.Label className="form-label-sm-width">to</Form.Label>
                    <Datepicker selected={searchFilter.EndTo} handleDateChange={(date: string) => {
                      setSearchFilter({ ...searchFilter, EndTo: date })
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
