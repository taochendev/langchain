import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'completed':
      return 'bg-blue-100 text-blue-800';
    case 'paused':
      return 'bg-yellow-100 text-yellow-800';
    case 'draft':
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getCampaignTypeIcon(type: string): string {
  switch (type) {
    case 'email':
      return '📧';
    case 'social':
      return '📱';
    case 'web':
      return '🌐';
    case 'print':
      return '🖨️';
    default:
      return '📄';
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
