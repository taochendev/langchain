import { supabase } from '../utils/supabase';
import { Campaign, CreateCampaignRequest, UpdateCampaignRequest, GenerateCampaignRequest } from '../types';
import { langchainService } from './langchainService';
import { generateFallbackContent } from './fallbackContent';
import { AppError } from '../middleware/errorHandler';

export class CampaignService {
  async getAllCampaigns(userId: string): Promise<Campaign[]> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error details:', error);
      
      // Check if it's a table not found error
      if (error.message?.includes('relation "public.campaigns" does not exist')) {
        throw new AppError('Database not set up. Please run the database setup SQL in your Supabase project.', 500);
      }
      
      throw new AppError(`Failed to fetch campaigns: ${error.message}`, 500);
    }

    return data || [];
  }

  async getCampaignById(campaignId: string, userId: string): Promise<Campaign> {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new AppError('Campaign not found', 404);
      }
      throw new AppError('Failed to fetch campaign', 500);
    }

    return data;
  }

  async createCampaign(userId: string, campaignData: CreateCampaignRequest): Promise<Campaign> {
    console.log('Creating campaign for user:', userId);
    console.log('Campaign data:', campaignData);
    
    const { data, error } = await supabase
      .from('campaigns')
      .insert([
        {
          user_id: userId,
          title: campaignData.title,
          description: campaignData.description,
          target_audience: campaignData.target_audience,
          campaign_type: campaignData.campaign_type,
          content: '',
          status: 'draft'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase create campaign error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      // Check for specific error types
      if (error.message?.includes('violates row-level security policy')) {
        throw new AppError('Authentication error: User not properly authenticated for database operations', 401);
      }
      
      if (error.message?.includes('violates foreign key constraint')) {
        throw new AppError('User authentication error: Invalid user ID', 400);
      }
      
      if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        throw new AppError('Database table not found. Please run the database setup SQL.', 500);
      }
      
      throw new AppError(`Failed to create campaign: ${error.message}`, 500);
    }

    console.log('Campaign created successfully:', data);
    return data;
  }

  async updateCampaign(campaignId: string, userId: string, updateData: UpdateCampaignRequest): Promise<Campaign> {
    // First verify the campaign exists and belongs to the user
    await this.getCampaignById(campaignId, userId);

    const { data, error } = await supabase
      .from('campaigns')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', campaignId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw new AppError('Failed to update campaign', 500);
    }

    return data;
  }

  async deleteCampaign(campaignId: string, userId: string): Promise<void> {
    // First verify the campaign exists and belongs to the user
    await this.getCampaignById(campaignId, userId);

    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId)
      .eq('user_id', userId);

    if (error) {
      throw new AppError('Failed to delete campaign', 500);
    }
  }

  async generateCampaignContent(userId: string, generateData: GenerateCampaignRequest): Promise<{ campaign: Campaign; generatedContent: string }> {
    try {
      let generatedContent: string;
      let contentSource = 'AI';

      try {
        // Try to generate content using LangChain/OpenAI
        generatedContent = await langchainService.generateCampaignContent(generateData);
      } catch (aiError: any) {
        console.warn('AI generation failed, using fallback content:', aiError.message);
        
        // Use fallback content if AI fails
        generatedContent = generateFallbackContent(generateData);
        contentSource = 'Template';
        
        // Add a note about the fallback
        generatedContent = `[Generated using ${contentSource} - OpenAI unavailable]\n\n${generatedContent}`;
      }

      // Create the campaign with generated content
      const campaign = await this.createCampaign(userId, {
        title: generateData.title,
        description: generateData.description,
        target_audience: generateData.target_audience,
        campaign_type: generateData.campaign_type
      });

      // Update the campaign with generated content
      const updatedCampaign = await this.updateCampaign(campaign.id, userId, {
        content: generatedContent
      });

      return {
        campaign: updatedCampaign,
        generatedContent
      };
    } catch (error) {
      console.error('Error generating campaign:', error);
      throw new AppError('Failed to generate campaign content', 500);
    }
  }
}

export const campaignService = new CampaignService();
