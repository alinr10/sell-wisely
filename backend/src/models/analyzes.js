import mongoose from 'mongoose';
const { Schema } = mongoose;

const AnalyzesSchema = new Schema({
    productName: { type: String, required: true },
    productUrl: { type: String, required: true },
    productComments: { type: [String], required: true },
    result: { type: String, required: true },
    creatorID: { type: String, required: true }

});

const analyzesModel = mongoose.model('analyzes', AnalyzesSchema);

export default analyzesModel;

