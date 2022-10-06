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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Popover from 'react-bootstrap/Popover';
import SelectField from './../Common/select'
import Button from "./../Common/button";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CloseIcon from "@mui/icons-material/Close";
import moment from 'moment';
import { capitalizeFirstLetter, FormatPlatforms } from './../Common/Utils'
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

type searchProps = {
  loading: boolean | Boolean;
  tracks: any;
  limit: number;
  height: number;
  totalPages: number;
  totalItems: number;
  pageNumber: number;
  onSortModelChange: any;
  onFilterColumnSearch: any,
  clearSearch: any,
  openNotesModal: any;
  dispatch: any;
  openCreateModal: any
  deleteTrack: any,
  role: string
};

type tableHeaderObj = {
  id: any,
  name: string
}

export default function ProjectSearchDataGrid(props: searchProps) {
  const [selectedRows, setSelectedRows] = React.useState<any>([]);
  const [activeSort, setActiveSort] = React.useState('updatedDate');
  const [sortOrder, setSortOrder] = React.useState('desc');
  const [columnFilter, setcolumnFilter] = React.useState<Array<tableHeaderObj>>([{ id: 'title', name: 'Track Title' }]);
  const [filterSearch, setFilterSearch] = React.useState('');
  const [hideColumns, setHideColumns] = React.useState<Array<string>>([]);
  const [active, setActive] = React.useState<any>('')

  const colorModeContext = useColor();

  const TITLES = [
    { id: 'title', name: 'Track Title', },
    { id: 'artist', name: 'Artist' },
    { id: 'album', name: 'Album' },
    { id: 'isrc', name: 'ISRC' },
    { id: 'label', name: 'Label' },
    { id: 'blockPolicyName', name: 'Policy' },
    { id: 'leakDate', name: 'Leak Date' },
    { id: 'releaseDate', name: 'Release Date' },
    { id: 'updatedDate', name: 'Last Updated' },
    { id: 'source', name: 'Source' },
  ]

  const NotesModal = (track: object) => {
    props.openNotesModal(track);
  };

  const editModal = (track: object) => {
    if (selectedRows.length > 0) {
      props.openCreateModal(props.tracks.filter((o: any) => selectedRows.includes(o.trackId)))
    } else {
      props.openCreateModal([track])
    }
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

  const clearColumnFilter = () => {
    setFilterSearch('')
    props.clearSearch()
  }

  const getHiddenTitles = () => {
    return TITLES.filter((o: any) => hideColumns.includes(o.id)).map((data) => {
      return <div className="hide-ttl-strips">
        {data.name} <CloseIcon onClick={() => setHideColumns(hideColumns.filter(element => element !== data.id))} />
      </div>
    })
  }

  const popover = (
    <Popover id="popover-basic" className="filter-popover">
      <Popover.Body>
        <div className="clmn-filter-bdy">
          {hideColumns.includes(columnFilter[0].id) ? <VisibilityOffIcon onClick={() => setHideColumns(hideColumns.filter(element => element !== columnFilter[0].id))} /> : <VisibilityIcon onClick={() => setHideColumns([...hideColumns, columnFilter[0].id])} />}
          <SelectField value={columnFilter} isMulti={false} options={TITLES} name="labelIds" handleChange={(data: any) =>
            setcolumnFilter([data])
          } />
          <input value={filterSearch} type="text" onChange={(e: any) => setFilterSearch(e.target.value)} />
          {filterSearch && <CloseIcon className="filter-close" onClick={() => clearColumnFilter()} />}
          <Button
            type="submit"
            variant="secondary"
            label="Search"
            className="text-white mr-20"
            handleClick={() => handleFilterSearch()}
          />
        </div>
        {hideColumns.length > 0 && <div className="hd-list">
          <strong>Hide Columns </strong>
          <div className="hd-cl-wrapper">{getHiddenTitles()}</div>
        </div>}
      </Popover.Body>
    </Popover>
  );

  const handleFilterSearch = () => {
    props.onFilterColumnSearch(filterSearch, columnFilter[0].id)
  }

  const getTableIcons = (active: string, title: string) => {
    return (
      <span>
        <span>{title}</span>
        <span className="sort-icons">{sortOrder === 'desc' && activeSort === active ?
          <KeyboardArrowUpIcon onClick={() => handleSortOrderChange('asc', active)} /> :
          <KeyboardArrowDownIcon onClick={() => handleSortOrderChange('desc', active)} />}
          {/* <ArrowCircleLeftIcon onClick={() => handleColumnOrder(title, 'left')} /> */}
          {/* <ArrowCircleRightIcon onClick={() => handleColumnOrder(title, 'right')} /> */}
          <OverlayTrigger trigger="click" placement="bottom" overlay={popover} rootClose>
            <MoreVertIcon className="header-filter-icon" onClick={() => !filterSearch && setcolumnFilter([{ id: active, name: title }])} />
          </OverlayTrigger>
        </span>
      </span>)
  }

  const getActiveTabToolTip = (releaseDate: string) => {
    const relDate = moment(releaseDate).format('MM-DD-YYYY')
    const currentDate = moment().format('MM-DD-YYYY')
    return moment(relDate) > moment(currentDate) ? 'pre-release' : 'post-release'
  }


  const handleColumnOrder = (title: string, position: string) => {
    console.log("came")
  }


  return (
    <Col md={11}>
      <Table responsive className={`${colorModeContext.colorMode === "light" ? "srch-dg-tbl" : "srch-dg-tbl text-white"}`}>
        <thead>
          <tr>
            <th><input type="checkbox" checked={selectedRows.length === props.tracks.length} className="form-check-input" onChange={handleCheckboxAll} /></th>
            {TITLES.map((ele, index) => {
              return !hideColumns.includes(ele.id) && <th key={index}>{getTableIcons(ele.id, ele.name)}</th>
            })}
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="tbale-bdy">
          {props.tracks.map((track: any, index: number) => {
            const tab = getActiveTabToolTip(track.releaseDate)
            const exData = track.exceptionDetails && track.exceptionDetails.map((item: any) => item.release.toLowerCase());
            const emptyEx = exData && exData.includes(active === '' ? tab : active)
            const activeTabData = track.policyDetails && track.policyDetails.release.toLowerCase() === (active === '' ? tab : active)
            return (
              <React.Fragment key={index}>
                <tr key={index} className={`${selectedRows.includes(track.trackId) ? 'selected-row' : ''}`}>
                  <td><input type="checkbox" checked={selectedRows.includes(track.trackId)} onChange={(e) => handleCheckboxChange(e, track.trackId)} className="form-check-input" /></td>
                  {!hideColumns.includes('title') && <td>
                    {track.subTitle ?
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id="button-tooltip">{track.subTitle}</Tooltip>}>
                        <span>{track.title}</span>
                      </OverlayTrigger> : track.title}
                  </td>}
                  {!hideColumns.includes('artist') && <td>{track.artist}</td>}
                  {!hideColumns.includes('album') && <td>{track.album}</td>}
                  {!hideColumns.includes('isrc') && <td>{track.isrc}</td>}
                  {!hideColumns.includes('label') && <td>{track.label}</td>}
                  {!hideColumns.includes('blockPolicyName') && <td> {track.policyDetails ?
                    <OverlayTrigger onEnter={() => setActive('')} trigger={['click', 'focus']} placement="top" overlay={
                      <Popover id="popover-basic" className="policy-popover">
                        <Popover.Body className="plcy-bdy-pad">
                          <div className="policy-tl-nav">
                            <span className={active === 'pre-release' ? 'active' : active === '' && tab === 'pre-release' ? 'active' : 'non-active'} onClick={() => setActive('pre-release')}>Pre-Release Policy</span>
                            <span className={active === 'post-release' ? 'active' : active === '' && tab === 'post-release' ? 'active' : 'non-active'} onClick={() => setActive('post-release')}>Post-Release Policy</span>
                            <span className={active === 'always' ? 'active' : 'non-active'} onClick={() => setActive('always')}>Always</span>
                            <span><strong>Release Date:</strong> {track.releaseDate}</span>
                          </div>
                          {(!activeTabData && !emptyEx) && <div className="d-flex justify-content-center"><p><strong>No Policy Applied</strong></p></div>}
                          {track.policyDetails.release.toLowerCase() === (active === '' ? tab : active) && <div className="policy-popover-bg">
                            <div className="d-flex mb-2">
                              <div className="po-plcy-name"><strong>Policy Name: </strong> {track.blockPolicyName}</div>
                              <div className="po-plcy-pltfm"><strong>Platforms:</strong> {FormatPlatforms(track.policyDetails.platform)}</div>
                            </div>
                            <div className="d-flex">
                              <div className="po-plcy-action"><strong>Action:</strong> {capitalizeFirstLetter(track.policyDetails.action)}</div>
                              <div className="po-plcy-duration"><strong>Duration:</strong> {track.policyDetails.duration}</div>
                              <div className="po-plcy-until"><strong>{track.policyDetails.release === 'Post-Release' ? 'After' : 'Until'}:</strong> {track.policyDetails.date}</div>
                            </div>
                          </div>}

                          {track.exceptionDetails && track.exceptionDetails.map((exec: any, id: any) => {
                            return (
                              <div key={id}>
                                {exec.release.toLowerCase() === (active === '' ? tab : active) && <div className="po-exception" key={id}>
                                  <div className="d-flex mb-2">
                                    <div className="po-plcy-name"><span><strong>Policy Name: </strong> {track.blockPolicyName}</span></div>
                                    <div className="po-plcy-pltfm"><strong>Platforms:</strong> {FormatPlatforms(exec.platform)}</div>
                                  </div>
                                  <div className="d-flex">
                                    <div className="po-plcy-action"><strong>Action:</strong> {capitalizeFirstLetter(exec.action)}</div>
                                    <div className="po-plcy-duration"><strong>Duration:</strong> {exec.duration}</div>
                                    <div className="po-plcy-when"><strong>{exec.release === 'Post-Release' ? 'After' : 'Until'}:</strong> {exec.date}</div>
                                  </div>
                                </div>}
                              </div>
                            )
                          })}
                        </Popover.Body>
                      </Popover>
                    } rootClose>
                      <span>{track.blockPolicyName}</span>
                    </OverlayTrigger> : <span>{track.blockPolicyName}</span>}
                  </td>}
                  {!hideColumns.includes('leakDate') && <td>{track.leakDate}</td>}
                  {!hideColumns.includes('releaseDate') && <td>{track.releaseDate}</td>}
                  {!hideColumns.includes('updatedDate') && <td>{track.updatedDate}</td>}
                  {!hideColumns.includes('source') && <td><span className={`soruce-box ${track.source}`}>{track.source} {/*<KeyboardArrowDownIcon />*/}</span></td>}
                  <td>
                    <div className="action-icons justify-content-space-between">
                      <QuestionAnswerIcon onClick={() => NotesModal(track)} />
                      {props.role === 'admin' && <EditIcon className="icon editIcon" onClick={(() => editModal(track))} />}
                      {props.role === 'admin' && <ArchiveIcon className={track.source !== 'CP3' ? 'disabled' : ''} onClick={(() => track.source === 'CP3' && deleteTrack(track))} />}
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
            )
          })}
        </tbody>
      </Table>
    </Col>
  );
}
