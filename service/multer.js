const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file) {
            cb(null, 'uploads/')
        }
        else {
            cb(error, null)
        }
    },
    filename: (req, file, cb) => {
        if (file) {
            cb(null, Date.now() + '-' + file.originalname)
        }
        else {
            cb(error, null)
        }
    }
})

const types = ['image/png', 'image/jpg', 'image/jpeg']

const fileFilter = (req, file, cb) => {
    if (file) {
        if (types.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
}

module.exports = multer({ storage, fileFilter })