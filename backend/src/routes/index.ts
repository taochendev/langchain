import express from 'express';
import campaignRoutes from './campaigns';

const router = express.Router();

router.use('/campaigns', campaignRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Campaign Generator API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
