import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import {
  listProducts,
  deleteProduct,
  createProduct,
} from '../actions/productActions'
import { PRODUCT_CREATE_RESET, PRODUCT_UPDATE_RESET } from '../constants/productConstants';
import { USERS_RELATED_TO_PRODUCT_NEED_TO_BE_RELOADED } from '../constants/userConstants';
import { usersRelatedToProduct } from '../actions/userActions';

const ProductListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products, page, pages } = productList
  products.forEach(p => {
    p.judgesStr = p.relatedUsers.map(u => u.name).join(', ');
  });

  const productDelete = useSelector((state) => state.productDelete)
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete

  const productCreate = useSelector((state) => state.productCreate)
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET })
    dispatch({ type: PRODUCT_UPDATE_RESET })

    if (!userInfo || !userInfo.isAdmin) {
      history.push('/login')
    }

    dispatch(listProducts('', pageNumber))
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    createdProduct,
    pageNumber,
  ])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure')) {
      dispatch(deleteProduct(id))
    }
  }

  const assignHandler = (id) => {
    dispatch({
      type: USERS_RELATED_TO_PRODUCT_NEED_TO_BE_RELOADED
    });
  }

  const createProductHandler = () => {
    // dispatch(createProduct())
    history.push(`/admin/productdetails/create`);
  }

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Projects</h1>
        </Col>
        <Col className='text-right'>
          <Button className='my-3' onClick={createProductHandler}>
            <i className='fas fa-plus'></i> Create a project
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>NAME</th>
                <th>Target Audience</th>
                <th>CATEGORY</th>
                <th>Assigned Users</th>
                <th>Type</th>
                <th>Actions</th>
                <th>Assign</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.judgesStr}</td>
                  <td>{product.brand}</td>
                  <td>
                    <LinkContainer to={`/admin/productdetails/edit/${product._id}`}>
                      <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(product._id)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                  <td className="assign-user-col">
                    <LinkContainer to={`/admin/product/${product._id}/assign`}>
                      <Button onClick={() => assignHandler()} variant='success' className='btn-sm'>
                        <i className='fas fa-users'></i>
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={true} />
        </>
      )}
    </>
  )
}

export default ProductListScreen