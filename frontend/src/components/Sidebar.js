import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getHighestRatingProducts } from './../actions/productActions';

import { NUMBER_OF_PRODUCT_PER_EACH_CATEGORY } from './../constants/appConstant';

function Sidebar() {
    const dispatch = useDispatch();
    const state = useSelector((state) => state);
    const { highestRatingProducts } = state;
    const { categoryGroups } = highestRatingProducts;
    const numberOfProductPerEachCategory = NUMBER_OF_PRODUCT_PER_EACH_CATEGORY;

    useEffect(() => {
        dispatch(
            getHighestRatingProducts(
                numberOfProductPerEachCategory
            )
        )
    }, [dispatch]);

    return (
        <div className="sidebar">
            <h2>HIGHEST RATING</h2>
            <div className="highest-rating-products">
                {categoryGroups.map(group => (
                    <div className="each-category" key={group.category._id}>
                        <div className="category">{group.category.name}</div>
                        { group.products.map(product => (
                            <div key={product._id} className="high-rating-product">{product.name}
                                <span><span>&nbsp;(</span>
                                    <i style={{ color: '#f8e825' }}
                                        className="fas fa-star"
                                    ></i>{product.rating}
                                    <span>)</span>
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Sidebar
