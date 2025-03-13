const BookMark = require('../models/bookmarkModel');

async function handleUpdateBookMark(req , res) {
    try {
        const { userID, bookID, pageNumber } = req.body;

        if (!userID || !bookID || pageNumber === undefined) {
            return res.status(400).send('userID, bookID, and pageNumber are required.');
        }

        const result = await BookMark.updateOne(
            { userID, bookID },
            { pageNumber },
            { upsert: true } // Create if not exists
        );

        res.status(200).send('Bookmark saved');
    } catch (error) {
        console.error('Error saving bookmark:', error);
        res.status(500).send('Error saving bookmark');
    };
}

async function handleGetBookMark(req, res) {
    try {
        const { userID, bookID } = req.query;
        const bookmark = await BookMark.findOne({ userID, bookID });
        res.status(200).json(bookmark);
    } catch (error) {
        res.status(500).send('Error retrieving bookmark');
    }
}

async function handleGetAllBookMarkByID(req, res, next) {
    try {
        const  userID  = req.params.id;
        // console.log(userID);
        
        const bookmark = await BookMark.find({ userID }).populate("bookID").populate("userID");
        if(!bookmark){
            const error = new Error('No Bookmarks Found.');
            error.statusCode = 400;
            return next(error);
        }
        // console.log(bookmark);
        res.status(200).json(bookmark);
    } catch (error) {
        return next(error);
    }
}



module.exports = {
    handleUpdateBookMark,
    handleGetBookMark,
    handleGetAllBookMarkByID,
};