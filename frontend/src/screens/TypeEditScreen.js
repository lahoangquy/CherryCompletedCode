import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { getTypeDetails, updateType, createType, listTypes } from '../actions/productActions'

const TypeEditScreen = ({ match, history }) => {

  const mode = match.params.mode;
  const brandId = match.params.id || null;

  const [name, setName] = useState('')
  const [validationError, setValidationError] = useState(null);

  const dispatch = useDispatch();

  const typeDetails = useSelector((state) => state.typeDetails);

  const { loading, error, brand } = typeDetails;

  const { brands } = useSelector((state) => state.typeList);

  const typeUpdate = useSelector((state) => state.typeUpdate);

  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = typeUpdate;

  const typeCreate = useSelector((state) => state.typeCreate);

  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = typeCreate

  useEffect(() => {
    if (mode === 'edit') {
      // Load data to patch in edit mode
      dispatch(getTypeDetails(brandId));
    }
    dispatch(listTypes());
  }, []);


  useEffect(() => {
    // Patch data in form
    if (mode === 'edit' && !!brand && !!brand._id) {
      setName(brand.name || '');
    }
  }, [typeDetails])

  useEffect(() => {
    if (successUpdate || successCreate) {
      history.push(`/admin/brandlist`);
    }
  }, [typeUpdate, typeCreate]);

  const validateForSaving = () => {
    const validationResult = { isValid: true, msg: null };
    if (!name) {
      validationResult.isValid = false;
      validationResult.msg = 'Please fill in type name to create project.';
      return validationResult;
    }
    const isExistingType = brands.findIndex(c => c.name === name) !== -1;
    if (isExistingType) {
      validationResult.isValid = false;
      validationResult.msg = `Brand ${name} is already existing. Please choose another name.`;
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
    const modeledBrand = modelForSaving();
    if (mode === 'create') {
      dispatch(createType(modeledBrand));
    } else {
      modeledBrand._id = brand._id;
      dispatch(updateType(brandId, modeledBrand));
    }
  }

  return (
    <>
      <Link to='/admin/brandlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>{mode === 'create' ? 'Create A' : 'Edit'} Brand</h1>
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
                type='text'
                placeholder='Enter brand name'
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


export default TypeEditScreen
