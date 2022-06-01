import React from "react";
import { DataGrid, GridColDef, getGridStringOperators, GridSelectionModel } from "@mui/x-data-grid";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Col from "react-bootstrap/Col";
import { useColor } from "../../Context/ColorModeContext";
import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

const filterOperators = getGridStringOperators().filter((operator) =>
  ["contains"].includes(operator.value)
);

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
  deleteTrack: any
};

type editNotesPropTypes = {
  row: object;
};

export default function ProjectSearchDataGrid(props: searchProps) {
  const [selectionModel, setSelectionModel] = React.useState<GridSelectionModel>([]);

  const columns: GridColDef[] = [
    {
      field: "title",
      headerName: "Track Title",
      flex: 1,
      headerAlign: "left",
      align: "left",
      filterOperators,
      renderCell: (params: any) => {
        if (params.row.subTitle) {
          return (<OverlayTrigger
            placement="top"
            overlay={<Tooltip id="button-tooltip">
              {params.row.subTitle}
            </Tooltip>}
          >
            <span>{params.row.title}</span>
          </OverlayTrigger>)
        }
        return (
          <span>{params.row.title}</span>
        )
      }
    },
    {
      field: "artist",
      headerName: "Artist",
      flex: 1,
      headerAlign: "left",
      align: "left",
      filterOperators,
    },
    {
      field: "isrc",
      headerName: "ISRC",
      flex: 1,
      headerAlign: "left",
      align: "left",
      filterOperators,
    },
    {
      field: "label",
      headerName: "Label",
      sortable: true,
      flex: 1,
      headerAlign: "left",
      align: "left",
      filterOperators,
      filterable: false,
    },
    {
      field: "releaseDate",
      headerName: "Release Date",
      sortable: true,
      flex: 1,
      headerAlign: "left",
      align: "left",
      filterOperators,
      filterable: false,
    },
    {
      field: "leakDate",
      headerName: "Leak Date",
      sortable: true,
      flex: 1,
      headerAlign: "left",
      align: "left",
      filterOperators,
      filterable: false,
    },
    {
      field: "blockPolicyName",
      headerName: "Policy",
      sortable: false,
      flex: 1,
      headerAlign: "left",
      align: "left",
      filterable: false,
    },
    {
      field: "comments",
      headerName: "Notes",
      sortable: false,
      flex: 1,
      headerAlign: "center",
      align: "center",
      filterable: false,
      renderCell: (params) => (
        <QuestionAnswerIcon onClick={() => NotesModal(params)} />
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
          <DeleteIcon onClick={(() => deleteTrack(params))} />
        </div>
      ),
    },
  ];

  const NotesModal = (params: editNotesPropTypes) => {
    props.openNotesModal(params.row);
  };

  const editModal = (params: object) => {
    props.openCreateModal(params)
  };

  const deleteTrack = (params: any) => {
    if (selectionModel.length > 0) {
      props.deleteTrack(selectionModel)
    } else {
      props.deleteTrack([params.row.trackId])
    }
  }

  const colorModeContext = useColor();

  const onSortModelChange = (data: any[]) => {
    if (data.length > 0)
      props.onSortModelChange({
        sortColumn: data[0].field,
        sortOrder: data[0].sort,
      });
    else
      props.onSortModelChange({ sortColumn: "releaseDate", sortOrder: "desc" });
  };
  const onFilterModelChange = (data: any) => {
    data = data.items;
    if (data && data.length > 0 && data[0].hasOwnProperty("value")) {
      let item = data[0];
      if (["title", "artist", "isrc"].includes(item.columnField)) {
        props.dispatch({
          type: "SET_SEARCH",
          payload: {
            searchTerm: item.value,
            filter: { searchWithins: [item.columnField] },
          },
        });
      }
    }
  };

  return (
    <Col md={11}>
      <div style={{ height: props.height, width: "100%" }}>
        <DataGrid
          sortingMode="server"
          onSortModelChange={onSortModelChange}
          rows={props.tracks}
          sortingOrder={["asc", "desc"]}
          getRowId={(row) => row.trackId}
          columns={columns}
          pageSize={props.limit}
          checkboxSelection
          disableSelectionOnClick
          onPageSizeChange={(newPageSize) => console.log(newPageSize)}
          hideFooter={true}
          filterMode="server"
          onSelectionModelChange={(newSelectionModel) => {
            setSelectionModel(newSelectionModel);
          }}
          onFilterModelChange={onFilterModelChange}
          className={`${colorModeContext.colorMode === "light" ? "" : "text-white"
            }`}
        />
      </div>
    </Col>
  );
}
