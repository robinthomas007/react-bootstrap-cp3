import React from 'react'
import moment from "moment";
import Popover from "react-bootstrap/Popover";
import CircularProgress from "@mui/material/CircularProgress";

export const notePopover = (notes, loadingNotes) => (
  <Popover id="popover-basic" className="albumList-popover">
    <Popover.Body className="plcy-bdy-pad">
      <div>
        <ul>
          {notes.length === 0 && loadingNotes && (
            <span>
              <CircularProgress size="25px" style={{ color: "#F57F17" }} />
            </span>
          )}
          {notes.length === 0 && !loadingNotes && (
            <span>No Notes Available</span>
          )}
          {notes.map((note, id) => {
            return (
              <li key={id}>
                <span className="notes-name-date">
                  {note.userName} -{" "}
                  {moment(note.createdOn).format("DD/MM/YYYY")}
                </span>{" "}
                <span> {note.noteDescription}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </Popover.Body>
  </Popover>
);
