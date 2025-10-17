const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');
const auth = require('../middleware/auth');

// Add stock
router.post('/', auth, async (req, res) => {
  const { symbol, shares, purchasePrice, purchaseDate } = req.body;
  try {
    const stock = new Stock({
      user: req.user.id,
      symbol,
      shares,
      purchasePrice,
      purchaseDate,
    });
    await stock.save();
    res.json(stock);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get stocks
router.get('/', auth, async (req, res) => {
  try {
    const stocks = await Stock.find({ user: req.user.id });
    res.json(stocks);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete stock
router.delete('/:id', auth, async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    if (stock.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    await stock.remove();
    res.json({ message: 'Stock removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
