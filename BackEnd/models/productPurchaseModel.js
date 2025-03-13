const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    purchaserName: {type:String, required: true },
    phoneNo: {type:Number, required: true },
    generatedBy: {type:mongoose.Schema.Types.ObjectId,  ref: 'User', required: true},
    products: [
        {
       productName: { type: String},
       newQuantity: { type: Number},
       newPrice: { type: Number},
}
],   
}, {timestamps: true});

const ProductPurchase = mongoose.model('ProductPurchase', purchaseSchema)
module.exports = ProductPurchase;
