import React from 'react'
import Spinner from 'react-bootstrap/Spinner'

export default function Loader() {
  return (
    <div role="dialog" aria-modal="true" className="fade modal-backdrop show text-center">
      <Spinner animation="border" variant="secondary" className="loader-icon" />
    </div>
  )
}
