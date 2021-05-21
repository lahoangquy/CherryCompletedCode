import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import {
    listTypes
} from '../actions/productActions'
import { TYPE_CREATE_RESET, TYPE_UPDATE_RESET } from '../constants/productConstants';

const TypeListScreen = ({ history, match }) => {

    const dispatch = useDispatch()

    const brandList = useSelector((state) => state.typeList);

    const { loading, error, brands } = brandList;

    useEffect(() => {
        dispatch(listTypes());
    }, [])

    const createTypeHandler = () => {
        dispatch({ type: TYPE_CREATE_RESET });
        dispatch({ type: TYPE_UPDATE_RESET });
        history.push(`/admin/brand/create`);
    }

    return (
        <React.Fragment>
            <Row className='align-items-center'>
                <Col>
                    <h1>Type</h1>
                </Col>
                <Col className='text-right'>
                    <Button className='my-3' onClick={createTypeHandler}>
                        <i className='fas fa-plus'></i> Create a Type of the project
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
                            {brands && brands.length > 0 ? (brands || []).map((brand) => (
                                <tr key={brand._id}>
                                    <td>{brand.name}</td>
                                    <td>
                                        <LinkContainer to={`/admin/brand/edit/${brand._id}`}>
                                            <Button onClick={() => {
                                                dispatch({ type: TYPE_CREATE_RESET });
                                                dispatch({ type: TYPE_UPDATE_RESET });
                                            }} variant='light' className='btn-sm'>
                                                <i className='fas fa-edit'></i>
                                            </Button>
                                        </LinkContainer>
                                    </td>
                                </tr>
                            )) : (<tr><td className="txt-center" colSpan={2}>There is no Brand</td></tr>)}
                        </tbody>
                    </Table>
                </>
            )}
        </React.Fragment>
    )
}

export default TypeListScreen