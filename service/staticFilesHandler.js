const multer = require('multer')
const types = ['image/png', 'image/jpg', 'image/jpeg']

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

const fileFilter = (req, file, cb) => {
    if (file) {
        if (types.includes(file.mimetype)) {
            cb(null, true);
        } else {
            const error = {
                msg: "Filetype"
            }
            cb(error, false);
        }
    }
}
module.exports = multer({ storage, fileFilter })