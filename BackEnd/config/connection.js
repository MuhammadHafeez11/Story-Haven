const mongoose = require('mongoose');

async function connectMongoDb(url){
    return mongoose.connect(url).then(()=>console.log('MongoDb connected'));
}

module.exports = {
    connectMongoDb,
}
