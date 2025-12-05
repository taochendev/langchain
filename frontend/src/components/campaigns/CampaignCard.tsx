'use client';

import { Campaign } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatDate, getStatusColor, getCampaignTypeIcon, truncateText } from '@/lib/utils';
import { Edit, Trash2, Eye } from 'lucide-react';

interface CampaignCardProps {
  campaign: Campaign;
  onEdit: (campaign: Campaign) => void;
  onDelete: (id: string) => void;
  onView: (campaign: Campaign) => void;
}

export function CampaignCard({ campaign, onEdit, onDelete, onView }: CampaignCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getCampaignTypeIcon(campaign.campaign_type)}</span>
            <CardTitle className="text-lg">{campaign.title}</CardTitle>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.status)}`}
          >
            {campaign.status}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            {truncateText(campaign.description, 150)}
          </p>
          
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500">Target Audience</p>
            <p className="text-sm">{truncateText(campaign.target_audience, 100)}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500">Type</p>
            <p className="text-sm capitalize">{campaign.campaign_type}</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500">Created</p>
            <p className="text-sm">{formatDate(campaign.created_at)}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onView(campaign)}
          className="flex items-center space-x-1"
        >
          <Eye className="h-4 w-4" />
          <span>View</span>
        </Button>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(campaign)}
            className="flex items-center space-x-1"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => onDelete(campaign.id)}
            className="flex items-center space-x-1"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
