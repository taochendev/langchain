'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GenerateCampaignRequest } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';

const generateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  target_audience: z.string().min(1, 'Target audience is required').max(500, 'Target audience must be less than 500 characters'),
  campaign_type: z.enum(['email', 'social', 'web', 'print'], {
    message: 'Campaign type is required',
  }),
  tone: z.enum(['professional', 'casual', 'friendly', 'persuasive']).optional(),
  length: z.enum(['short', 'medium', 'long']).optional(),
});

type GenerateFormData = z.infer<typeof generateSchema>;

interface GenerateFormProps {
  onSubmit: (data: GenerateCampaignRequest) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const campaignTypeOptions = [
  { value: 'email', label: 'Email Campaign' },
  { value: 'social', label: 'Social Media' },
  { value: 'web', label: 'Web Campaign' },
  { value: 'print', label: 'Print Media' },
];

const toneOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'persuasive', label: 'Persuasive' },
];

const lengthOptions = [
  { value: 'short', label: 'Short (100-200 words)' },
  { value: 'medium', label: 'Medium (200-400 words)' },
  { value: 'long', label: 'Long (400-600 words)' },
];

export function GenerateForm({ onSubmit, onCancel, loading }: GenerateFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GenerateFormData>({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      campaign_type: 'email',
      tone: 'professional',
      length: 'medium',
    },
  });

  const handleFormSubmit = async (data: GenerateFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } catch (error) {
      console.error('Generate form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🤖 AI Campaign Generator</CardTitle>
        <CardDescription>
          Provide details about your campaign and let AI generate compelling content for you
        </CardDescription>
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
            label="Campaign Description"
            {...register('description')}
            error={errors.description?.message}
            placeholder="Describe your campaign goals, key messages, and what you want to achieve"
            rows={4}
          />

          <Textarea
            label="Target Audience"
            {...register('target_audience')}
            error={errors.target_audience?.message}
            placeholder="Describe your target audience in detail (demographics, interests, pain points, etc.)"
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Campaign Type"
              {...register('campaign_type')}
              error={errors.campaign_type?.message}
              options={campaignTypeOptions}
              placeholder="Select campaign type"
            />

            <Select
              label="Tone"
              {...register('tone')}
              error={errors.tone?.message}
              options={toneOptions}
            />
          </div>

          <Select
            label="Content Length"
            {...register('length')}
            error={errors.length?.message}
            options={lengthOptions}
          />

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Tips for better results:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Be specific about your target audience</li>
              <li>• Include key benefits or value propositions in the description</li>
              <li>• Mention any specific calls-to-action you want</li>
              <li>• Consider seasonal or timing factors</li>
            </ul>
          </div>

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
              className="min-w-[140px]"
            >
              Generate Campaign
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
