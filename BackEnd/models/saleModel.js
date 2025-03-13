const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    customerName: {type:String, required: true },
    phoneNo: {type:Number, required: true },
    generatedBy: {type:mongoose.Schema.Types.ObjectId,  ref: 'User', required: true},
    grandTotal: {type:Number},
    products: [
        {
       productName: { type: String},
       productCode: { type: String},
       color: { type: String},
       quantity: { type: Number},
       total: { type: Number},
}
],   
}, {timestamps: true});

const Sale = mongoose.model('Sale', saleSchema)
module.exports = Sale;
