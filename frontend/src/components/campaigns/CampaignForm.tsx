'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Campaign, CreateCampaignRequest, UpdateCampaignRequest } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const campaignSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  target_audience: z.string().min(1, 'Target audience is required').max(500, 'Target audience must be less than 500 characters'),
  campaign_type: z.enum(['email', 'social', 'web', 'print'], {
    message: 'Campaign type is required',
  }),
  content: z.string().optional(),
  status: z.enum(['draft', 'active', 'completed', 'paused']).optional(),
});

type CampaignFormData = z.infer<typeof campaignSchema>;

interface CampaignFormProps {
  campaign?: Campaign;
  onSubmit: (data: CreateCampaignRequest | UpdateCampaignRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const campaignTypeOptions = [
  { value: 'email', label: 'Email Campaign' },
  { value: 'social', label: 'Social Media' },
  { value: 'web', label: 'Web Campaign' },
  { value: 'print', label: 'Print Media' },
];

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'paused', label: 'Paused' },
];

export function CampaignForm({ campaign, onSubmit, onCancel, loading }: CampaignFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!campaign;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignSchema),
    defaultValues: campaign ? {
      title: campaign.title,
      description: campaign.description,
      target_audience: campaign.target_audience,
      campaign_type: campaign.campaign_type,
      content: campaign.content,
      status: campaign.status,
    } : {
      campaign_type: 'email',
      status: 'draft',
    },
  });

  useEffect(() => {
    if (campaign) {
      reset({
        title: campaign.title,
        description: campaign.description,
        target_audience: campaign.target_audience,
        campaign_type: campaign.campaign_type,
        content: campaign.content,
        status: campaign.status,
      });
    }
  }, [campaign, reset]);

  const handleFormSubmit = async (data: CampaignFormData) => {
    try {
      setIsSubmitting(true);
      
      if (isEditing) {
        const updateData: UpdateCampaignRequest = {
          title: data.title,
          description: data.description,
          target_audience: data.target_audience,
          campaign_type: data.campaign_type,
          content: data.content,
          status: data.status,
        };
        await onSubmit(updateData);
      } else {
        const createData: CreateCampaignRequest = {
          title: data.title,
          description: data.description,
          target_audience: data.target_audience,
          campaign_type: data.campaign_type,
        };
        await onSubmit(createData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Campaign' : 'Create New Campaign'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <Input
            label="Campaign Title"
            {...register('title')}
            error={errors.title?.message}
            placeholder="Enter campaign title"
          />

          <Textarea
            label="Description"
            {...register('description')}
            error={errors.description?.message}
            placeholder="Describe your campaign goals and key messages"
            rows={4}
          />

          <Textarea
            label="Target Audience"
            {...register('target_audience')}
            error={errors.target_audience?.message}
            placeholder="Describe your target audience (demographics, interests, etc.)"
            rows={3}
          />

          <Select
            label="Campaign Type"
            {...register('campaign_type')}
            error={errors.campaign_type?.message}
            options={campaignTypeOptions}
            placeholder="Select campaign type"
          />

          {isEditing && (
            <>
              <Textarea
                label="Content"
                {...register('content')}
                error={errors.content?.message}
                placeholder="Campaign content"
                rows={6}
              />

              <Select
                label="Status"
                {...register('status')}
                error={errors.status?.message}
                options={statusOptions}
              />
            </>
          )}

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting || loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isSubmitting || loading}
            >
              {isEditing ? 'Update Campaign' : 'Create Campaign'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
