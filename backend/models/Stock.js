const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  symbol: String,
  shares: Number,
  purchasePrice: Number,
  purchaseDate: Date,
});

module.exports = mongoose.model('Stock', stockSchema);
