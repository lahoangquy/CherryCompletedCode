import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import Sidebar from '../components/Sidebar';
import Meta from '../components/Meta';
import { listProducts } from '../actions/productActions';

const HomeScreen = ({ match }) => {
  const keyword = match.params.keyword

  const pageNumber = match.params.pageNumber || 1

  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, page, pages } = productList;

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin;

  let products = productList.products || [];
  const isUserLoggedIn = !!userInfo;
  let isAdmin = false;

  if (isUserLoggedIn) {
    isAdmin = userInfo.isAdmin;
    products = (productList.products || []).filter(p => {
      const isAssignedForCurrentUser = p.relatedUsers.findIndex(u => u.id === userInfo._id) !== -1;
      const canView = userInfo.isAdmin || isAssignedForCurrentUser;
      return canView;
    });
  }

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber))
  }, [dispatch, keyword, pageNumber])

  return (
    <>
      <Meta />
      <h1> {isUserLoggedIn ? 'Assigned Projects' : 'Latest Projects'} </h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <div className="home-wrapper">
          <div className={isAdmin ? "main-content" : "main-content-full-width"}>
            <React.Fragment>
              <Row>
                {products.map((product) => (
                  <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product} />
                  </Col>
                ))}
              </Row>
              <Paginate
                pages={pages}
                page={page}
                keyword={keyword ? keyword : ''}
              />
            </React.Fragment>
          </div>
          { isAdmin && <Sidebar className="sidebar"></Sidebar>}
        </div>
      )}
    </>
  )
}

export default HomeScreen
