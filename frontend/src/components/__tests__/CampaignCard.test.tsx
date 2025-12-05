import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CampaignCard } from '../campaigns/CampaignCard';
import { Campaign } from '@/types';

const mockCampaign: Campaign = {
  id: '1',
  user_id: 'user1',
  title: 'Test Campaign',
  description: 'This is a test campaign description',
  target_audience: 'Young adults 18-35',
  campaign_type: 'email',
  content: 'Test campaign content',
  status: 'draft',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

describe('CampaignCard Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnView = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders campaign information correctly', () => {
    render(
      <CampaignCard
        campaign={mockCampaign}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onView={mockOnView}
      />
    );

    expect(screen.getByText('Test Campaign')).toBeInTheDocument();
    expect(screen.getByText(/This is a test campaign description/)).toBeInTheDocument();
    expect(screen.getByText('Young adults 18-35')).toBeInTheDocument();
    expect(screen.getByText('email')).toBeInTheDocument();
    expect(screen.getByText('draft')).toBeInTheDocument();
  });

  it('displays campaign type icon', () => {
    render(
      <CampaignCard
        campaign={mockCampaign}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onView={mockOnView}
      />
    );

    // Check for email icon (📧)
    expect(screen.getByText('📧')).toBeInTheDocument();
  });

  it('shows status with correct styling', () => {
    render(
      <CampaignCard
        campaign={mockCampaign}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onView={mockOnView}
      />
    );

    const statusElement = screen.getByText('draft');
    expect(statusElement).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  it('calls onView when View button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CampaignCard
        campaign={mockCampaign}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onView={mockOnView}
      />
    );

    const viewButton = screen.getByRole('button', { name: /view/i });
    await user.click(viewButton);
    
    expect(mockOnView).toHaveBeenCalledWith(mockCampaign);
  });

  it('calls onEdit when Edit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CampaignCard
        campaign={mockCampaign}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onView={mockOnView}
      />
    );

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockCampaign);
  });

  it('calls onDelete when Delete button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <CampaignCard
        campaign={mockCampaign}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onView={mockOnView}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith(mockCampaign.id);
  });

  it('truncates long descriptions', () => {
    const longDescriptionCampaign = {
      ...mockCampaign,
      description: 'a'.repeat(200), // Very long description
    };

    render(
      <CampaignCard
        campaign={longDescriptionCampaign}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onView={mockOnView}
      />
    );

    const description = screen.getByText(/a+\.\.\./); // Should end with ...
    expect(description).toBeInTheDocument();
  });

  it('formats creation date correctly', () => {
    render(
      <CampaignCard
        campaign={mockCampaign}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onView={mockOnView}
      />
    );

    // The exact format may vary based on locale, but should contain date elements
    expect(screen.getByText(/Jan.*1.*2024/)).toBeInTheDocument();
  });
});
