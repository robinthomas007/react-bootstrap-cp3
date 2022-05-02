import React from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Col from 'react-bootstrap/Col'
import { useColor } from '../../Context/ColorModeContext';

type searchProps = {
  loading: boolean | Boolean;
  tracks: any;
  limit: number;
  height: number;
  totalPages: number;
  totalItems: number;
  pageNumber: number;
  onSortModelChange: any;
  openNotesModal: any
}

type editNotesPropTypes = {
  row: object
}

export default function ProjectSearchDataGrid(props: searchProps) {

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Track Title',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'artist',
      headerName: 'Artist',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'isrc',
      headerName: 'ISRC',
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'label',
      headerName: 'Label',
      sortable: true,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'releaseDate',
      headerName: 'Release Date',
      sortable: true,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'leakDate',
      headerName: 'Leak Date',
      sortable: true,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'comments',
      headerName: 'Notes',
      sortable: false,
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <QuestionAnswerIcon onClick={(() => NotesModal(params))} />
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      flex: 1,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <div>
          <EditIcon className="icon editIcon" onClick={(() => editModal(params))} />
          &nbsp;&nbsp;&nbsp;
          <DeleteIcon />
        </div>
      ),
    },
  ];

  const NotesModal = (params: editNotesPropTypes) => {
    props.openNotesModal(params.row)
  }

  const editModal = (params: object) => {
    // setParam(params)
    // handleClickOpen()
  }

  const colorModeContext = useColor()

  const onSortModelChange = (data: any[]) => {
    props.onSortModelChange({ sortColumn: data[0].field, sortOrder: data[0].sort })
  }
  return (
    <Col md={11}>
      <div style={{ height: props.height, width: '100%' }}>
        <DataGrid
          sortingMode='server'
          onSortModelChange={onSortModelChange}
          rows={props.tracks}
          sortingOrder={['asc', 'desc']}
          getRowId={(row) => row.trackId}
          columns={columns}
          pageSize={props.limit}
          checkboxSelection
          disableSelectionOnClick
          onPageSizeChange={(newPageSize) => console.log(newPageSize)}
          hideFooter={true}
          className={`${colorModeContext.colorMode === 'light' ? '' : 'text-white'}`}
        />
      </div>
    </Col>
  )
}
