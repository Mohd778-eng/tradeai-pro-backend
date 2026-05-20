const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const userSchema = new mongoose.Schema({
  telegramId: Number,
  username: String,
  totalDeposited: { type: Number, default: 0 },
  totalProfit: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.get('/api/user/:telegramId', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/invest', async (req, res) => {
  try {
    const { telegramId, username, amount } = req.body;
    const user = await User.findOneAndUpdate(
      { telegramId },
      { telegramId, username, $inc: { totalDeposited: amount } },
      { upsert: true, new: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/withdraw', async (req, res) => {
  try {
    const { telegramId, amount } = req.body;
    const user = await User.findOne({ telegramId });
    if (!user || user.totalProfit < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }
    user.totalProfit -= amount;
    await user.save();
    res.json({ success: true, balance: user.totalProfit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(err => console.error('MongoDB error:', err));

module.exports = app;
