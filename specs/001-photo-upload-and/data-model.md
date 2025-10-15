# Data Model: Photo Management System

**Feature**: Photo Upload and Organization
**Date**: 2025-10-15
**Status**: Complete

## Core Entities

### Photo Entity

**Purpose**: Represents an individual photo file with its metadata and organization information.

**Attributes**:
- `id`: Unique identifier (UUID)
- `filename`: Original filename from user upload
- `fileHash`: SHA-256 hash for duplicate detection
- `filePath`: Relative path to original file in storage
- `thumbnailPath`: Relative path to thumbnail file
- `fileSize`: Size in bytes
- `mimeType`: MIME type (image/jpeg, image/png, etc.)
- `width`: Image width in pixels
- `height`: Image height in pixels
- `createdDate`: Date photo was taken (from EXIF metadata)
- `uploadedDate`: Date photo was uploaded to system
- `sortOrder`: Custom sort position within date group
- `isDeleted`: Soft delete flag

**Validation Rules**:
- `fileSize` must be ≤ 50MB (52,428,800 bytes)
- `mimeType` must be in allowed list: image/jpeg, image/png, image/webp, image/heic
- `createdDate` defaults to `uploadedDate` if EXIF data unavailable
- `sortOrder` defaults to chronological order within date group
- `fileHash` must be unique across all non-deleted photos

**State Transitions**:
- Uploaded → Processing → Ready
- Ready → Deleted (soft delete)
- Deleted → Purged (hard delete after retention period)

### DateGroup Entity

**Purpose**: Logical grouping of photos by date for organization and display.

**Attributes**:
- `id`: Unique identifier (UUID)
- `date`: Date for this group (YYYY-MM-DD format)
- `displayName`: Human-readable date label ("Today", "Yesterday", "March 15, 2025")
- `photoCount`: Number of photos in this group
- `totalSize`: Total file size of all photos in group
- `createdDate`: When this group was first created
- `lastModified`: When group was last updated

**Validation Rules**:
- `date` must be valid date in YYYY-MM-DD format
- `photoCount` and `totalSize` are computed fields, updated automatically
- Groups with `photoCount` = 0 are automatically removed

**Relationships**:
- One DateGroup contains many Photos (1:N)
- Photos are sorted within DateGroup by `sortOrder`, then `createdDate`

### User Entity (Future Enhancement)

**Purpose**: User account for multi-user support (currently single-user but designed for expansion).

**Attributes**:
- `id`: Unique identifier (UUID)
- `username`: Unique username
- `email`: Email address
- `createdDate`: Account creation date
- `lastLoginDate`: Last login timestamp
- `storageQuota`: Maximum storage allowed (bytes)
- `storageUsed`: Current storage usage (bytes)

**Note**: Currently designed for single-user deployment but schema supports multi-user expansion.

## Data Relationships

```
User (1) ──┐
           │
           ├─ owns ──> Photos (N)
           │
           └─ owns ──> DateGroups (N)

DateGroup (1) ──── contains ──> Photos (N)

Photo ─── references ──> FileSystem (originals/ and thumbnails/)
```

## Storage Schema

### File System Layout

```
uploads/
├── originals/           # Original uploaded photos
│   ├── 2025/
│   │   ├── 01/
│   │   │   ├── 15/      # YYYY/MM/DD structure
│   │   │   │   ├── a1b2c3d4...sha256.jpg
│   │   │   │   └── e5f6g7h8...sha256.png
│   │   │   └── 16/
│   │   └── 02/
│   └── 2024/
└── thumbnails/          # Generated thumbnail images
    ├── 150/             # 150px thumbnails for grid view
    │   ├── 2025/01/15/
    │   │   ├── a1b2c3d4...sha256.webp
    │   │   └── e5f6g7h8...sha256.webp
    └── 300/             # 300px thumbnails for preview
        └── 2025/01/15/
```

### Database Schema (JSON File Storage)

For simplicity, using JSON file storage that can easily migrate to SQL database:

```json
{
  "photos": [
    {
      "id": "uuid-1234",
      "filename": "IMG_001.jpg",
      "fileHash": "a1b2c3d4e5f6...",
      "filePath": "uploads/originals/2025/01/15/a1b2c3d4...sha256.jpg",
      "thumbnailPath": "uploads/thumbnails/150/2025/01/15/a1b2c3d4...sha256.webp",
      "fileSize": 2485760,
      "mimeType": "image/jpeg",
      "width": 4032,
      "height": 3024,
      "createdDate": "2025-01-15T10:30:00Z",
      "uploadedDate": "2025-01-15T14:45:00Z",
      "sortOrder": 0,
      "isDeleted": false
    }
  ],
  "dateGroups": [
    {
      "id": "uuid-5678",
      "date": "2025-01-15",
      "displayName": "January 15, 2025",
      "photoCount": 12,
      "totalSize": 34567890,
      "createdDate": "2025-01-15T14:45:00Z",
      "lastModified": "2025-01-15T16:20:00Z"
    }
  ]
}
```

## Data Access Patterns

### Photo Upload Flow

1. **Validate** file type and size
2. **Generate** file hash for duplicate check
3. **Create** Photo entity with processing status
4. **Store** original file in dated directory structure
5. **Extract** EXIF metadata for creation date
6. **Generate** thumbnails in multiple sizes
7. **Update** Photo entity with complete metadata
8. **Create or update** DateGroup based on photo date
9. **Return** Photo entity to client

### Date Group Display Flow

1. **Query** DateGroups ordered by date descending
2. **For each** DateGroup, query Photos ordered by sortOrder, createdDate
3. **Load** thumbnail paths for efficient display
4. **Return** structured data for UI rendering

### Photo Reordering Flow

1. **Validate** drag operation within same DateGroup
2. **Calculate** new sortOrder values for affected photos
3. **Update** Photo entities with new sortOrder
4. **Update** DateGroup lastModified timestamp
5. **Return** success confirmation

### Duplicate Detection Flow

1. **Calculate** SHA-256 hash of uploaded file
2. **Query** existing Photos by fileHash
3. **If match found**, return duplicate error with existing photo info
4. **If no match**, proceed with normal upload flow

## Performance Considerations

### Indexing Strategy

For future database migration, recommended indexes:
- `photos.fileHash` (unique) - for duplicate detection
- `photos.createdDate` - for date-based queries
- `photos.isDeleted` - for filtering active photos
- `dateGroups.date` - for chronological ordering

### Caching Strategy

- **In-memory cache** for frequently accessed DateGroups
- **File system cache** for thumbnail images
- **ETag headers** for browser caching of static assets
- **Cache invalidation** on photo add/remove/reorder operations

### Data Migration Path

Current JSON storage designed for easy migration to:
- **SQLite** for single-user installations
- **PostgreSQL** for multi-user deployments
- **MongoDB** for document-based scaling

Migration scripts will preserve all relationships and data integrity constraints.
