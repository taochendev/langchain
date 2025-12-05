export interface Campaign {
  id: string;
  user_id: string;
  title: string;
  description: string;
  target_audience: string;
  campaign_type: 'email' | 'social' | 'web' | 'print';
  content: string;
  status: 'draft' | 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}

export interface CreateCampaignRequest {
  title: string;
  description: string;
  target_audience: string;
  campaign_type: 'email' | 'social' | 'web' | 'print';
}

export interface UpdateCampaignRequest {
  title?: string;
  description?: string;
  target_audience?: string;
  campaign_type?: 'email' | 'social' | 'web' | 'print';
  content?: string;
  status?: 'draft' | 'active' | 'completed' | 'paused';
}

export interface GenerateCampaignRequest {
  title: string;
  description: string;
  target_audience: string;
  campaign_type: 'email' | 'social' | 'web' | 'print';
  tone?: 'professional' | 'casual' | 'friendly' | 'persuasive';
  length?: 'short' | 'medium' | 'long';
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthRequest extends Request {
  user?: User;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
