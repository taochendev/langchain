import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage, SystemMessage } from 'langchain/schema';
import { GenerateCampaignRequest } from '../types';

export class LangChainService {
  private model: ChatOpenAI;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'gpt-3.5-turbo', // Changed from gpt-4 to gpt-3.5-turbo which is more accessible
      temperature: 0.7,
      maxTokens: 1000,
    });
  }

  async generateCampaignContent(request: GenerateCampaignRequest): Promise<string> {
    try {
      const systemPrompt = this.buildSystemPrompt(request);
      const userPrompt = this.buildUserPrompt(request);

      const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(userPrompt)
      ];

      const response = await this.model.call(messages);
      return response.content as string;
    } catch (error: any) {
      console.error('Error generating campaign content:', error);
      
      // Check for specific OpenAI errors
      if (error.status === 404 && error.message?.includes('model')) {
        throw new Error('OpenAI model not accessible. Please check your API key has access to GPT models or upgrade your OpenAI plan.');
      }
      
      if (error.status === 401) {
        throw new Error('Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable.');
      }
      
      if (error.status === 429) {
        throw new Error('OpenAI API rate limit exceeded. Please try again later.');
      }
      
      if (error.message?.includes('insufficient_quota')) {
        throw new Error('OpenAI API quota exceeded. Please check your billing and usage limits.');
      }
      
      throw new Error(`Failed to generate campaign content: ${error.message || 'Unknown error'}`);
    }
  }

  private buildSystemPrompt(request: GenerateCampaignRequest): string {
    return `You are an expert marketing copywriter and campaign strategist. Your task is to create compelling, effective marketing content based on the provided campaign details.

Guidelines:
- Create content that is engaging, persuasive, and appropriate for the target audience
- Match the tone and style to the specified requirements
- Ensure the content is suitable for the specified campaign type (${request.campaign_type})
- Make the content actionable and include clear calls-to-action where appropriate
- Focus on benefits and value propositions
- Keep the content concise but impactful

Campaign Type Guidelines:
- Email: Subject line + body content with clear CTA
- Social: Engaging post with hashtags and social-friendly format
- Web: Landing page copy with headlines, subheadings, and sections
- Print: Traditional advertising copy with attention-grabbing headlines

Tone Guidelines:
- Professional: Formal, authoritative, trustworthy
- Casual: Relaxed, conversational, approachable
- Friendly: Warm, personal, welcoming
- Persuasive: Compelling, urgent, action-oriented`;
  }

  private buildUserPrompt(request: GenerateCampaignRequest): string {
    const lengthGuide: Record<string, string> = {
      short: '100-200 words',
      medium: '200-400 words', 
      long: '400-600 words'
    };

    const length = request.length || 'medium';
    const tone = request.tone || 'professional';

    return `Create a ${request.campaign_type} campaign with the following specifications:

Campaign Title: ${request.title}
Description: ${request.description}
Target Audience: ${request.target_audience}
Tone: ${tone}
Length: ${length} (${lengthGuide[length]})

Please provide complete, ready-to-use campaign content that addresses the campaign description and resonates with the target audience.`;
  }
}

export const langchainService = new LangChainService();
