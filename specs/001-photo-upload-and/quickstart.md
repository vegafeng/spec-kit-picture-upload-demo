# Quick Start Guide: Photo Management System

**Feature**: Photo Upload and Organization  
**Date**: 2025-10-15  
**Prerequisites**: Node.js 18+, npm or yarn package manager

## Overview

This guide walks you through setting up and running the Photo Management System locally. The system allows users to upload photos, automatically organize them by date, and manually reorder them within date groups.

## Architecture Summary

- **Frontend**: React 18+ application with file upload and drag-and-drop interfaces
- **Backend**: Node.js + Express.js REST API for photo management
- **Storage**: Local file system with organized directory structure
- **Processing**: Sharp library for thumbnail generation and image optimization

## Installation

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd photo-management-system

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Backend Setup

```bash
cd backend

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# PORT=3000
# UPLOAD_PATH=./uploads
# MAX_FILE_SIZE=52428800
# ALLOWED_MIME_TYPES=image/jpeg,image/png,image/webp,image/heic

# Create upload directories
mkdir -p uploads/originals uploads/thumbnails/150 uploads/thumbnails/300

# Start development server
npm run dev
```

The backend will start on `http://localhost:3000`

### 3. Frontend Setup

```bash
cd frontend

# Create environment file
cp .env.example .env

# Edit .env with API configuration
# REACT_APP_API_URL=http://localhost:3000/api

# Start development server
npm start
```

The frontend will start on `http://localhost:3001`

## Basic Usage

### Upload Photos

1. Open `http://localhost:3001` in your browser
2. Click "Upload Photos" button or drag files onto the upload area
3. Select one or more image files (JPEG, PNG, WebP, HEIC)
4. Photos will automatically upload and appear organized by date

### Organize Photos

1. Photos are automatically grouped by the date they were taken
2. Within each date group, you can drag photos to reorder them
3. Changes are saved automatically
4. Use batch selection to delete multiple photos

### View Photos

1. Click on any photo thumbnail to view the full-size image
2. Use keyboard arrows to navigate between photos
3. Date groups show photo count and total size
4. Scroll through timeline to browse photos by date

## API Examples

### Upload a Photo

```bash
curl -X POST http://localhost:3000/api/photos \
  -F "photos=@/path/to/photo.jpg" \
  -H "Content-Type: multipart/form-data"
```

### Get All Photos by Date

```bash
curl http://localhost:3000/api/photos
```

### Reorder Photos in Date Group

```bash
curl -X PUT http://localhost:3000/api/date-groups/2025-01-15/reorder \
  -H "Content-Type: application/json" \
  -d '{"photoIds": ["uuid1", "uuid2", "uuid3"]}'
```

## Development Workflow

### Running Tests

```bash
# Backend tests
cd backend
npm test                    # Unit tests
npm run test:integration   # Integration tests
npm run test:coverage      # Coverage report

# Frontend tests
cd frontend
npm test                   # Component tests
npm run test:e2e          # End-to-end tests
```

### Code Quality

```bash
# Linting and formatting
npm run lint               # ESLint check
npm run lint:fix           # Auto-fix linting issues
npm run format             # Prettier formatting

# Type checking (if using TypeScript)
npm run type-check
```

### Building for Production

```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build

# The built files will be in backend/dist and frontend/build
```

## Configuration Options

### Backend Configuration (.env)

```bash
# Server configuration
PORT=3000
NODE_ENV=development

# Upload configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=52428800        # 50MB in bytes
ALLOWED_MIME_TYPES=image/jpeg,image/png,image/webp,image/heic

# Thumbnail configuration
THUMBNAIL_SIZES=150,300
THUMBNAIL_QUALITY=80
THUMBNAIL_FORMAT=webp

# Performance settings
MAX_CONCURRENT_UPLOADS=5
CACHE_TTL=3600               # 1 hour in seconds
```

### Frontend Configuration (.env)

```bash
# API configuration
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_MAX_FILE_SIZE=52428800
REACT_APP_CHUNK_SIZE=1048576  # 1MB chunks for large uploads

# UI configuration
REACT_APP_GRID_SIZE=150
REACT_APP_PREVIEW_SIZE=300
REACT_APP_ITEMS_PER_PAGE=50
```

## Troubleshooting

### Common Issues

**Upload fails with 413 error**
- Check that file size is under 50MB limit
- Verify MAX_FILE_SIZE configuration in backend

**Photos not showing thumbnails**
- Ensure Sharp library is installed correctly: `npm install sharp`
- Check that uploads/thumbnails directory exists and is writable
- Verify thumbnail generation in backend logs

**Drag and drop not working**
- Ensure modern browser support for HTML5 drag and drop
- Check console for JavaScript errors
- Verify that photos are loaded before attempting to sort

**API requests failing**
- Confirm backend is running on correct port
- Check CORS configuration if frontend and backend on different domains
- Verify API URL in frontend configuration

### Performance Issues

**Slow photo uploads**
- Enable gzip compression in Express middleware
- Consider implementing chunked upload for large files
- Check available disk space in upload directory

**Slow thumbnail loading**
- Verify thumbnail files are being generated correctly
- Check browser network cache settings
- Consider implementing progressive image loading

### Development Tips

**Hot Reloading**
```bash
# Backend with nodemon
npm run dev

# Frontend with React dev server
npm start
```

**Debugging**
```bash
# Backend debugging
DEBUG=photo-management:* npm run dev

# Frontend debugging
REACT_APP_DEBUG=true npm start
```

**Database Inspection**
```bash
# View current data structure
curl http://localhost:3000/api/debug/data

# Reset all data (development only)
curl -X DELETE http://localhost:3000/api/debug/reset
```

## Next Steps

1. **Security Enhancement**: Add user authentication and authorization
2. **Cloud Storage**: Integrate with AWS S3 or similar for scalable storage
3. **Advanced Features**: Add photo editing, face recognition, or geolocation
4. **Mobile App**: Create React Native mobile application
5. **Performance**: Implement image CDN and advanced caching strategies

## Support

For issues and questions:
- Check the [API documentation](contracts/api.yaml) for endpoint details
- Review [data model](data-model.md) for entity relationships
- Consult [research document](research.md) for architectural decisions

## Constitutional Compliance

This implementation maintains the project's constitutional requirements:

- **High Code Quality**: ESLint, Prettier, and code review process enforced
- **Test Coverage**: ≥90% unit test coverage with Jest and React Testing Library
- **Performance**: <200ms API responses, <100ms thumbnail generation
- **Documentation**: Comprehensive API docs, code comments, and user guides
- **Quality Gates**: Automated CI/CD pipeline with no manual bypass capability
