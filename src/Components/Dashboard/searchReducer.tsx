type searchState = {
  loading: Boolean,
  error: string
  tracks: Array<object>,
  limit: number,
  height: number,
  totalPages: number,
  totalItems: number,
  labelFacets: Array<object>,
  pageNumber: number,
  facets: Array<string>,
  searchCriteria: any
}

type searchActions = {
  type: string,
  payload: any
}

export const initialState = {
  loading: true,
  error: '',
  tracks: [],
  limit: 10,
  height: 578,
  totalPages: 0,
  totalItems: 0,
  labelFacets: [],
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
    }
  }
}

export const reducer = (state: searchState, action: searchActions) => {
  switch (action.type) {
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        tracks: action.payload.tracks,
        totalPages: Number(action.payload.totalPages),
        totalItems: Number(action.payload.totalItems),
        labelFacets: action.payload.labelFacets
      }
    case 'FETCH_FAILURE':
      return {
        ...state,
        loading: false,
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
        searchCriteria: { ...state.searchCriteria, searchTerm: action.payload.searchTerm },
      }
    case 'SET_FILTER':
      return {
        ...state,
        loading: true,
        searchCriteria: { ...state.searchCriteria, filter: action.payload.filter },
      }
    default:
      return state
  }
}