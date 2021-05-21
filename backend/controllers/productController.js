import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler'
import Product, { Category, Brand } from '../models/productModel.js'
import User from '../models/userModel.js';
import ProductUser from '../models/productUserModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
      name: {
        $regex: req.query.keyword,
        $options: 'i',
      },
    }
    : {}

  const count = await Product.countDocuments({ ...keyword })
  let products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  
  const productIds = products.map(p => p._id.toString());

  const categoryIds = getDistinctList(products.map(p => p.category));

  const brandIds = getDistinctList(products.map(p => p.brand));

  const categories = await Category.find({ '_id': { $in: categoryIds } });

  const brands = await Brand.find({ '_id': { $in: brandIds } });

  const productUsers = await ProductUser.find({ 'productId': { $in: productIds } });

  const allUsers = await User.find();

  const userGroupedByProductIdGroups = productUsers.reduce((acc, cum) => {
    const existingGroupForProduct = acc.find(g => g.productId === cum.productId);
    const userName = findNameById(allUsers, cum.userId);
    if (!!existingGroupForProduct) {
      existingGroupForProduct.users.push({ id: cum.userId, name: userName });
    } else {
      acc.push({ productId: cum.productId, users: [{ id: cum.userId, name: userName }] })
    }
    return acc;
  }, []);

  const returnedProducts = products.map(p => {
    const usersForProduct = userGroupedByProductIdGroups.find(g => g.productId === p._id.toString());
    const relatedUsers = !!usersForProduct ? usersForProduct.users : [];
    const category = categories.find(c => c._id.toString() === p.category.toString());
    const brand = brands.find(b => b._id.toString() === p.brand.toString());
    const {
      rating,
      numReviews,
      price,
      _id,
      name,
      image,
      description,
      user,
      reviews,
    } = p;
    return {
      rating,
      numReviews,
      price,
      _id,
      name,
      image,
      description,
      brand : brand ? brand.name : '',
      category: category  ? category.name : '',
      user,
      reviews,
      relatedUsers
    }
  });

  res.json({ products: returnedProducts, page, pages: Math.ceil(count / pageSize) });
})

const findNameById = (list, id) => {
  return list.find(item => item.id === id).name;
}

const getDistinctList = (list) => {
  return list.reduce((acc, cur) => {
    const isExisting = acc.find(i => i === cur);
    if (!isExisting) {
      acc.push(cur);
    }
    return acc;
  }, []);
}

// @desc    Fetch all products
// @route   GET /api/products/highest-rating
// @access  Public
const getHighestRatingProducts = asyncHandler(async (req, res) => {

  const numberPerEachCategory = Number(req.query.number) || 2;

  const allProducts = await Product.find({}).sort({ rating: -1 });

  const reviewedProducts = allProducts.filter(p => p.numReviews > 0);

  const productIds = reviewedProducts.map(p => p._id.toString());

  const categoryIds = getDistinctList(allProducts.map(p => p.category));

  const brandIds = getDistinctList(allProducts.map(p => p.brand));

  const categories = await Category.find({ '_id': { $in: categoryIds } });

  const brands = await Category.find({ '_id': { $in: brandIds } });

  reviewedProducts.forEach(p => {
    const category = categories.find(c => c._id.toString() === p.category);
    const brand = brands.find(b => b._id.toString() === p.brand);
    p.category = category ? category.name : '';
    p.brand = brand ? brand.name : '';
  });

  // group by category
  const categoryGroups = reviewedProducts.reduce((acc, cur) => {
    const categoryId = cur.category;
    const category = categories.find(c => c._id.toString() === categoryId.toString());
    let categoryGroup = acc.find(g => g.category._id.toString() === categoryId.toString());
    if (!categoryGroup) {
      categoryGroup = { category: category, products: [] };
      acc.push(categoryGroup);
    }
    categoryGroup.products.push(cur);
    return acc;
  }, []);

  categoryGroups.forEach(group => {
    group.products.sort((x, y) => y.rating - x.rating);
    group.products = group.products.slice(0, numberPerEachCategory);
  });

  //console.log('--highestRatingProducts--', highestRatingProducts);

  res.json({ highestRatingProducts: categoryGroups });
})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);

  if (product) {
    await product.remove();
    await ProductUser.deleteMany({ productId });
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock
  } = req.body;

  const product = new Product({
    name,
    price,
    user: req.user._id,
    image,
    brand,
    category,
    countInStock: 0,
    numReviews: 0,
    description: description
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = name
    product.price = price
    product.description = description
    product.image = image
    product.brand = brand
    product.category = category
    product.countInStock = countInStock

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    product.reviews.push(review)

    product.numReviews = product.reviews.length

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3)

  res.json(products)
})

