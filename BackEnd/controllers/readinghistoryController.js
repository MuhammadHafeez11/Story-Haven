const ReadingHistory = require('../models/readinghistoryModel');

async function handleUploadReadingHistory(req, res, next) {
    try {
        const { numberOfPagesRead, bookID, userID, startTime, endTime } = req.body;

        if (!numberOfPagesRead || !bookID || !userID || !startTime || !endTime) {
            const error = new Error('All fields are required and should not be empty.');
            error.statusCode = 400;
            return next(error);
        }

        const readingHistory = await ReadingHistory.updateOne(
            { userID, bookID },
            { $set: { startTime, endTime, numberOfPagesRead } },
            { upsert: true }
        );

        return res.status(200).send('History Saved');
    } catch (error) {
        return next(error);
    }
}

async function handleGetReadingHistoryById(req, res, next) {
    const userId = req.params.id;

    try {
        const readingHistory = await ReadingHistory.find({ userID: userId }).populate('userID').populate('bookID');
        return res.status(200).json(readingHistory);
    } catch (error) {
        return next(error);
    }
}

async function handleGetReadingHistory(req, res, next) {
    try {
        const data = await ReadingHistory.find().populate('userID').populate('bookID');
        return res.status(200).json(data);
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    handleUploadReadingHistory,
    handleGetReadingHistory,
    handleGetReadingHistoryById,
};
