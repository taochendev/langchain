# Campaign Generator API Documentation

Base URL: `http://localhost:3001/api`

## Authentication

All API endpoints (except `/health`) require authentication. Include the Supabase JWT token in the Authorization header:

```
Authorization: Bearer <your-supabase-jwt-token>
```

## Endpoints

### Health Check

#### GET `/health`
Check API status

**Response:**
```json
{
  "success": true,
  "message": "Campaign Generator API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Campaigns

#### GET `/campaigns`
Get all campaigns for the authenticated user

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "title": "Summer Sale Campaign",
      "description": "Promote summer discounts",
      "target_audience": "Young adults 18-35",
      "campaign_type": "email",
      "content": "Generated content...",
      "status": "draft",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
```

#### GET `/campaigns/:id`
Get a specific campaign by ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "title": "Summer Sale Campaign",
    "description": "Promote summer discounts",
    "target_audience": "Young adults 18-35",
    "campaign_type": "email",
    "content": "Generated content...",
    "status": "draft",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### POST `/campaigns`
Create a new campaign

**Request Body:**
```json
{
  "title": "Summer Sale Campaign",
  "description": "Promote summer discounts",
  "target_audience": "Young adults 18-35",
  "campaign_type": "email"
}
```

**Validation Rules:**
- `title`: Required, 1-200 characters
- `description`: Required, 1-1000 characters
- `target_audience`: Required, 1-500 characters
- `campaign_type`: Required, one of: "email", "social", "web", "print"

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "title": "Summer Sale Campaign",
    "description": "Promote summer discounts",
    "target_audience": "Young adults 18-35",
    "campaign_type": "email",
    "content": "",
    "status": "draft",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "message": "Campaign created successfully"
}
```

#### PUT `/campaigns/:id`
Update an existing campaign

**Request Body (all fields optional):**
```json
{
  "title": "Updated Campaign Title",
  "description": "Updated description",
  "target_audience": "Updated audience",
  "campaign_type": "social",
  "content": "Updated content",
  "status": "active"
}
```

**Validation Rules:**
- `title`: Optional, 1-200 characters
- `description`: Optional, 1-1000 characters
- `target_audience`: Optional, 1-500 characters
- `campaign_type`: Optional, one of: "email", "social", "web", "print"
- `content`: Optional, max 10000 characters
- `status`: Optional, one of: "draft", "active", "completed", "paused"

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "title": "Updated Campaign Title",
    "description": "Updated description",
    "target_audience": "Updated audience",
    "campaign_type": "social",
    "content": "Updated content",
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:30Z"
  },
  "message": "Campaign updated successfully"
}
```

#### DELETE `/campaigns/:id`
Delete a campaign

**Response:**
```json
{
  "success": true,
  "message": "Campaign deleted successfully"
}
```

#### POST `/campaigns/generate`
Generate campaign content using AI

**Request Body:**
```json
{
  "title": "Summer Sale Campaign",
  "description": "Promote summer discounts",
  "target_audience": "Young adults 18-35",
  "campaign_type": "email",
  "tone": "friendly",
  "length": "medium"
}
```

**Validation Rules:**
- `title`: Required, 1-200 characters
- `description`: Required, 1-1000 characters
- `target_audience`: Required, 1-500 characters
- `campaign_type`: Required, one of: "email", "social", "web", "print"
- `tone`: Optional, one of: "professional", "casual", "friendly", "persuasive" (default: "professional")
- `length`: Optional, one of: "short", "medium", "long" (default: "medium")

**Rate Limit:** 10 requests per 15 minutes per IP

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "title": "Summer Sale Campaign",
    "description": "Promote summer discounts",
    "target_audience": "Young adults 18-35",
    "campaign_type": "email",
    "content": "AI generated campaign content...",
    "status": "draft",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "generatedContent": "AI generated campaign content...",
  "message": "Campaign generated successfully"
}
```

## Error Responses

All endpoints may return the following error formats:

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation error",
  "errors": ["Title is required", "Description must be at least 1 character"]
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "message": "No token provided"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Campaign not found"
}
```

### Rate Limit Error (429)
```json
{
  "success": false,
  "message": "Too many generation requests, please try again later."
}
```

### Internal Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Rate Limiting

- General endpoints: 100 requests per 15 minutes per IP
- AI generation endpoint: 10 requests per 15 minutes per IP

## Notes

- All timestamps are in ISO 8601 format with timezone
- UUIDs are used for all IDs
- Content field can store up to 10,000 characters
- The API uses Row Level Security (RLS) to ensure users can only access their own campaigns
