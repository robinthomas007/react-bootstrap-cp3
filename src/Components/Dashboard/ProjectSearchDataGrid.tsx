import React from "react";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Col from "react-bootstrap/Col";
import { useColor } from "../../Context/ColorModeContext";
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Table from 'react-bootstrap/Table'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArchiveIcon from '@mui/icons-material/Archive';

type searchProps = {
  loading: boolean | Boolean;
  tracks: any;
  limit: number;
  height: number;
  totalPages: number;
  totalItems: number;
  pageNumber: number;
  onSortModelChange: any;
  openNotesModal: any;
  dispatch: any;
  openCreateModal: any
  deleteTrack: any,
  role: string
};

export default function ProjectSearchDataGrid(props: searchProps) {
  const [selectedRows, setSelectedRows] = React.useState<any>([]);
  const [activeSort, setActiveSort] = React.useState('releaseDate');
  const [sortOrder, setSortOrder] = React.useState('desc');

  const colorModeContext = useColor();

  const NotesModal = (track: object) => {
    props.openNotesModal(track);
  };

  const editModal = (track: object) => {
    props.openCreateModal(track)
  };

  const deleteTrack = (track: any) => {
    if (selectedRows.length > 0) {
      props.deleteTrack(selectedRows)
    } else {
      props.deleteTrack([track.trackId])
    }
  }

  const handleCheckboxAll = (e: any) => {
    if (e.target.checked) {
      setSelectedRows(props.tracks.map((t: any) => t.trackId))
    } else {
      setSelectedRows([])
    }
  }

  const handleCheckboxChange = (e: any, trackId: Number) => {
    if (e.target.checked) {
      setSelectedRows([...selectedRows, trackId])
    } else {
      setSelectedRows(selectedRows.filter((id: any) => id !== trackId))
    }
  }

  const handleSortOrderChange = (order: string, column: string) => {
    setActiveSort(column)
    setSortOrder(order)
    props.onSortModelChange({ sortColumn: column, sortOrder: order });
  }

  const getPrivacyToolTip = (tooltip: any) => {
    let tooltipContent = null;
    let exceptionContent = ''
    if (tooltip.policyDetails) {
      tooltipContent = <div>{tooltip.policyDetails.action.charAt(0).toUpperCase() + tooltip.policyDetails.action.slice(1)}  {tooltip.policyDetails.platform}  {tooltip.policyDetails.release} {tooltip.policyDetails.duration} {tooltip.policyDetails.date} </div>
    }

    if (tooltip.exceptionDetails && tooltip.exceptionDetails.length > 0) {
      exceptionContent = tooltip.exceptionDetails.map((exception: any, i: number) => {
        return <div className="exception" key={i}>{exception.action.charAt(0).toUpperCase() + exception.action.slice(1)} {exception.platform}  {exception.release} {exception.duration} {exception.date}</div>
      })
    }
    return <div>{tooltipContent} {exceptionContent !== '' ? <strong>Exception : </strong> : ''}{exceptionContent}</div>;
  }

  return (
    <Col md={11}>
      <Table responsive className={`${colorModeContext.colorMode === "light" ? "srch-dg-tbl" : "srch-dg-tbl text-white"}`}>
        <thead>
          <tr>
            <th><input type="checkbox" checked={selectedRows.length === props.tracks.length} className="form-check-input" onChange={handleCheckboxAll} /></th>
            <th>Track Title <span className="sort-icons">{sortOrder === 'desc' && activeSort === 'title' ? <KeyboardArrowUpIcon onClick={() => handleSortOrderChange('asc', 'title')} /> : <KeyboardArrowDownIcon onClick={() => handleSortOrderChange('desc', 'title')} />}</span></th>
            <th>Artist <span className="sort-icons">{sortOrder === 'desc' && activeSort === 'artist' ? <KeyboardArrowUpIcon onClick={() => handleSortOrderChange('asc', 'artist')} /> : <KeyboardArrowDownIcon onClick={() => handleSortOrderChange('desc', 'artist')} />}</span></th>
            <th>ISRC <span className="sort-icons">{sortOrder === 'desc' && activeSort === 'isrc' ? <KeyboardArrowUpIcon onClick={() => handleSortOrderChange('asc', 'isrc')} /> : <KeyboardArrowDownIcon onClick={() => handleSortOrderChange('desc', 'isrc')} />}</span></th>
            <th>Label <span className="sort-icons">{sortOrder === 'desc' && activeSort === 'label' ? <KeyboardArrowUpIcon onClick={() => handleSortOrderChange('asc', 'label')} /> : <KeyboardArrowDownIcon onClick={() => handleSortOrderChange('desc', 'label')} />}</span></th>
            <th>Policy <span className="sort-icons">{sortOrder === 'desc' && activeSort === 'blockPolicyName' ? <KeyboardArrowUpIcon onClick={() => handleSortOrderChange('asc', 'blockPolicyName')} /> : <KeyboardArrowDownIcon onClick={() => handleSortOrderChange('desc', 'blockPolicyName')} />}</span></th>
            <th>Leak Date <span className="sort-icons">{sortOrder === 'desc' && activeSort === 'leakDate' ? <KeyboardArrowUpIcon onClick={() => handleSortOrderChange('asc', 'leakDate')} /> : <KeyboardArrowDownIcon onClick={() => handleSortOrderChange('desc', 'leakDate')} />}</span></th>
            <th>Release Date <span className="sort-icons">{sortOrder === 'desc' && activeSort === 'releaseDate' ? <KeyboardArrowUpIcon onClick={() => handleSortOrderChange('asc', 'releaseDate')} /> : <KeyboardArrowDownIcon onClick={() => handleSortOrderChange('desc', 'releaseDate')} />}</span></th>
            <th>Source <span className="sort-icons">{sortOrder === 'desc' && activeSort === 'source' ? <KeyboardArrowUpIcon onClick={() => handleSortOrderChange('asc', 'source')} /> : <KeyboardArrowDownIcon onClick={() => handleSortOrderChange('desc', 'source')} />}</span></th>
            <th className="text-center">Notes</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {props.tracks.map((track: any, index: number) => (
            <React.Fragment key={index}>
              <tr key={index} className={`${selectedRows.includes(track.trackId) ? 'selected-row' : ''}`}>
                <td><input type="checkbox" checked={selectedRows.includes(track.trackId)} onChange={(e) => handleCheckboxChange(e, track.trackId)} className="form-check-input" /></td>
                <td>
                  {track.subTitle ?
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="button-tooltip">{track.subTitle}</Tooltip>}>
                      <span>{track.title}</span>
                    </OverlayTrigger> : track.title}
                </td>
                <td>{track.artist}</td>
                <td>{track.isrc}</td>
                <td>{track.label}</td>
                <td> {track.policyDetails ?
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip id="button-tooltip">{getPrivacyToolTip(track)}</Tooltip>}>
                    <span>{track.blockPolicyName}</span>
                  </OverlayTrigger> : track.blockPolicyName}</td>
                <td>{track.leakDate}</td>
                <td>{track.releaseDate}</td>
                <td><span className={`soruce-box ${track.source}`}>{track.source} {/*<KeyboardArrowDownIcon />*/}</span></td>
                <td className="text-center"><QuestionAnswerIcon onClick={() => NotesModal(track)} /></td>
                <td>
                  <div className="action-icons">
                    {props.role === 'admin' && <EditIcon className="icon editIcon" onClick={(() => editModal(track))} />}
                    {props.role === 'admin' && <ArchiveIcon onClick={(() => deleteTrack(track))} />}
                    {/*props.role === 'admin' && <DeleteIcon onClick={(() => deleteTrack(track))} />*/}
                  </div>
                </td>
              </tr>
              {track.extended_tracks && <tr className="extended-list">
                <td></td>
                <td>Some Track Title 2</td>
                <td>Some Artist Name</td>
                <td>0123499999990</td>
                <td>Universal Music</td>
                <td>Block</td>
                <td></td>
                <td></td>
                <td><span className="soruce-box cp3">CP3</span></td>
                <td className="text-center"><QuestionAnswerIcon onClick={() => NotesModal(track)} /></td>
                <td>
                  <div className="action-icons">
                    <EditIcon className="icon editIcon" onClick={(() => editModal(track))} />
                    <ArchiveIcon />
                    <DeleteIcon onClick={(() => deleteTrack(track))} />
                  </div>
                </td>
              </tr>}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </Col>
  );
}
