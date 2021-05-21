import axios from 'axios'
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_REVIEW_FAIL,
  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRODUCT_TOP_FAIL,
  GET_HIGHEST_RATING_PRODUCT,
  GET_HIGHEST_RATING_PRODUCT_SUCCESSFULLY,
  GET_HIGHEST_RATING_PRODUCT_FAILED,
  SAVE_JUDGE_FOR_PRODUCT,
  SAVE_JUDGE_FOR_PRODUCT_SUCCESSFULLY,
  SAVE_JUDGE_FOR_PRODUCT_FAILED,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  CATEGORY_LIST_FAIL,
  CATEGORY_CREATE_REQUEST,
  CATEGORY_CREATE_SUCCESS,
  CATEGORY_CREATE_FAIL,
  CATEGORY_UPDATE_REQUEST,
  CATEGORY_UPDATE_SUCCESS,
  CATEGORY_UPDATE_FAIL,
  CATEGORY_DETAILS_REQUEST,
  CATEGORY_DETAILS_SUCCESS,
  CATEGORY_DETAILS_FAIL,
  //types
  TYPE_LIST_REQUEST,
  TYPE_LIST_SUCCESS,
  TYPE_LIST_FAIL,
  TYPE_CREATE_REQUEST,
  TYPE_CREATE_SUCCESS,
  TYPE_CREATE_FAIL,
  TYPE_UPDATE_REQUEST,
  TYPE_UPDATE_SUCCESS,
  TYPE_UPDATE_FAIL,
  TYPE_DETAILS_REQUEST,
  TYPE_DETAILS_SUCCESS,
  TYPE_DETAILS_FAIL,
} from '../constants/productConstants'
import {
  USERS_RELATED_TO_PRODUCT_REQUEST_SUCCESSFULLY
} from '../constants/userConstants'
import { logout } from './userActions'

