import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { getCategoryDetails, updateCategory, createCategory, listCategories } from '../actions/productActions'

const CategoryEditScreen = ({ match, history }) => {

  const mode = match.params.mode;
  const categoryId = match.params.id || null;

  const [name, setName] = useState('')
  const [validationError, setValidationError] = useState(null);

  const dispatch = useDispatch();

  const categoryDetails = useSelector((state) => state.categoryDetails);

  const { loading, error, category } = categoryDetails;

  const { categories } = useSelector((state) => state.categoryList);

  const categoryUpdate = useSelector((state) => state.categoryUpdate);

  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = categoryUpdate;

  const categoryCreate = useSelector((state) => state.categoryCreate);

  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = categoryCreate

  useEffect(() => {
    if (mode === 'edit') {
      // Load data to patch in edit mode
      dispatch(getCategoryDetails(categoryId));
    }
    dispatch(listCategories());
  }, []);


  useEffect(() => {
    // Patch data in form
    if (mode === 'edit' && !!category && !!category._id) {
      setName(category.name || '');
    }
  }, [categoryDetails])

  useEffect(() => {
    if (successUpdate || successCreate) {
      history.push(`/admin/categorylist`);
    }
  }, [successUpdate, successCreate]);

  const validateForSaving = () => {
    const validationResult = { isValid: true, msg: null };
    if (!name) {
      validationResult.isValid = false;
      validationResult.msg = 'Please fill in category name to create project.';
      return validationResult;
    }
    const isExistingCategory = categories.findIndex(c => c.name === name) !== -1;
    if(isExistingCategory) {
      validationResult.isValid = false;
      validationResult.msg = `Category ${name} is already existing. Please choose another name.`;
      return validationResult;
    }
    return validationResult;
  }

  const modelForSaving = () => {
    return { name };
  }

  const submitHandler = (e) => {
    e.preventDefault();
    const validationResult = validateForSaving();
    if (!validationResult.isValid) {
      setValidationError(validationResult.msg);
      return;
    }
    const modeledCategory = modelForSaving();
    if (mode === 'create') {
      dispatch(createCategory(modeledCategory));
    } else {
      modeledCategory._id = category._id;
      dispatch(updateCategory(categoryId, modeledCategory));
    }
  }

  return (
    <>
      <Link to='/admin/categorylist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>{mode === 'create' ? 'Create A' : 'Edit'} Category</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {!!validationError && <Message variant='danger'>{validationError}</Message>}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                style={!!validationError && !name ? { 'border': '1px solid red' } : {}}
                type='name'
                placeholder='Enter category name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
              {mode === 'create' ? 'Create' : 'Update'}
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  )
}


export default CategoryEditScreen
