minWithdrawalAmount) return;
    await Withdrawal.create({
      ownerWallet: OWNER_CONFIG.walletAddress,
      totalAmount: totalAmount,
      status: 'completed',
      txHash: 'TX_' + Date.now(),
      requestedAt: new Date(),
      completedAt: new Date()
    });
    await Commission.updateMany({ status: 'pending' }, { status: 'distributed', distributedAt: new Date() });
  } catch (error) {
    console.error('Withdrawal error:', error);
  }
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tradeai', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected')).catch(err => console.error('MongoDB Error:', err));

module.exports = app;
