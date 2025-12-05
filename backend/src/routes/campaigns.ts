import express from 'express';
import { 
  getAllCampaigns, 
  getCampaignById, 
  createCampaign, 
  updateCampaign, 
  deleteCampaign,
  generateCampaign 
} from '../controllers/campaignController';
import { authenticateUser } from '../middleware/auth';
import { 
  validateRequest, 
  createCampaignSchema, 
  updateCampaignSchema, 
  generateCampaignSchema 
} from '../utils/validation';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for AI generation endpoint
const generateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: 'Too many generation requests, please try again later.'
  }
});

// General rate limiting for other endpoints
const generalLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
});

// Apply authentication to all routes
router.use(authenticateUser);

// Apply general rate limiting
router.use(generalLimit);

// Campaign routes
router.get('/', getAllCampaigns);
router.get('/:id', getCampaignById);
router.post('/', validateRequest(createCampaignSchema), createCampaign);
router.put('/:id', validateRequest(updateCampaignSchema), updateCampaign);
router.delete('/:id', deleteCampaign);

// AI generation route with stricter rate limiting
router.post('/generate', generateLimit, validateRequest(generateCampaignSchema), generateCampaign);

export default router;
