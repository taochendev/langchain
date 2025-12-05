import request from 'supertest';
import app from '../src/index';

// Mock Supabase and OpenAI
const mockSupabaseQuery = {
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnValue({
    data: [
      {
        id: '1',
        user_id: 'user1',
        title: 'Test Campaign',
        description: 'Test Description',
        target_audience: 'Test Audience',
        campaign_type: 'email',
        content: 'Test Content',
        status: 'draft',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }
    ],
    error: null,
  }),
  single: jest.fn().mockReturnValue({
    data: {
      id: '1',
      user_id: 'user1',
      title: 'Test Campaign',
      description: 'Test Description',
      target_audience: 'Test Audience',
      campaign_type: 'email',
      content: '',
      status: 'draft',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    error: null,
  }),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
};

jest.mock('../src/utils/supabase', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(() => mockSupabaseQuery),
  },
}));

jest.mock('../src/services/langchainService', () => ({
  langchainService: {
    generateCampaignContent: jest.fn(() => Promise.resolve('Generated content')),
  },
}));

// Mock authentication middleware - only for authenticated routes
const mockAuth = jest.fn((req: any, res: any, next: any) => {
  if (req.headers.authorization) {
    req.user = {
      id: 'user1',
      email: 'test@example.com',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    };
    next();
  } else {
    res.status(401).json({ success: false, message: 'No token provided' });
  }
});

jest.mock('../src/middleware/auth', () => ({
  authenticateUser: mockAuth,
}));

describe('Campaign API', () => {
  describe('GET /api/campaigns', () => {
    it('should get all campaigns for authenticated user', async () => {
      const response = await request(app)
        .get('/api/campaigns')
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('Test Campaign');
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/campaigns');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/campaigns', () => {
    it('should create a new campaign with valid data', async () => {
      // Mock the insert response specifically for this test
      mockSupabaseQuery.insert.mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockReturnValue({
            data: {
              id: '2',
              user_id: 'user1',
              title: 'New Campaign',
              description: 'Campaign description',
              target_audience: 'Target audience',
              campaign_type: 'email',
              content: '',
              status: 'draft',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
            },
            error: null,
          }),
        }),
      });

      const campaignData = {
        title: 'New Campaign',
        description: 'Campaign description',
        target_audience: 'Target audience',
        campaign_type: 'email',
      };

      const response = await request(app)
        .post('/api/campaigns')
        .set('Authorization', 'Bearer test-token')
        .send(campaignData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(campaignData.title);
    });

    it('should return 400 with invalid data', async () => {
      const invalidData = {
        title: '', // Required field empty
        description: 'Campaign description',
        target_audience: 'Target audience',
        campaign_type: 'email',
      };

      const response = await request(app)
        .post('/api/campaigns')
        .set('Authorization', 'Bearer test-token')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/campaigns/generate', () => {
    it('should generate campaign content with AI', async () => {
      const generateData = {
        title: 'AI Campaign',
        description: 'AI generated campaign',
        target_audience: 'AI target audience',
        campaign_type: 'email',
        tone: 'professional',
        length: 'medium',
      };

      const response = await request(app)
        .post('/api/campaigns/generate')
        .set('Authorization', 'Bearer test-token')
        .send(generateData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.generatedContent).toBe('Generated content');
    });

    it('should return 400 with missing required fields', async () => {
      const invalidData = {
        title: 'AI Campaign',
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/campaigns/generate')
        .set('Authorization', 'Bearer test-token')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});

describe('Health Check', () => {
  it('should return health status', async () => {
    const response = await request(app)
      .get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('running');
  });
});
