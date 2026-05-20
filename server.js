- app.listen(PORT, () => {
-   console.log(`✅ TradeAI Backend running on port ${PORT}`);
-   console.log(`🌐 Webhook: ${process.env.TELEGRAM_WEBHOOK_URL || 'Not set'}`);
-   console.log(`💼 Owner wallet: ${OWNER_CONFIG.walletAddress}`);
- });

+ console.log('✅ TradeAI Backend initialized');
+ console.log(`💼 Owner wallet: ${OWNER_CONFIG.walletAddress}`);
+ 
+ // Export for Vercel Serverless Function
+ module.exports = app;
