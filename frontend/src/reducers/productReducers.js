import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_RESET,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_UPDATE_RESET,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_REVIEW_FAIL,
  PRODUCT_CREATE_REVIEW_RESET,
  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRODUCT_TOP_FAIL,
  GET_HIGHEST_RATING_PRODUCT,
  GET_HIGHEST_RATING_PRODUCT_SUCCESSFULLY,
  GET_HIGHEST_RATING_PRODUCT_FAILED,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  CATEGORY_LIST_FAIL,
  CATEGORY_DETAILS_REQUEST,
  CATEGORY_DETAILS_SUCCESS,
  CATEGORY_DETAILS_FAIL,
  CATEGORY_CREATE_FAIL,
  CATEGORY_CREATE_SUCCESS,
  CATEGORY_CREATE_REQUEST,
  CATEGORY_UPDATE_REQUEST,
  CATEGORY_UPDATE_SUCCESS,
  CATEGORY_UPDATE_FAIL,
  CATEGORY_CREATE_RESET,
  CATEGORY_UPDATE_RESET,
  //TYPE
  TYPE_LIST_REQUEST,
  TYPE_LIST_SUCCESS,
  TYPE_LIST_FAIL,
  TYPE_DETAILS_REQUEST,
  TYPE_DETAILS_SUCCESS,
  TYPE_CREATE_FAIL,
  TYPE_CREATE_SUCCESS,
  TYPE_CREATE_REQUEST,
  TYPE_UPDATE_REQUEST,
  TYPE_UPDATE_SUCCESS,
  TYPE_CREATE_RESET,
  TYPE_UPDATE_RESET,
  TYPE_UPDATE_FAIL,
  TYPE_DETAILS_FAIL
} from '../constants/productConstants'

export const productListReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_LIST_REQUEST:
      return { loading: true, products: [] }
    case PRODUCT_LIST_SUCCESS:
      return {
        loading: false,
        products: action.payload.products,
        pages: action.payload.pages,
        page: action.payload.page,
      }
    case PRODUCT_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const productDetailsReducer = (
  state = { product: { reviews: [] } },
  action
) => {
  switch (action.type) {
    case PRODUCT_DETAILS_REQUEST:
      return { ...state, loading: true }
    case PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload }
    case PRODUCT_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const productDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_DELETE_REQUEST:
      return { loading: true }
    case PRODUCT_DELETE_SUCCESS:
      return { loading: false, success: true }
    case PRODUCT_DELETE_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const productCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REQUEST:
      return { loading: true }
    case PRODUCT_CREATE_SUCCESS:
      return { loading: false, success: true, product: action.payload }
    case PRODUCT_CREATE_FAIL:
      return { loading: false, error: action.payload }
    case PRODUCT_CREATE_RESET:
      return {}
    default:
      return state
  }
}

export const productUpdateReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    case PRODUCT_UPDATE_REQUEST:
      return { loading: true }
    case PRODUCT_UPDATE_SUCCESS:
      return { loading: false, success: true, product: action.payload }
    case PRODUCT_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case PRODUCT_UPDATE_RESET:
      return { product: {} }
    default:
      return state
  }
}

export const productReviewCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PRODUCT_CREATE_REVIEW_REQUEST:
      return { loading: true }
    case PRODUCT_CREATE_REVIEW_SUCCESS:
      return { loading: false, success: true }
    case PRODUCT_CREATE_REVIEW_FAIL:
      return { loading: false, error: action.payload }
    case PRODUCT_CREATE_REVIEW_RESET:
      return {}
    default:
      return state
  }
}

export const productTopRatedReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    case PRODUCT_TOP_REQUEST:
      return { loading: true, products: [] }
    case PRODUCT_TOP_SUCCESS:
      return { loading: false, products: action.payload }
    case PRODUCT_TOP_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const productHighestRatingReducer = (state = { categoryGroups: [] }, action) => {
  switch (action.type) {
    case GET_HIGHEST_RATING_PRODUCT:
      return { loading: true, categoryGroups: [] };
    case GET_HIGHEST_RATING_PRODUCT_SUCCESSFULLY:
      return { loading: false, categoryGroups: action.payload };
    case GET_HIGHEST_RATING_PRODUCT_FAILED:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
}

export const categoryListReducer = (state = { categories: [] }, action) => {
  switch (action.type) {
    case CATEGORY_LIST_REQUEST:
      return { loading: true, categories: [] }
    case CATEGORY_LIST_SUCCESS:
      return {
        loading: false,
        categories: action.payload,
      }
    case CATEGORY_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}

export const categoryCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case CATEGORY_CREATE_REQUEST:
      return { loading: true }
    case CATEGORY_CREATE_SUCCESS:
      return { loading: false, success: true, category: action.payload }
    case CATEGORY_CREATE_FAIL:
      return { loading: false, error: action.payload }
    case CATEGORY_CREATE_RESET:
      return {}
    default:
      return state
  }
}

export const categoryUpdateReducer = (state = { category: {} }, action) => {
  switch (action.type) {
    case CATEGORY_UPDATE_REQUEST:
      return { loading: true }
    case CATEGORY_UPDATE_SUCCESS:
      return { loading: false, success: true, category: action.payload }
    case CATEGORY_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case CATEGORY_UPDATE_RESET:
      return { category: {} }
    default:
      return state;
  }
}

export const categoryDetailsReducer = (state = { category: {} }, action) => {
  switch (action.type) {
    case CATEGORY_DETAILS_REQUEST:
      return { ...state, loading: true }
    case CATEGORY_DETAILS_SUCCESS:
      return { loading: false, category: action.payload }
    case CATEGORY_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}
//TYPE


export const typeListReducer = (state = { brands: [] }, action) => {
  switch (action.type) {
    case TYPE_LIST_REQUEST:
      return { loading: true, brands: [] }
    case TYPE_LIST_SUCCESS:
      return {
        loading: false,
        brands: action.payload,
      }
    case TYPE_LIST_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}


export const typeCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case TYPE_CREATE_REQUEST:
      return { loading: true }
    case TYPE_CREATE_SUCCESS:
      return { loading: false, success: true, type: action.payload }
    case TYPE_CREATE_FAIL:
      return { loading: false, error: action.payload }
    case TYPE_CREATE_RESET:
      return {}
    default:
      return state
  }
}

export const typeUpdateReducer = (state = { brand: {} }, action) => {
  switch (action.type) {
    case TYPE_UPDATE_REQUEST:
      return { loading: true }
    case TYPE_UPDATE_SUCCESS:
      return { loading: false, success: true, brand: action.payload }
    case TYPE_UPDATE_FAIL:
      return { loading: false, error: action.payload }
    case TYPE_UPDATE_RESET:
      return { brand: {} }
    default:
      return state;
  }
}

export const typeDetailsReducer = (state = { brand: {} }, action) => {
  switch (action.type) {
    case TYPE_DETAILS_REQUEST:
      return { ...state, loading: true }
    case TYPE_DETAILS_SUCCESS:
      return { loading: false, brand: action.payload }
    case TYPE_DETAILS_FAIL:
      return { loading: false, error: action.payload }
    default:
      return state
  }
}