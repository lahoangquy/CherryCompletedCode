import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
    listCategories
} from '../actions/productActions'
import { CATEGORY_CREATE_RESET, CATEGORY_UPDATE_RESET } from './../constants/productConstants';

const CategoryListScreen = ({ history, match }) => {

    const dispatch = useDispatch()

    const categoryList = useSelector((state) => state.categoryList);

    const { loading, error, categories } = categoryList;

    useEffect(() => {
        dispatch(listCategories());
    }, [])

    const createCategoryHandler = () => {
        dispatch({ type: CATEGORY_CREATE_RESET });
        dispatch({ type: CATEGORY_UPDATE_RESET });
        history.push(`/admin/category/create`);
    }

    return (
        <React.Fragment>
            <Row className='align-items-center'>
                <Col>
                    <h1>Categories</h1>
                </Col>
                <Col className='text-right'>
                    <Button className='my-3' onClick={createCategoryHandler}>
                        <i className='fas fa-plus'></i> Create a category
          </Button>
                </Col>
            </Row>
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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories && categories.length > 0 ? (categories || []).map((category) => (
                                <tr key={category._id}>
                                    <td>{category.name}</td>
                                    <td>
                                        <LinkContainer to={`/admin/category/edit/${category._id}`}>
                                            <Button onClick={() => {
                                                dispatch({ type: CATEGORY_CREATE_RESET });
                                                dispatch({ type: CATEGORY_UPDATE_RESET });
                                            }} variant='light' className='btn-sm'>
                                                <i className='fas fa-edit'></i>
                                            </Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            )) : (<tr><td className="txt-center" colSpan={2}>There is no category</td></tr>)}
                        </tbody>
                    </Table>
                </>
            )}
        </React.Fragment>
    )
}

export default CategoryListScreen