import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { listProductDetails, updateProduct, createProduct, listCategories, listTypes } from '../actions/productActions'

const ProductEditScreen = ({ match, history }) => {

  const mode = match.params.mode;
  const productId = match.params.id || null;

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [uploadingError, setUploadingError] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState({});
  const [validationError, setValidationError] = useState(null);


  const dispatch = useDispatch()

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const categoryList = useSelector(state => state.categoryList);
  const {
    loading: loadingCategory,
    categories
  } = categoryList;

  const typeList = useSelector(state => state.typeList);
  const {
    loading: loadingBrand,
    brands
  } = typeList;

  const productUpdate = useSelector((state) => state.productUpdate);

  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  const productCreate = useSelector(state => state.productCreate);

  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = productCreate

  useEffect(() => {
    if (mode === 'edit') {
      // Load data to patch in edit mode
      dispatch(listProductDetails(productId));
    }
    dispatch(listCategories());
    dispatch(listTypes());
  }, []);


  useEffect(() => {
    // Patch data in form
    if (mode === 'edit' && !!product && !!product._id) {
      const isProductLoaded = !!product && !!product._id;
      const isCategoryLoaded = !loadingCategory;
      const isBrandLoaded = !loadingBrand;
      if (isProductLoaded && isCategoryLoaded && isBrandLoaded) {
        setName(product.name || '');
        setPrice(product.price || 0);
        setImage(product.image || '');
        setBrand(product.brand || '');
        setCategory(product.category || '');
        setCountInStock(product.countInStock || 0);
        setDescription(product.description || '');
      }
    }
  }, [productDetails, categoryList, typeList])

  useEffect(() => {
    if (successUpdate || successCreate) {
      history.push(`/admin/productlist`);
    }
  }, [successUpdate, successCreate]);

  const supportedFileTypes = ['image/jpeg', 'image/png'];

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0] || {};
    const fileType = file.type || '';
    const isValidFileType = supportedFileTypes.indexOf(fileType) !== -1;
    if (isValidFileType) {
      const fileName = file.name;
      setImage(fileName);
      setFile(file);
    }
  }

  const validateForSaving = () => {
    const validationResult = { isValid: true, msg: null };
    if (!name || !brand || !category || !price || !image || !description) {
      validationResult.isValid = false;
      validationResult.msg = `Please fill in missing fields to ${mode === 'edit' ? 'edit' : 'create'} project`;
      return validationResult;
    }
    return validationResult;
  }

  const modelForSaving = () => {
    return {
      name,
      price,
      description,
      image,
      brand,
      category,
      countInStock
    };
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    const validationResult = validateForSaving();
    if (!validationResult.isValid) {
      setValidationError(validationResult.msg);
      return;
    }
    const modeledProduct = modelForSaving();
    console.log(modeledProduct);
    try {
      if (mode === 'create') {
        const uploadFilePath = await uploadFile();
        modeledProduct.image = uploadFilePath;
        dispatch(createProduct(modeledProduct));
      } else {
        if (!!file && !!file.name) {
          const uploadFilePath = await uploadFile();
          modeledProduct.image = uploadFilePath;
        }
        modeledProduct._id = product._id;
        dispatch(updateProduct(modeledProduct));
      }
    } catch (e) {
      console.log(e);
    }
  }

  const uploadFile = async () => {
    const formData = new FormData()
    formData.append('image', file)
    setUploadingError(false)
    setUploading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }

      const { data } = await axios.post('/api/upload', formData, config)
      setUploadingError(false);
      setUploading(false);
      return data;
    } catch (error) {
      console.error(error);
      setUploadingError(true);
      setUploading(false);
    }
  }

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>{mode === 'create' ? 'Create A' : 'Edit'} Project</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {!!validationError && <Message variant='danger'>{validationError}</Message>}
        {!!uploadingError && <Message variant='danger'>Failed to upload image. Please choose another file and file again.</Message>}
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
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Target audience</Form.Label>
              <Form.Control
                style={!!validationError && !price ? { 'border': '1px solid red' } : {}}
                type='string'
                placeholder='Enter the type of audience'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='image'>
              <Form.Label>Image (*.jpeg, *.png only)</Form.Label>
              <Form.Control
                type='text'
                placeholder='Uploaded image name will be shown here'
                disabled
                value={image}
                onChange={(e) => { console.log(e); setImage(e.target.value) }}
              ></Form.Control>
              <Form.File
                style={!!validationError && !image ? { 'border': '1px solid red' } : {}}
                id='image-file'
                label='Choose File'
                custom
                accept='*image/*'
                onChange={uploadFileHandler}
              ></Form.File>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                style={!!validationError && !category ? { 'border': '1px solid red' } : {}}
                as="select" value={category} custom onChange={(e) => setCategory(e.target.value)}>
                <option disabled value={''}>--&nbsp;&nbsp;&nbsp;Select category&nbsp;&nbsp;&nbsp;--</option>
                {(categories || []).map(c => (<option key={c._id} value={c._id}>{c.name}</option>))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                style={!!validationError && !brand ? { 'border': '1px solid red' } : {}}
                as="select" value={brand} custom onChange={(e) => setBrand(e.target.value)}>
                <option disabled value={''}>--&nbsp;&nbsp;&nbsp;Select brand&nbsp;&nbsp;&nbsp;--</option>
                {(brands || []).map(b => (<option key={b._id} value={b._id}>{b.name}</option>))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                style={!!validationError && !description ? { 'border': '1px solid red' } : {}}
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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


export default ProductEditScreen
