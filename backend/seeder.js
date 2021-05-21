import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'
import users from './data/users.js'
import products, { categories, brands } from './data/products.js'
import User from './models/userModel.js'
import Product, { Brand, Category } from './models/productModel.js'
import Order from './models/orderModel.js'
import ProductUser from './models/productUserModel.js'
import connectDB from './config/db.js'

dotenv.config()

connectDB()

const importData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()
    await ProductUser.deleteMany()
    await Category.deleteMany();
    await Brand.deleteMany();

    const createdUsers = await User.insertMany(users)

    const adminUser = createdUsers[0]._id

    const createdCategories = await Category.insertMany(categories);
    const createdCategoryIds = createdCategories.map(c => c._id);

    const createdBrands = await Brand.insertMany(brands);
    const createdBrandIds = createdBrands.map(b => b._id);

    const sampleProducts = products.map((product) => {
      const category = randomInList(createdCategoryIds);
      const brand = randomInList(createdBrandIds);
      return { ...product, user: adminUser, category, brand };
    })

    await Product.insertMany(sampleProducts)

    const temp = Product.find({ });
    console.log(temp);

    console.log('Data Imported!'.green.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()
    await ProductUser.deleteMany()

    console.log('Data Destroyed!'.red.inverse)
    process.exit()
  } catch (error) {
    console.error(`${error}`.red.inverse)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}

const randomInList = (list) => {
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}
