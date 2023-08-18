/** @format */

type searchState = {
  loading: Boolean;
  exportLoading: Boolean;
  error: string;
  feedBackList: Array<object>;
  limit: number;
  height: number;
  totalPages: number;
  totalItems: number;
  labelFacets: Array<object>;
  policyFacets: Array<object>;
  pageNumber: number;
  facets: Array<string>;
  searchCriteria: any;
};

type searchActions = {
  type: string;
  payload: any;
};

export const feedbackInitialState = {
  loading: true,
  exportLoading: false,
  error: "",
  feedBackList: [],
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
    sortColumn: "updatedDate",
    sortOrder: "",
    filter: {
      searchWithins: ["ALL"],
    },
    tableSearch: {},
  },
};

export const feedbackReducer = (state: searchState, action: searchActions) => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      console.log("suuced");
      return {
        ...state,
        loading: false,
        feedBackList: action.payload.feedBackList,
        totalPages: Number(action.payload.totalPages),
        totalItems: Number(action.payload.totalItems),
        labelFacets: action.payload.labelFacets,
        policyFacets: action.payload.policyFacets,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        loading: false,
        feedBackList: [],
        totalPages: 0,
        totalItems: 0,
      };
    case "FETCH_REQUEST":
      return {
        ...state,
        loading: true,
      };
    case "CHANGE_LIMIT":
      return {
        ...state,
        loading: true,
        searchCriteria: {
          ...state.searchCriteria,
          itemsPerPage: action.payload,
        },
        limit: Number(action.payload),
      };
    case "SORT_CHANGE":
      return {
        ...state,
        loading: true,
        searchCriteria: {
          ...state.searchCriteria,
          sortColumn: action.payload.sortColumn,
          sortOrder: action.payload.sortOrder,
        },
      };
    case "PAGE_CHANGE":
      return {
        ...state,
        loading: true,
        searchCriteria: {
          ...state.searchCriteria,
          pageNumber: action.payload.pageNumber.toString(),
        },
        pageNumber: action.payload.pageNumber,
      };
    case "SET_SEARCH":
      return {
        ...state,
        loading: true,
        searchCriteria: {
          ...state.searchCriteria,
          searchTerm: action.payload.searchTerm,
          filter: action.payload.filter,
          pageNumber: "1",
        },
        pageNumber: 1,
      };
    case "SET_SEARCH_TABLE":
      return {
        ...state,
        loading: true,
        searchCriteria: {
          ...state.searchCriteria,
          tableSearch: action.payload.tableSearch,
          searchTerm: action.payload.searchTerm,
          filter: action.payload.filter,
          pageNumber: "1",
        },
        pageNumber: 1,
      };
    case "SET_FILTER":
      return {
        ...state,
        loading: true,
        searchCriteria: {
          ...state.searchCriteria,
          searchTerm: action.payload.searchTerm,
          filter: action.payload.filter,
          pageNumber: "1",
        },
        pageNumber: 1,
      };
    case "DELETE_SUCCESS":
      return {
        ...state,
        feedBackList: state.feedBackList.filter(
          (feedBackList: any) =>
            !action.payload.includes(feedBackList.feedBackListId)
        ),
      };
    case "EXPORT_START":
      return {
        ...state,
        exportLoading: true,
        loading: true,
      };
    case "EXPORT_END":
      return {
        ...state,
        exportLoading: false,
        loading: false,
      };
    default:
      return state;
  }
};
