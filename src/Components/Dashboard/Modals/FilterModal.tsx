import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from '../../Common/button'
import CloseIcon from '@mui/icons-material/Close';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import SelectField from './../../Common/select'

type selectedFiltersProps = {
  searchWithins: Array<string>,
  labelIds: Array<object>,
  policy: Array<object>,
  leakFrom: string,
  leakTo: string,
  releaseFrom: string,
  releaseTo: string
}

type filterProps = {
  show: boolean;
  handleSubmit: any;
  handleClose: any;
  labelFacets: Array<any>;
  selectedFilters: selectedFiltersProps
  setSelectedFilters: any
}


export default function FilterModal(props: filterProps) {
  const { searchWithins, labelIds, policy, leakFrom, leakTo, releaseFrom, releaseTo } = props.selectedFilters
  const [searchFilter, setSearchFilter] = React.useState<any>(
    {
      searchWithins: searchWithins || ["ALL"],
      labelIds: labelIds || null,
      policy: policy || null,
      leakFrom: leakFrom || null,
      leakTo: leakTo || null,
      releaseFrom: releaseFrom || null,
      releaseTo: releaseTo || null
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

  const handleSelectChange = (data: any, name: string) => {
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
              <Col md={2}>
                <Form.Check type='checkbox' disabled={searchFilter.searchWithins.includes('ALL')} checked={searchFilter.searchWithins.includes('ALL')} label="All" id="ALL" onChange={handleChange} />
              </Col>
              <Col md={2}>
                <Form.Check type='checkbox' checked={searchFilter.searchWithins.includes('title')} label="Title" id="title" onChange={handleChange} />
              </Col>
              <Col md={2}>
                <Form.Check type='checkbox' checked={searchFilter.searchWithins.includes('artist')} label="Artist" id="artist" onChange={handleChange} />
              </Col>
              <Col md={2}>
                <Form.Check type='checkbox' checked={searchFilter.searchWithins.includes('isrc')} label="ISRC" id="isrc" onChange={handleChange} />
              </Col>
              <Col md={2}>
                <Form.Check type='checkbox' checked={searchFilter.searchWithins.includes('notes')} label="Notes" id="notes" onChange={handleChange} />
              </Col>
            </Row>
            <Row className="pb-20">
              <Col md={6}>
                <Form.Group controlId="labelIds" className="d-flex align-items-center">
                  <Form.Label className="form-label-width">Label</Form.Label>
                  <SelectField value={labelIds} options={props.labelFacets} isMulti={true} name="labelIds" handleChange={handleSelectChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row className="pb-20">
              <Col md={6}>
                <Form.Group controlId="leakFrom" className="d-flex align-items-center">
                  <Form.Label className="form-label-width">Leak Date</Form.Label>
                  <Form.Control value={leakFrom} type="date" name="leakFrom" placeholder="Leak Date From" onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="leakTo" className="d-flex align-items-center">
                  <Form.Label className="form-label-width">to</Form.Label>
                  <Form.Control value={leakTo} type="date" name="leakTo" placeholder="Leak Date To" onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row className="pb-20">
              <Col md={6}>
                <Form.Group controlId="releaseFrom" className="d-flex align-items-center">
                  <Form.Label className="form-label-width">Release Date</Form.Label>
                  <Form.Control value={releaseFrom} type="date" name="releaseFrom" placeholder="Release From" onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="releaseTo" className="d-flex align-items-center">
                  <Form.Label className="form-label-width">to</Form.Label>
                  <Form.Control value={releaseTo} type="date" name="releaseTo" placeholder="Release To" onChange={handleChange} />
                </Form.Group>
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
