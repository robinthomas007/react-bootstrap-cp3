type searchState = {
  loading: Boolean,
  exportLoading: Boolean,
  error: string
  greenList: Array<object>,
  limit: number,
  height: number,
  totalPages: number,
  totalItems: number,
  labelFacets: Array<object>,
  policyFacets: Array<object>,
  pageNumber: number,
  facets: Array<string>,
  searchCriteria: any,
}

type searchActions = {
  type: string,
  payload: any
}

export const greenListInitialState = {
  loading: true,
  exportLoading: false,
  error: '',
  greenList: [],
  limit: 10,
  height: 578,
  totalPages: 0,
  totalItems: 0,
  labelFacets: [],
  policyFacets: [],
  pageNumber: 1,
  facets: [],
  searchCriteria: {
    searchTerm: "",
    itemsPerPage: "10",
    pageNumber: "1",
    sortColumn: "",
    sortOrder: "",
    filter: {
      searchWithins: ['ALL']
    },
    tableSearch: {},
  }
}

export const greenListReducer = (state: searchState, action: searchActions) => {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        greenList: action.payload.greenList,
        totalPages: Number(action.payload.totalPages),
        totalItems: Number(action.payload.totalItems),
        labelFacets: action.payload.labelFacets,
        policyFacets: action.payload.policyFacets,
      }
    case 'FETCH_FAILURE':
      return {
        ...state,
        loading: false,
        greenList: [],
        totalPages: 0,
        totalItems: 0
      }
    case 'FETCH_REQUEST':
      return {
        ...state,
        loading: true,
      }
    case 'CHANGE_LIMIT':
      return {
        ...state,
        loading: true,
        searchCriteria: { ...state.searchCriteria, itemsPerPage: action.payload },
        limit: Number(action.payload)
      }
    case 'SORT_CHANGE':
      return {
        ...state,
        loading: true,
        searchCriteria: { ...state.searchCriteria, sortColumn: action.payload.sortColumn, sortOrder: action.payload.sortOrder }
      }
    case 'PAGE_CHANGE':
      return {
        ...state,
        loading: true,
        searchCriteria: { ...state.searchCriteria, pageNumber: action.payload.pageNumber.toString() },
        pageNumber: action.payload.pageNumber
      }
    case 'SET_SEARCH':
      return {
        ...state,
        loading: true,
        searchCriteria: { ...state.searchCriteria, searchTerm: action.payload.searchTerm, filter: action.payload.filter, pageNumber: "1" },
        pageNumber: 1
      }
    case 'SET_SEARCH_TABLE':
      return {
        ...state,
        loading: true,
        searchCriteria: { ...state.searchCriteria, tableSearch: action.payload.tableSearch, searchTerm: action.payload.searchTerm, filter: action.payload.filter, pageNumber: "1" },
        pageNumber: 1
      }
    case 'SET_FILTER':
      return {
        ...state,
        loading: true,
        searchCriteria: { ...state.searchCriteria, searchTerm: action.payload.searchTerm, filter: action.payload.filter, pageNumber: "1" },
        pageNumber: 1
      }
    case 'DELETE_SUCCESS':
      return {
        ...state,
        greenList: state.greenList.filter((greenList: any) => !action.payload.includes(greenList.greenListId))
      }
    case 'EXPORT_START':
      return {
        ...state,
        exportLoading: true,
        loading: true,
      }
    case 'EXPORT_END':
      return {
        ...state,
        exportLoading: false,
        loading: false,
      }
    default:
      return state
  }
}