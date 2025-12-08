# Backend API Specification: Investigation/Case Management

This document provides the complete API specification for the Investigation (Case Management) feature. It is intended for backend developer to implement the required endpoints.

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Data Models](#data-models)
4. [API Endpoints](#api-endpoints)
5. [Database Schema](#database-schema)
6. [Implementation Notes](#implementation-notes)

---

## Overview

The Investigation/Case Management module enables analysts to:
- Create and manage investigations (cases)
- Add structured journal notes (hypotheses, findings, leads, decisions)
- Link organizations and affiliates to investigations with role context
- Track investigation activity through auto-generated timelines
- Filter, search, and organize investigations by status, priority, and tags

### Design Principles
- **Single-user MVP**: Initial implementation focuses on single-user workflows
- **Multi-user ready**: Data models include fields for future collaboration (`assigneeId`, `collaboratorIds`)
- **Soft delete optional**: Consider implementing soft delete for investigations and notes
- **Audit trail**: Timeline events provide complete activity history

---

## Authentication

All endpoints require authentication. Use the existing authentication mechanism from the search API.

```
Authorization: Bearer <token>
```

---

## Data Models

### Investigation

```typescript
interface Investigation {
  id: string;                        // UUID, primary key
  caseNumber: string;                // Auto-generated, format: "INV-YYYY-NNNN"
  title: string;                     // Required, max 200 chars
  description: string;               // Required, max 5000 chars
  status: InvestigationStatus;       // Enum: 'draft' | 'active' | 'on-hold' | 'closed'
  closureReason: InvestigationClosureReason | null; // Enum: 'resolved' | 'unresolved' | 'archived' | null
  priority: InvestigationPriority;   // Enum: 'low' | 'medium' | 'high' | 'critical'
  tags: string[];                    // Array of tag strings
  assigneeId: string | null;         // User ID (for future multi-user)
  collaboratorIds: string[];         // Array of user IDs (for future multi-user)
  createdAt: string;                 // ISO 8601 timestamp
  updatedAt: string;                 // ISO 8601 timestamp
  closedAt: string | null;           // ISO 8601 timestamp, set when status → 'closed'
  createdBy: string;                 // User ID who created
}
```

### InvestigationNote (Journal Entry)

```typescript
interface InvestigationNote {
  id: string;                        // UUID, primary key
  investigationId: string;           // Foreign key → Investigation.id
  entryType: InvestigationNoteType;  // Enum: 'hypothesis' | 'finding' | 'lead' | 'decision' | 'general'
  title: string;                     // Required, max 200 chars
  content: string;                   // Markdown content, max 50000 chars
  createdAt: string;                 // ISO 8601 timestamp
  updatedAt: string;                 // ISO 8601 timestamp
  createdBy: string;                 // User ID who created
  isPinned: boolean;                 // Whether pinned to top of list
}
```

### InvestigationEntity (Linked Entity)

```typescript
interface InvestigationEntity {
  id: string;                        // UUID, primary key
  investigationId: string;           // Foreign key → Investigation.id
  entityType: 'organization' | 'affiliate';
  organizationId: number | null;     // Foreign key → organizations table (if entityType = 'organization')
  affiliateId: string | null;        // Foreign key → affiliates table (if entityType = 'affiliate')
  role: InvestigationEntityRole;     // Enum: 'subject' | 'associate' | 'witness' | 'company-of-interest' | 'other'
  notes: string | null;              // Context about why entity was linked, max 2000 chars
  linkedAt: string;                  // ISO 8601 timestamp
  linkedBy: string;                  // User ID who linked
  entitySnapshot: object;            // JSON snapshot of entity data at link time
}
```

### InvestigationTimelineEvent

```typescript
interface InvestigationTimelineEvent {
  id: string;                        // UUID, primary key
  investigationId: string;           // Foreign key → Investigation.id
  eventType: InvestigationTimelineEventType; // See enum below
  description: string;               // Human-readable description
  metadata: object | null;           // JSON with event-specific data
  occurredAt: string;                // ISO 8601 timestamp
  triggeredBy: string;               // User ID who triggered the event
}

// Timeline event types
type InvestigationTimelineEventType = 
  | 'created'
  | 'status_changed'
  | 'entity_added'
  | 'entity_removed'
  | 'note_added'
  | 'note_edited'
  | 'note_deleted'
  | 'priority_changed'
  | 'details_updated'
  | 'collaborator_added'
  | 'collaborator_removed';
```

### InvestigationStats

```typescript
interface InvestigationStats {
  total: number;
  byStatus: {
    draft: number;
    active: number;
    'on-hold': number;
    closed: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}
```

---

## API Endpoints

### Base URL
```
/api/v1/investigations
```

---

### 1. List Investigations

**GET** `/api/v1/investigations`

Returns paginated list of investigations with optional filters.

#### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string or string[] | - | Filter by status(es) |
| `priority` | string or string[] | - | Filter by priority(ies) |
| `search` | string | - | Search in title, description, caseNumber |
| `tags` | string[] | - | Filter by tags (any match) |
| `sortBy` | string | `updatedAt` | Sort field: `createdAt`, `updatedAt`, `priority`, `title` |
| `sortOrder` | string | `desc` | Sort direction: `asc`, `desc` |
| `offset` | number | 0 | Pagination offset |
| `limit` | number | 20 | Page size (max: 100) |

#### Response

```json
{
  "investigations": [
    {
      "id": "uuid",
      "caseNumber": "INV-2025-0042",
      "title": "Apex Global Ventures - Financial Irregularities",
      "description": "Investigation into suspected fraudulent transactions...",
      "status": "active",
      "closureReason": null,
      "priority": "high",
      "tags": ["fraud", "shell-companies"],
      "assigneeId": "user-1",
      "collaboratorIds": ["user-2"],
      "createdAt": "2025-11-15T09:30:00Z",
      "updatedAt": "2025-12-07T14:22:00Z",
      "closedAt": null,
      "createdBy": "user-1"
    }
  ],
  "total": 24,
  "offset": 0,
  "limit": 20,
  "stats": {
    "total": 24,
    "byStatus": { "draft": 3, "active": 12, "on-hold": 4, "closed": 5 },
    "byPriority": { "low": 5, "medium": 10, "high": 7, "critical": 2 }
  }
}
```

---

### 2. Get Investigation Detail

**GET** `/api/v1/investigations/:id`

Returns full investigation with notes, entities, and timeline.

#### Response

```json
{
  "id": "uuid",
  "caseNumber": "INV-2025-0042",
  "title": "Apex Global Ventures - Financial Irregularities",
  "description": "...",
  "status": "active",
  "closureReason": null,
  "priority": "high",
  "tags": ["fraud", "shell-companies"],
  "assigneeId": "user-1",
  "collaboratorIds": ["user-2"],
  "createdAt": "2025-11-15T09:30:00Z",
  "updatedAt": "2025-12-07T14:22:00Z",
  "closedAt": null,
  "createdBy": "user-1",
  "notes": [
    {
      "id": "uuid",
      "investigationId": "uuid",
      "entryType": "hypothesis",
      "title": "Initial Hypothesis: Shell Company Network",
      "content": "Based on preliminary analysis...",
      "createdAt": "2025-11-15T10:00:00Z",
      "updatedAt": "2025-11-15T10:00:00Z",
      "createdBy": "user-1",
      "isPinned": true
    }
  ],
  "entities": [
    {
      "id": "uuid",
      "investigationId": "uuid",
      "entityType": "organization",
      "organizationId": 12345,
      "affiliateId": null,
      "role": "company-of-interest",
      "notes": "Primary subject company",
      "linkedAt": "2025-11-15T09:35:00Z",
      "linkedBy": "user-1",
      "entitySnapshot": { /* OrganizationResult */ }
    }
  ],
  "timeline": [
    {
      "id": "uuid",
      "investigationId": "uuid",
      "eventType": "created",
      "description": "Investigation created",
      "metadata": null,
      "occurredAt": "2025-11-15T09:30:00Z",
      "triggeredBy": "user-1"
    }
  ]
}
```

#### Error Responses

- `404 Not Found`: Investigation with given ID does not exist

---

### 3. Create Investigation

**POST** `/api/v1/investigations`

#### Request Body

```json
{
  "title": "New Investigation Title",
  "description": "Description of the investigation scope...",
  "priority": "medium",
  "tags": ["tag1", "tag2"],
  "status": "draft"
}
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `title` | string | Yes | - | Investigation title |
| `description` | string | Yes | - | Investigation description |
| `priority` | string | No | `medium` | Priority level |
| `tags` | string[] | No | `[]` | Tags array |
| `status` | string | No | `draft` | Initial status |

#### Response

Returns the created `Investigation` object with:
- Auto-generated `id` (UUID)
- Auto-generated `caseNumber` (format: `INV-YYYY-NNNN`)
- `createdAt` and `updatedAt` set to current timestamp
- `createdBy` set to authenticated user
- `assigneeId` set to authenticated user
- `collaboratorIds` set to empty array

#### Side Effects

- Creates a `created` timeline event

---

### 4. Update Investigation

**PATCH** `/api/v1/investigations/:id`

#### Request Body

All fields optional:

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "active",
  "closureReason": null,
  "priority": "high",
  "tags": ["updated", "tags"],
  "assigneeId": "user-2",
  "collaboratorIds": ["user-1", "user-3"]
}
```

#### Response

Returns the updated `Investigation` object.

#### Side Effects

- Updates `updatedAt` timestamp
- If `status` changed to `closed`, sets `closedAt` timestamp
- Creates timeline events for tracked changes:
  - `status_changed` if status changes
  - `priority_changed` if priority changes
  - `details_updated` for other field changes
  - `collaborator_added` / `collaborator_removed` for collaborator changes

#### Error Responses

- `404 Not Found`: Investigation does not exist

---

### 5. Delete Investigation

**DELETE** `/api/v1/investigations/:id`

Permanently deletes an investigation and all related data (notes, entities, timeline).

#### Response

```json
{ "success": true }
```

#### Error Responses

- `404 Not Found`: Investigation does not exist

---

### 6. Add Note to Investigation

**POST** `/api/v1/investigations/:investigationId/notes`

#### Request Body

```json
{
  "entryType": "finding",
  "title": "New Finding Title",
  "content": "Markdown content here...",
  "isPinned": false
}
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `entryType` | string | Yes | - | Note type: hypothesis, finding, lead, decision, general |
| `title` | string | Yes | - | Note title |
| `content` | string | Yes | - | Markdown content |
| `isPinned` | boolean | No | `false` | Pin to top |

#### Response

Returns the created `InvestigationNote` object.

#### Side Effects

- Updates investigation's `updatedAt` timestamp
- Creates `note_added` timeline event

#### Error Responses

- `404 Not Found`: Investigation does not exist

---

### 7. Update Note

**PATCH** `/api/v1/investigations/:investigationId/notes/:noteId`

#### Request Body

All fields optional:

```json
{
  "entryType": "decision",
  "title": "Updated Title",
  "content": "Updated content",
  "isPinned": true
}
```

#### Response

Returns the updated `InvestigationNote` object.

#### Side Effects

- Updates note's `updatedAt` timestamp
- Creates `note_edited` timeline event

#### Error Responses

- `404 Not Found`: Investigation or note does not exist

---

### 8. Delete Note

**DELETE** `/api/v1/investigations/:investigationId/notes/:noteId`

#### Response

```json
{ "success": true }
```

#### Side Effects

- Creates `note_deleted` timeline event

#### Error Responses

- `404 Not Found`: Investigation or note does not exist

---

### 9. Link Entity to Investigation

**POST** `/api/v1/investigations/:investigationId/entities`

#### Request Body

```json
{
  "entityType": "organization",
  "organizationId": 12345,
  "role": "company-of-interest",
  "notes": "Primary subject company",
  "entitySnapshot": { /* Full OrganizationResult or AffiliateResult object */ }
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `entityType` | string | Yes | `organization` or `affiliate` |
| `organizationId` | number | Conditional | Required if entityType is `organization` |
| `affiliateId` | string | Conditional | Required if entityType is `affiliate` |
| `role` | string | Yes | Role: subject, associate, witness, company-of-interest, other |
| `notes` | string | No | Context about linking |
| `entitySnapshot` | object | Yes | Snapshot of entity data at link time |

#### Response

Returns the created `InvestigationEntity` object.

#### Side Effects

- Updates investigation's `updatedAt` timestamp
- Creates `entity_added` timeline event

#### Validation

- Verify the entity (organization or affiliate) exists in the database
- Prevent duplicate entity links (same entity already linked to same investigation)

#### Error Responses

- `404 Not Found`: Investigation does not exist
- `400 Bad Request`: Entity does not exist or already linked
- `422 Unprocessable Entity`: Invalid entity type/ID combination

---

### 10. Unlink Entity from Investigation

**DELETE** `/api/v1/investigations/:investigationId/entities/:entityId`

Where `entityId` is the `InvestigationEntity.id` (the link record ID), not the entity's own ID.

#### Response

```json
{ "success": true }
```

#### Side Effects

- Creates `entity_removed` timeline event

#### Error Responses

- `404 Not Found`: Investigation or entity link does not exist

---

## Database Schema

### PostgreSQL Schema

```sql
-- Enum types
CREATE TYPE investigation_status AS ENUM ('draft', 'active', 'on-hold', 'closed');
CREATE TYPE investigation_closure_reason AS ENUM ('resolved', 'unresolved', 'archived');
CREATE TYPE investigation_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE investigation_note_type AS ENUM ('hypothesis', 'finding', 'lead', 'decision', 'general');
CREATE TYPE investigation_entity_role AS ENUM ('subject', 'associate', 'witness', 'company-of-interest', 'other');
CREATE TYPE investigation_entity_type AS ENUM ('organization', 'affiliate');
CREATE TYPE investigation_timeline_event_type AS ENUM (
  'created', 'status_changed', 'entity_added', 'entity_removed',
  'note_added', 'note_edited', 'note_deleted', 'priority_changed',
  'details_updated', 'collaborator_added', 'collaborator_removed'
);

-- Investigations table
CREATE TABLE investigations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number VARCHAR(20) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  status investigation_status NOT NULL DEFAULT 'draft',
  closure_reason investigation_closure_reason,
  priority investigation_priority NOT NULL DEFAULT 'medium',
  tags TEXT[] NOT NULL DEFAULT '{}',
  assignee_id VARCHAR(50),
  collaborator_ids TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  created_by VARCHAR(50) NOT NULL,
  
  CONSTRAINT valid_closure CHECK (
    (status = 'closed' AND closure_reason IS NOT NULL) OR
    (status != 'closed' AND closure_reason IS NULL)
  )
);

-- Investigation notes table
CREATE TABLE investigation_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investigation_id UUID NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
  entry_type investigation_note_type NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by VARCHAR(50) NOT NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE
);

-- Investigation entities table
CREATE TABLE investigation_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investigation_id UUID NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
  entity_type investigation_entity_type NOT NULL,
  organization_id INTEGER,
  affiliate_id VARCHAR(50),
  role investigation_entity_role NOT NULL,
  notes TEXT,
  linked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  linked_by VARCHAR(50) NOT NULL,
  entity_snapshot JSONB NOT NULL,
  
  CONSTRAINT valid_entity CHECK (
    (entity_type = 'organization' AND organization_id IS NOT NULL AND affiliate_id IS NULL) OR
    (entity_type = 'affiliate' AND affiliate_id IS NOT NULL AND organization_id IS NULL)
  ),
  CONSTRAINT unique_entity_per_investigation UNIQUE (investigation_id, entity_type, organization_id, affiliate_id)
);

-- Investigation timeline events table
CREATE TABLE investigation_timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investigation_id UUID NOT NULL REFERENCES investigations(id) ON DELETE CASCADE,
  event_type investigation_timeline_event_type NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  triggered_by VARCHAR(50) NOT NULL
);

-- Indexes
CREATE INDEX idx_investigations_status ON investigations(status);
CREATE INDEX idx_investigations_priority ON investigations(priority);
CREATE INDEX idx_investigations_created_at ON investigations(created_at DESC);
CREATE INDEX idx_investigations_updated_at ON investigations(updated_at DESC);
CREATE INDEX idx_investigations_tags ON investigations USING GIN(tags);
CREATE INDEX idx_investigations_search ON investigations USING GIN(
  to_tsvector('english', title || ' ' || description || ' ' || case_number)
);

CREATE INDEX idx_notes_investigation ON investigation_notes(investigation_id);
CREATE INDEX idx_notes_entry_type ON investigation_notes(entry_type);
CREATE INDEX idx_notes_created_at ON investigation_notes(created_at DESC);

CREATE INDEX idx_entities_investigation ON investigation_entities(investigation_id);
CREATE INDEX idx_entities_org ON investigation_entities(organization_id) WHERE organization_id IS NOT NULL;
CREATE INDEX idx_entities_affiliate ON investigation_entities(affiliate_id) WHERE affiliate_id IS NOT NULL;

CREATE INDEX idx_timeline_investigation ON investigation_timeline_events(investigation_id);
CREATE INDEX idx_timeline_occurred_at ON investigation_timeline_events(occurred_at DESC);

-- Sequence for case numbers
CREATE SEQUENCE investigation_case_number_seq START 1;

-- Function to generate case numbers
CREATE OR REPLACE FUNCTION generate_case_number()
RETURNS VARCHAR(20) AS $$
BEGIN
  RETURN 'INV-' || EXTRACT(YEAR FROM NOW())::TEXT || '-' || 
         LPAD(nextval('investigation_case_number_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate case number
CREATE OR REPLACE FUNCTION set_case_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.case_number IS NULL THEN
    NEW.case_number := generate_case_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_case_number
  BEFORE INSERT ON investigations
  FOR EACH ROW
  EXECUTE FUNCTION set_case_number();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_investigations_updated_at
  BEFORE UPDATE ON investigations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_update_notes_updated_at
  BEFORE UPDATE ON investigation_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

---

## Implementation Notes

### 1. Case Number Generation

- Format: `INV-{YEAR}-{NNNN}` (e.g., `INV-2025-0042`)
- Use database sequence to ensure uniqueness
- Consider resetting sequence yearly or using continuous numbering

### 2. Timeline Event Creation

Timeline events should be created automatically when:
- Investigation is created
- Status changes
- Priority changes
- Title/description updated
- Collaborators added/removed
- Notes added/edited/deleted
- Entities linked/unlinked

Consider using database triggers or application-level event handlers.

### 3. Entity Snapshot

When linking an entity, capture a JSON snapshot of the entity's current data. This preserves the entity's state at the time of linking, even if the source entity is later updated or deleted.

### 4. Full-Text Search

The `search` parameter should search across:
- Investigation title
- Investigation description
- Case number

Use PostgreSQL full-text search with `to_tsvector` for optimal performance.

### 5. Tags Implementation

- Store as PostgreSQL array (`TEXT[]`)
- Use GIN index for efficient array contains queries
- Validate tag format (no special characters, max length)

### 6. Pagination

- Use offset-based pagination for list endpoints
- Return `total` count for UI pagination controls
- Cap maximum `limit` at 100

### 7. Sorting

Priority sorting should map to numeric values:
- `critical` = 4
- `high` = 3
- `medium` = 2
- `low` = 1

### 8. Future Multi-User Considerations

The `assigneeId` and `collaboratorIds` fields are included for future multi-user support. Current implementation can:
- Set `assigneeId` to the creating user
- Leave `collaboratorIds` empty
- Skip permission checks based on these fields

Future implementation should:
- Validate user IDs against user table
- Filter list by user's accessible investigations
- Add `collaborator_added` / `collaborator_removed` timeline events

### 9. Error Handling

All endpoints should return consistent error responses:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Investigation not found"
  }
}
```

Common error codes:
- `NOT_FOUND` - Resource does not exist
- `VALIDATION_ERROR` - Invalid request payload
- `DUPLICATE_ENTITY` - Entity already linked to investigation
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - User lacks permission

### 10. Rate Limiting

Consider implementing rate limits:
- List endpoint: 100 requests/minute
- Detail endpoint: 200 requests/minute
- Create/Update: 30 requests/minute

---

## Testing Recommendations

1. **Unit Tests**
   - Case number generation
   - Status transition validation
   - Entity link validation

2. **Integration Tests**
   - CRUD operations for all resources
   - Timeline event creation
   - Search and filtering

3. **Performance Tests**
   - List endpoint with large datasets (10k+ investigations)
   - Full-text search performance
   - Concurrent timeline event creation

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-08 | Initial specification |
