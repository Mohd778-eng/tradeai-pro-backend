// server.js - Backend الكامل لـ TradeAI Pro
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// ════════════════════════════════════════════════════════════════
// 1️⃣ DATABASE SCHEMAS
// ════════════════════════════════════════════════════════════════

// User Schema
const userSchema = new mongoose.Schema({
  telegramId: Number,
  username: String,
  firstName: String,
  lastName: String,
  walletAddress: String,
  totalDeposited: { type: Number, default: 0 },
  totalProfit: { type: Number, default: 0 },
  totalCommissionPaid: { type: Number, default: 0 },
  
  investmentPlan: {
    period: String,
    riskLevel: String,
    amount: Number,
    startedAt: Date,
    nextDistribution: Date,
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Commission Schema
const commissionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  profitGenerated: Number,
  commissionRate: Number,
  commissionEarned: Number,
  status: { type: String, default: 'pending' },
  distributedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

// Withdrawal Schema
const withdrawalSchema = new mongoose.Schema({
  ownerWallet: String,
  totalAmount: Number,
  status: { type: String, default: 'pending' },
  txHash: String,
  requestedAt: { type: Date, default: Date.now },
  completedAt: Date
});

// Models
const User = mongoose.model('User', userSchema);
const Commission = mongoose.model('Commission', commissionSchema);
const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);

// ════════════════════════════════════════════════════════════════
// 2️⃣ CONFIGURATION
// ════════════════════════════════════════════════════════════════

const OWNER_CONFIG = {
  walletAddress: process.env.OWNER_WALLET || '0x7F3a8B2c4d9E1f6A3b7C5e2D9f0A1B8c4E',
  network: process.env.OWNER_NETWORK || 'BEP20',
  minWithdrawalAmount: 100,
  
  commissionRates: {
    daily: 0.15,
    weekly: 0.20,
    monthly: 0.25
  },
  
  profitR
