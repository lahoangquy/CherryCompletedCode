import path from 'path'
import express from 'express'
import multer from 'multer'
const router = express.Router()

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'frontend/public/images')
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    const r = cb(null, true);
    console.log(r);
    return r;
  } else {
    cb('Images only!')
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    console.log(file, cb);
    checkFileType(file, cb)
  },
})

router.post('/', upload.single('image'), (req, res) => {
  const returnPath = `/images/image-${req.file.path.replace('\\', '').split('-')[1]}`;
  res.send(returnPath);
})

export default router
