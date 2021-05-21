import express from 'express'
const router = express.Router()
import {
  getProducts,
  getTopProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getHighestRatingProducts,
  saveUsersRelatedToProduct,
  getUsersRelatedToProduct,
  getProductProperties,
  getProductPropertyDetails,
  createProductProperty,
  updateProductProperty

} from '../controllers/productController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(getProducts).post(protect, admin, createProduct)
router.route('/highest-rating').get(getHighestRatingProducts).post(protect, admin)
router.route('/:id/reviews').post(protect, createProductReview)
router.get('/top', getTopProducts)
router.route('/properties')
.get(protect, admin, getProductProperties)
.post(protect, admin, createProductProperty)
.put(protect, admin, updateProductProperty)
router.get('/properties/:id', getProductPropertyDetails)
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct)
router.route('/:id/assign')
  .get(protect, admin, getUsersRelatedToProduct)
  .post(protect, admin, saveUsersRelatedToProduct)

export default router
