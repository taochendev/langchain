import {
  createCampaignSchema,
  updateCampaignSchema,
  generateCampaignSchema,
} from '../src/utils/validation';

describe('Validation Schemas', () => {
  describe('createCampaignSchema', () => {
    it('should validate correct campaign data', () => {
      const validData = {
        title: 'Test Campaign',
        description: 'Test Description',
        target_audience: 'Test Audience',
        campaign_type: 'email',
      };

      const { error, value } = createCampaignSchema.validate(validData);
      expect(error).toBeUndefined();
      expect(value).toEqual(validData);
    });

    it('should reject missing required fields', () => {
      const invalidData = {
        title: 'Test Campaign',
        // Missing required fields: description, target_audience, campaign_type
      };

      const { error } = createCampaignSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details.length).toBeGreaterThan(0); // Should have validation errors
    });

    it('should reject invalid campaign type', () => {
      const invalidData = {
        title: 'Test Campaign',
        description: 'Test Description',
        target_audience: 'Test Audience',
        campaign_type: 'invalid_type',
      };

      const { error } = createCampaignSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain('must be one of');
    });

    it('should reject too long strings', () => {
      const invalidData = {
        title: 'a'.repeat(201), // Too long
        description: 'Test Description',
        target_audience: 'Test Audience',
        campaign_type: 'email',
      };

      const { error } = createCampaignSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain('less than or equal to 200');
    });
  });

  describe('updateCampaignSchema', () => {
    it('should validate partial update data', () => {
      const validData = {
        title: 'Updated Title',
        status: 'active',
      };

      const { error, value } = updateCampaignSchema.validate(validData);
      expect(error).toBeUndefined();
      expect(value).toEqual(validData);
    });

    it('should allow empty update (all fields optional)', () => {
      const emptyData = {};

      const { error, value } = updateCampaignSchema.validate(emptyData);
      expect(error).toBeUndefined();
      expect(value).toEqual(emptyData);
    });

    it('should reject invalid status', () => {
      const invalidData = {
        status: 'invalid_status',
      };

      const { error } = updateCampaignSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain('must be one of');
    });
  });

  describe('generateCampaignSchema', () => {
    it('should validate generate data with defaults', () => {
      const validData = {
        title: 'Test Campaign',
        description: 'Test Description',
        target_audience: 'Test Audience',
        campaign_type: 'email',
      };

      const { error, value } = generateCampaignSchema.validate(validData);
      expect(error).toBeUndefined();
      expect(value.tone).toBe('professional'); // Default value
      expect(value.length).toBe('medium'); // Default value
    });

    it('should validate generate data with custom options', () => {
      const validData = {
        title: 'Test Campaign',
        description: 'Test Description',
        target_audience: 'Test Audience',
        campaign_type: 'email',
        tone: 'casual',
        length: 'long',
      };

      const { error, value } = generateCampaignSchema.validate(validData);
      expect(error).toBeUndefined();
      expect(value.tone).toBe('casual');
      expect(value.length).toBe('long');
    });

    it('should reject invalid tone', () => {
      const invalidData = {
        title: 'Test Campaign',
        description: 'Test Description',
        target_audience: 'Test Audience',
        campaign_type: 'email',
        tone: 'invalid_tone',
      };

      const { error } = generateCampaignSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain('must be one of');
    });

    it('should reject invalid length', () => {
      const invalidData = {
        title: 'Test Campaign',
        description: 'Test Description',
        target_audience: 'Test Audience',
        campaign_type: 'email',
        length: 'invalid_length',
      };

      const { error } = generateCampaignSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain('must be one of');
    });
  });
});
