'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { CampaignCard } from '@/components/campaigns/CampaignCard';
import { CampaignForm } from '@/components/campaigns/CampaignForm';
import { GenerateForm } from '@/components/campaigns/GenerateForm';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import { Campaign, CreateCampaignRequest, UpdateCampaignRequest, GenerateCampaignRequest } from '@/types';
import { Plus, Wand2, Search } from 'lucide-react';

export default function Dashboard() {
	const { user, loading } = useAuth();
	const router = useRouter();
	const queryClient = useQueryClient();

	const [showCreateForm, setShowCreateForm] = useState(false);
	const [showGenerateForm, setShowGenerateForm] = useState(false);
	const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
	const [viewingCampaign, setViewingCampaign] = useState<Campaign | null>(null);
	const [searchTerm, setSearchTerm] = useState('');

	// Fetch campaigns
	const { data: campaignsResponse, isLoading, error } = useQuery({
		queryKey: ['campaigns'],
		queryFn: () => api.getCampaigns(),
		enabled: !!user,
	});

	const campaigns = campaignsResponse?.data || [];

	// Filter campaigns based on search term
	const filteredCampaigns = campaigns.filter(campaign =>
		campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
		campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
		campaign.target_audience.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Create campaign mutation
	const createMutation = useMutation({
		mutationFn: (data: CreateCampaignRequest) => api.createCampaign(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['campaigns'] });
			setShowCreateForm(false);
		},
	});

	// Update campaign mutation
	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateCampaignRequest }) =>
			api.updateCampaign(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['campaigns'] });
			setEditingCampaign(null);
		},
	});

	// Delete campaign mutation
	const deleteMutation = useMutation({
		mutationFn: (id: string) => api.deleteCampaign(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['campaigns'] });
		},
	});

	// Generate campaign mutation
	const generateMutation = useMutation({
		mutationFn: (data: GenerateCampaignRequest) => api.generateCampaign(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['campaigns'] });
			setShowGenerateForm(false);
		},
	});

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth');
    }
  }, [loading, user, router]);

  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

	const handleCreateCampaign = async (data: CreateCampaignRequest | UpdateCampaignRequest) => {
		// For create form, we know it's CreateCampaignRequest
		await createMutation.mutateAsync(data as CreateCampaignRequest);
	};

	const handleUpdateCampaign = async (data: CreateCampaignRequest | UpdateCampaignRequest) => {
		if (editingCampaign) {
			// For update form, we know it's UpdateCampaignRequest
			await updateMutation.mutateAsync({ id: editingCampaign.id, data: data as UpdateCampaignRequest });
		}
	};

	const handleDeleteCampaign = async (id: string) => {
		if (confirm('Are you sure you want to delete this campaign?')) {
			await deleteMutation.mutateAsync(id);
		}
	};

	const handleGenerateCampaign = async (data: GenerateCampaignRequest) => {
		await generateMutation.mutateAsync(data);
	};

	if (loading || isLoading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading campaigns...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Header />
				<main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
					<div className="text-center">
						<h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Campaigns</h2>
						<p className="text-gray-600 mb-4">
							{error instanceof Error ? error.message : 'An unknown error occurred'}
						</p>
						<Button onClick={() => queryClient.invalidateQueries({ queryKey: ['campaigns'] })}>
							Try Again
						</Button>
					</div>
				</main>
			</div>
		);
	}

	// Show forms
	if (showCreateForm) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Header />
				<main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
					<CampaignForm
						onSubmit={handleCreateCampaign}
						onCancel={() => setShowCreateForm(false)}
						loading={createMutation.isPending}
					/>
				</main>
			</div>
		);
	}

	if (showGenerateForm) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Header />
				<main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
					<GenerateForm
						onSubmit={handleGenerateCampaign}
						onCancel={() => setShowGenerateForm(false)}
						loading={generateMutation.isPending}
					/>
				</main>
			</div>
		);
	}

	if (editingCampaign) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Header />
				<main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
					<CampaignForm
						campaign={editingCampaign}
						onSubmit={handleUpdateCampaign}
						onCancel={() => setEditingCampaign(null)}
						loading={updateMutation.isPending}
					/>
				</main>
			</div>
		);
	}

	if (viewingCampaign) {
		return (
			<div className="min-h-screen bg-gray-50">
				<Header />
				<main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
					<div className="mb-6">
						<Button
							variant="outline"
							onClick={() => setViewingCampaign(null)}
						>
							← Back to Dashboard
						</Button>
					</div>

					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<div className="mb-6">
							<h1 className="text-3xl font-bold text-gray-900 mb-2">
								{viewingCampaign.title}
							</h1>
							<div className="flex items-center space-x-4 text-sm text-gray-600">
								<span className="capitalize">{viewingCampaign.campaign_type}</span>
								<span>•</span>
								<span className="capitalize">{viewingCampaign.status}</span>
								<span>•</span>
								<span>Created {new Date(viewingCampaign.created_at).toLocaleDateString()}</span>
							</div>
						</div>

						<div className="space-y-6">
							<div>
								<h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
								<p className="text-gray-700">{viewingCampaign.description}</p>
							</div>

							<div>
								<h3 className="text-lg font-medium text-gray-900 mb-2">Target Audience</h3>
								<p className="text-gray-700">{viewingCampaign.target_audience}</p>
							</div>

							<div>
								<h3 className="text-lg font-medium text-gray-900 mb-2">Campaign Content</h3>
								<div className="bg-gray-50 border border-gray-200 rounded-md p-4">
									{viewingCampaign.content ? (
										<pre className="whitespace-pre-wrap text-gray-700 font-sans">
											{viewingCampaign.content}
										</pre>
									) : (
										<p className="text-gray-500 italic">No content generated yet</p>
									)}
								</div>
							</div>
						</div>

						<div className="mt-8 flex space-x-4">
							<Button onClick={() => setEditingCampaign(viewingCampaign)}>
								Edit Campaign
							</Button>
							<Button
								variant="danger"
								onClick={() => {
									handleDeleteCampaign(viewingCampaign.id);
									setViewingCampaign(null);
								}}
							>
								Delete Campaign
							</Button>
						</div>
					</div>
				</main>
			</div>
		);
	}

	// Main dashboard view
	return (
		<div className="min-h-screen bg-gray-50">
			<Header />
			<main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-4">
						Campaign Dashboard
					</h1>

					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
						<div className="relative max-w-md w-full">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<input
								type="text"
								placeholder="Search campaigns..."
								className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-500"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
							/>
						</div>

						<div className="flex space-x-3">
							<Button
								onClick={() => setShowCreateForm(true)}
								className="flex items-center space-x-2"
							>
								<Plus className="h-4 w-4" />
								<span>New Campaign</span>
							</Button>

							<Button
								onClick={() => setShowGenerateForm(true)}
								variant="secondary"
								className="flex items-center space-x-2"
							>
								<Wand2 className="h-4 w-4" />
								<span>AI Generate</span>
							</Button>
						</div>
					</div>
				</div>

				{filteredCampaigns.length === 0 ? (
					<div className="text-center py-12">
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							{campaigns.length === 0 ? 'No campaigns yet' : 'No campaigns match your search'}
						</h3>
						<p className="text-gray-600 mb-6">
							{campaigns.length === 0
								? 'Get started by creating your first campaign or using AI to generate one.'
								: 'Try adjusting your search terms.'
							}
						</p>
						{campaigns.length === 0 && (
							<div className="flex justify-center space-x-3">
								<Button onClick={() => setShowCreateForm(true)}>
									Create Campaign
								</Button>
								<Button onClick={() => setShowGenerateForm(true)} variant="secondary">
									AI Generate
								</Button>
							</div>
						)}
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredCampaigns.map((campaign) => (
							<CampaignCard
								key={campaign.id}
								campaign={campaign}
								onEdit={setEditingCampaign}
								onDelete={handleDeleteCampaign}
								onView={setViewingCampaign}
							/>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