// @desc    Save users who are related to a product
// @route   POST /api/products/:id/assign
// @access  Private
const saveUsersRelatedToProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const userIds = req.body;
  await ProductUser.deleteMany({ productId });
  const savingPromises = userIds.map(id => (new ProductUser({
    userId: id,
    productId: productId,
  }).save()));
  // add new ones
  await Promise.all(savingPromises);
  res.status(200).json({ message: 'Linked product and users successfully' });
})


// @desc    Update users who are related to a product
// @route   put /api/products/:id/assign
// @access  Private
const updateUsersRelatedToProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const userIds = req.body;
  // remove old documents
  await ProductUser.deleteMany({ productId });
  const savingPromises = userIds.map(id => (new ProductUSer({
    userId: id,
    productId: productId,
  }).save()));
  // add new ones
  await Promise.all(savingPromises);
  res.status(200).json({ message: 'Update the link between product and users successfully' });
})

// @desc    Get users who are related to a product
// @route   GET /api/products/:id/assign
// @access  Private
const getUsersRelatedToProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const users = await ProductUser.find({ productId }).exec();
  const returnedUserIds = users.map(u => u.userId);
  res.status(200).json({ users: returnedUserIds });
})

const proppertyType = {
  category: 'category',
  brand: 'brand'
};

// @desc    Fetch all product properties by type
// @route   GET /api/product/properties
// @access  Private
const getProductProperties = asyncHandler(async (req, res) => {
  const type = req.query.type;

  const propertyModel = getMongooseModelBasedOnType(type);

  let properties = await propertyModel.find();

  res.status(200).json({ [`${type}List`]: properties });
})

// @desc    Update product property
// @route   Put /api/products/properties?type
// @access  Private
const createProductProperty = asyncHandler(async (req, res) => {

  const type = req.query.type;
  const { name } = req.body;

  const propertyModel = getMongooseModelBasedOnType(type);

  const property = new propertyModel({ name });

  const createdProperty = await property.save();

  res.status(200).json({ [type]: createdProperty });

})

// @desc    Update product property
// @route   Put /api/product/properties?type&id
// @access  Private
const updateProductProperty = asyncHandler(async (req, res) => {

  const type = req.query.type;
  const id = req.query.id;
  const { name } = req.body;

  const propertyModel = getMongooseModelBasedOnType(type);

  const property = await propertyModel.findById(id);

  if (!!property) {
    property.name = name;
    const updatedProperty = await property.save();
    res.status(200).json({ [type]: updatedProperty });
  } else {
    res.status(404)
    throw new Error(`${type} not found`);
  }
})

// @desc    Fetch product property details
// @route   GET /api/product/properties/id&type
// @access  Private
const getProductPropertyDetails = asyncHandler(async (req, res) => {
  const type = req.query.type;
  const id = req.params.id;

  const propertyModel = getMongooseModelBasedOnType(type);

  let property = await propertyModel.findById(id);

  res.status(200).json({ [type]: property });
})

const getMongooseModelBasedOnType = (type) => {
  switch (type) {
    case proppertyType.category:
      return Category;
    case proppertyType.brand:
      return Brand;
    default:
      return Category;
  }
}

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getHighestRatingProducts,
  saveUsersRelatedToProduct,
  getUsersRelatedToProduct,
  getProductProperties,
  getProductPropertyDetails,
  createProductProperty,
  updateProductProperty
}
