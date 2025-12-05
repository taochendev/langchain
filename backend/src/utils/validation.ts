import Joi from 'joi';

export const createCampaignSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().min(1).max(1000).required(),
  target_audience: Joi.string().min(1).max(500).required(),
  campaign_type: Joi.string().valid('email', 'social', 'web', 'print').required(),
});

export const updateCampaignSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional(),
  description: Joi.string().min(1).max(1000).optional(),
  target_audience: Joi.string().min(1).max(500).optional(),
  campaign_type: Joi.string().valid('email', 'social', 'web', 'print').optional(),
  content: Joi.string().max(10000).optional(),
  status: Joi.string().valid('draft', 'active', 'completed', 'paused').optional(),
});

export const generateCampaignSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().min(1).max(1000).required(),
  target_audience: Joi.string().min(1).max(500).required(),
  campaign_type: Joi.string().valid('email', 'social', 'web', 'print').required(),
  tone: Joi.string().valid('professional', 'casual', 'friendly', 'persuasive').optional().default('professional'),
  length: Joi.string().valid('short', 'medium', 'long').optional().default('medium'),
});

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }
    req.body = value;
    next();
  };
};
