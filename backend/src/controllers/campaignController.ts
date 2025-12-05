import { Request, Response } from 'express';
import { campaignService } from '../services/campaignService';
import { asyncHandler } from '../middleware/errorHandler';

export const getAllCampaigns = asyncHandler(async (req: Request, res: Response) => {
  const campaigns = await campaignService.getAllCampaigns(req.user!.id);
  
  res.json({
    success: true,
    data: campaigns,
    count: campaigns.length
  });
});

export const getCampaignById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const campaign = await campaignService.getCampaignById(id, req.user!.id);
  
  res.json({
    success: true,
    data: campaign
  });
});

export const createCampaign = asyncHandler(async (req: Request, res: Response) => {
  const campaign = await campaignService.createCampaign(req.user!.id, req.body);
  
  res.status(201).json({
    success: true,
    data: campaign,
    message: 'Campaign created successfully'
  });
});

export const updateCampaign = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const campaign = await campaignService.updateCampaign(id, req.user!.id, req.body);
  
  res.json({
    success: true,
    data: campaign,
    message: 'Campaign updated successfully'
  });
});

export const deleteCampaign = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await campaignService.deleteCampaign(id, req.user!.id);
  
  res.json({
    success: true,
    message: 'Campaign deleted successfully'
  });
});

export const generateCampaign = asyncHandler(async (req: Request, res: Response) => {
  const result = await campaignService.generateCampaignContent(req.user!.id, req.body);
  
  res.status(201).json({
    success: true,
    data: result.campaign,
    generatedContent: result.generatedContent,
    message: 'Campaign generated successfully'
  });
});
