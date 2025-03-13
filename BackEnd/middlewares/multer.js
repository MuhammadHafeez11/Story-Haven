const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const app = express();

app.use(express.json());

const uploadsBaseDirectory = path.join(__dirname, '..', '..', 'Uploads');

// Function to ensure a directory exists, create if not
function ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}


// Multer configuration for book uploads (cover image + PDF)
const uploadBookImage = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const bookUploadsDir = path.join(uploadsBaseDirectory, 'bookUploads');
            ensureDirectoryExists(bookUploadsDir);
            cb(null, bookUploadsDir);
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
        }
    }),
    limits: {
        fileSize: 3 * 1024 * 1024, // File size limit for images (3MB)
    },
    fileFilter: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|png|pdf/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            cb(null, true);
        } else {
            cb(new Error('Only images and PDFs are allowed'));
        }
    }
}).fields([
    { name: 'image', maxCount: 1 },  // Field for the cover image
    { name: 'pdf', maxCount: 1 }  // Field for the PDF file
]);

const checkImageDimensionsForBook = async (req, res, next) => {
    try {
        // console.log(req.files)
    if (!req.files) {
        return next(); // Proceed if no file is uploaded (this might be the case for updates without changing the image)
    }

        const metadata = await sharp(req.files.image[0].path).metadata();
        if (metadata.width !== 300 || metadata.height !== 300) {
            fs.unlinkSync(req.files.image[0].path); // Delete the file if dimensions do not match
            return res.status(400).json({ error: 'Image dimensions must be 300x300 pixels' });
        }
        next();
    } catch (error) {
        next();
    }
};


// Middleware to check image dimensions (300x300)
const checkImageDimensionsForAuthor = async (req, res, next) => {
    if (!req.file) {
        return next(); // Proceed if no file is uploaded (this might be the case for updates without changing the image)
    }

    try {
        const metadata = await sharp(req.file.path).metadata();
        if (metadata.width !== 300 || metadata.height !== 300) {
            fs.unlinkSync(req.file.path); // Delete the file if dimensions do not match
            return res.status(400).json({ error: 'Image dimensions must be 300x300 pixels' });
        }
        next();
    } catch (error) {
        next(new Error('Failed to process image dimensions.'));
    }
};


// Multer configuration for author images
const uploadAuthorImage = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const authorUploadsDir = path.join(uploadsBaseDirectory, 'authorUploads');
            ensureDirectoryExists(authorUploadsDir);
            cb(null, authorUploadsDir);
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + Date.now() + ".jpg");
        }
    }),
    limits: {
        fileSize: 300 * 1024, // Limit for image files (300KB)
    },
    fileFilter: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
}).single("photo");


module.exports = {
    uploadAuthorImage,
    uploadBookImage,
    checkImageDimensionsForAuthor,
    checkImageDimensionsForBook
};