export const listProducts = (keyword = '', pageNumber = '') => async (
  dispatch
) => {
  try {
    dispatch({ type: PRODUCT_LIST_REQUEST })

    const { data } = await axios.get(
      `/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
    )

    dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST })

    const { data } = await axios.get(`/api/products/${id}`)

    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const deleteProduct = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_DELETE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.delete(`/api/products/${id}`, config)

    dispatch({
      type: PRODUCT_DELETE_SUCCESS,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: PRODUCT_DELETE_FAIL,
      payload: message,
    })
  }
}

export const createProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_CREATE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.post(`/api/products`, product, config)

    dispatch({
      type: PRODUCT_CREATE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: PRODUCT_CREATE_FAIL,
      payload: message,
    })
  }
}

export const updateProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch({
      type: PRODUCT_UPDATE_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const { data } = await axios.put(
      `/api/products/${product._id}`,
      product,
      config
    )

    dispatch({
      type: PRODUCT_UPDATE_SUCCESS,
      payload: data,
    })
    dispatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: PRODUCT_UPDATE_FAIL,
      payload: message,
    })
  }
}

export const createProductReview = (productId, review) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({
      type: PRODUCT_CREATE_REVIEW_REQUEST,
    })

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    await axios.post(`/api/products/${productId}/reviews`, review, config)

    dispatch({
      type: PRODUCT_CREATE_REVIEW_SUCCESS,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: PRODUCT_CREATE_REVIEW_FAIL,
      payload: message,
    })
  }
}

export const listTopProducts = () => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_TOP_REQUEST })

    const { data } = await axios.get(`/api/products/top`)

    dispatch({
      type: PRODUCT_TOP_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: PRODUCT_TOP_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const getHighestRatingProducts = (number) => async (dispatch) => {
  try {
    dispatch({ type: GET_HIGHEST_RATING_PRODUCT });

    const url = `/api/products/highest-rating?number=${number.toString()}`;
    const { data } = await axios.get(url);

    dispatch({
      type: GET_HIGHEST_RATING_PRODUCT_SUCCESSFULLY,
      payload: data.highestRatingProducts,
    })
  } catch (error) {
    dispatch({
      type: GET_HIGHEST_RATING_PRODUCT_FAILED,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const saveJudgesForAProduct = (productId, judges) => async (dispatch, getState) => {
  try {
    dispatch({ type: SAVE_JUDGE_FOR_PRODUCT });

    const {
      userLogin: { userInfo },
    } = getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    }

    const url = `/api/products/${productId}/assign`;
    const payload = judges;
    const response = await axios.post(url, payload, config);
    dispatch({
      type: USERS_RELATED_TO_PRODUCT_REQUEST_SUCCESSFULLY,
      payload: judges,
    });

  } catch (e) {

  }
}

export const createCategory = (category) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CATEGORY_CREATE_REQUEST,
    })

    const config = getConfig(getState);

    const { data } = await createProductProperties('category', category, config);

    dispatch({
      type: CATEGORY_CREATE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: CATEGORY_CREATE_FAIL,
      payload: message,
    })
  }
}

export const listCategories = () => async (
  dispatch,
  getState
) => {
  try {
    
    const config = getConfig(getState);

    dispatch({ type: CATEGORY_LIST_REQUEST })

    const propertyType = 'category';
    const categories = await listProductProperties(propertyType, config);

    dispatch({
      type: CATEGORY_LIST_SUCCESS,
      payload: categories,
    })
  } catch (error) {
    dispatch({
      type: CATEGORY_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}


async function listProductProperties(type, config) {
  try {
    const url = `/api/products/properties?type=${type.toString()}`
    const { data } = await axios.get(url, config);
    return data[`${type}List`];
  } catch (e) {
    throw e;
  }
}

async function createProductProperties(type, payload, config) {
  try {
    const url = `/api/products/properties?type=${type.toString()}`
    const { data } = await axios.post(url, payload, config);
    return data[type];
  } catch (e) {
    throw e;
  }
}

async function updateProductProperties(type, id, payload, config) {
  try {
    const url = `/api/products/properties?type=${type.toString()}&id=${id.toString()}`;
    const { data } = await axios.put(url, payload, config);
    return data[type];
  } catch (e) {
    throw e;
  }
}


async function getPropertyDetails(id, type, config) {
  try {
    const url = `/api/products/properties/${id.toString()}?type=${type.toString()}`
    const { data } = await axios.get(url, config);
    return data[type];
  } catch (e) {
    throw e;
  }
}

export const getCategoryDetails = (id) => async (dispatch, getState) => {
  try {
    const config = getConfig(getState);
    dispatch({ type: CATEGORY_DETAILS_REQUEST })

    const category = await getPropertyDetails(id, 'category', config);

    dispatch({
      type: CATEGORY_DETAILS_SUCCESS,
      payload: category,
    })
  } catch (error) {
    dispatch({
      type: CATEGORY_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const updateCategory = (id, updatedCategory) => async (dispatch, getState) => {
  try {
    dispatch({
      type: CATEGORY_UPDATE_REQUEST,
    })

    const config = getConfig(getState);

    const { data } = await updateProductProperties('category', id, updatedCategory, config);

    dispatch({
      type: CATEGORY_UPDATE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: PRODUCT_UPDATE_FAIL,
      payload: message,
    })
  }
}

//  Type actions




export const listTypes = () => async (
  dispatch,
  getState
) => {
  try {

    const config = getConfig(getState);

    dispatch({ type: TYPE_LIST_REQUEST })

    const propertyType = 'brand';
    const types = await listProductProperties(propertyType, config);

    dispatch({
      type: TYPE_LIST_SUCCESS,
      payload: types,
    })
  } catch (error) {
    dispatch({
      type: TYPE_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}


export const getTypeDetails = (id) => async (dispatch, getState) => {
  try {
    const config = getConfig(getState);
    dispatch({ type: TYPE_DETAILS_REQUEST })

    const brand = await getPropertyDetails(id, 'brand', config);
    
    dispatch({
      type: TYPE_DETAILS_SUCCESS,
      payload: brand,
    })
  } catch (error) {
    dispatch({
      type: TYPE_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const createType = (brand) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TYPE_CREATE_REQUEST,
    })

    const config = getConfig(getState);

    const { data } = await createProductProperties('brand', brand, config);

    dispatch({
      type: TYPE_CREATE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: TYPE_CREATE_FAIL,
      payload: message,
    })
  }
}

export const updateType = (id, updatedType) => async (dispatch, getState) => {
  try {
    dispatch({
      type: TYPE_UPDATE_REQUEST,
    })

    const config = getConfig(getState);

    const { data } = await updateProductProperties('brand', id, updatedType, config);

    dispatch({
      type: TYPE_UPDATE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: PRODUCT_UPDATE_FAIL,
      payload: message,
    })
  }
}


// get config
const getConfig = (getState) => {
  const {
    userLogin: { userInfo },
  } = getState()

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userInfo.token}`,
    },
  }
  return config;
}