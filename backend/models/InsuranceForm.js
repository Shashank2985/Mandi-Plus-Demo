const mongoose = require('mongoose');

const insuranceFormSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  supplierName: {
    type: String,
    required: true,
  },
  supplierAddress: {
    type: String,
    required: true,
  },
  placeOfSupply: {
    type: String,
    required: true,
  },
  buyerName: {
    type: String,
    required: true,
  },
  buyerAddress: {
    type: String,
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  hsn: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    default: function() {
      return this.quantity * this.rate;
    },
  },
  vehicleNumber: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
  weightmentSlipURL: {
    type: String,
  },
  pdfURL: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('InsuranceForm', insuranceFormSchema);