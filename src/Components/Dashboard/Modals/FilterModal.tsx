import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from '../../Common/button'
import CloseIcon from '@mui/icons-material/Close';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

type selectedFiltersProps = {
  searchWithins: Array<string>,
  label: number,
  policy: number,
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

const options = [
  { name: "One", id: 1 },
  { name: "Two", id: 2 },
  { name: "Three", id: 3 },
  { name: "four", id: 4 }
];

export default function FilterModal(props: filterProps) {
  const { searchWithins, label, policy, leakFrom, leakTo, releaseFrom, releaseTo } = props.selectedFilters
  const [searchFilter, setSearchFilter] = React.useState<any>(
    {
      searchWithins: searchWithins || ["ALL"],
      label: label || '',
      policy: policy || '',
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
        arr.push(e.target.id)
      } else {
        arr = arr.filter(function (item: string) {
          return item !== e.target.id
        })
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

  return (
    <Modal
      show={props.show}
      onHide={props.handleClose}
      backdrop="static"
      keyboard={false}
      size="lg"
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
                <Form.Check type='checkbox' checked={searchFilter.searchWithins.includes('ALL')} label="All" id="ALL" onChange={handleChange} />
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
                <Form.Group controlId="label" className="d-flex align-items-center">
                  <Form.Label className="form-label-width">Label</Form.Label>
                  <Form.Select value={searchFilter.label} onChange={handleChange}>
                    {props.labelFacets.map((o) => {
                      const { name, id } = o;
                      return <option value={id} key={id}>{name}</option>;
                    })}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row className="pb-20">
              <Col md={6}>
                <Form.Group controlId="policy" className="d-flex align-items-center">
                  <Form.Label className="form-label-width">Policy</Form.Label>
                  <Form.Select value={searchFilter.policy} onChange={handleChange}>
                    {options.map((o) => {
                      const { name, id } = o;
                      return <option value={id} key={id}>{name}</option>;
                    })}
                  </Form.Select>
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
        <Button label='Cancel' handleClick={props.handleClose} variant="primary" />
      </Modal.Footer>
    </Modal >
  )
}
