import fs from 'fs/promises';
import path from 'path';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { config } from '../config/config';
import { logger } from './logger';

export interface FileMetadata {
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
  extension: string;
  path: string;
  relativePath: string;
  uploadDate: Date;
}

/**
 * Ensures that a directory exists, creating it if necessary
 */
export const ensureDirectory = async (dirPath: string): Promise<void> => {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
    logger.info(`Created directory: ${dirPath}`);
  }
};

/**
 * Generates a unique filename to prevent conflicts
 */
export const generateUniqueFilename = (originalName: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = path.extname(originalName);
  const baseName = path.basename(originalName, extension);
  
  return `${baseName}-${timestamp}-${random}${extension}`;
};

/**
 * Gets the file extension and validates it against allowed extensions
 */
export const validateFileExtension = (filename: string): boolean => {
  const extension = path.extname(filename).toLowerCase().slice(1);
  return config.allowedExtensions.includes(extension);
};

/**
 * Validates file size against maximum allowed size
 */
export const validateFileSize = (size: number): boolean => {
  return size <= config.maxFileSize;
};

/**
 * Gets the target directory for a file based on upload date
 * Organizes files by year/month structure
 */
export const getTargetDirectory = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  return path.join(config.uploadDir, year.toString(), month);
};

/**
 * Moves a file from source to destination with proper error handling
 */
export const moveFile = async (sourcePath: string, destinationPath: string): Promise<void> => {
  try {
    await ensureDirectory(path.dirname(destinationPath));
    
    // Use stream pipeline for efficient file copying
    await pipeline(
      createReadStream(sourcePath),
      createWriteStream(destinationPath)
    );
    
    // Remove the source file after successful copy
    await fs.unlink(sourcePath);
    
    logger.info(`Moved file from ${sourcePath} to ${destinationPath}`);
  } catch (error) {
    logger.error(`Failed to move file from ${sourcePath} to ${destinationPath}:`, error);
    throw error;
  }
};

/**
 * Deletes a file with error handling
 */
export const deleteFile = async (filePath: string): Promise<void> => {
  try {
    await fs.unlink(filePath);
    logger.info(`Deleted file: ${filePath}`);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      logger.error(`Failed to delete file ${filePath}:`, error);
      throw error;
    }
  }
};

/**
 * Gets file stats and metadata
 */
export const getFileMetadata = async (filePath: string, originalName: string): Promise<FileMetadata> => {
  try {
    const stats = await fs.stat(filePath);
    const extension = path.extname(originalName).toLowerCase();
    const filename = path.basename(filePath);
    
    return {
      filename,
      originalName,
      size: stats.size,
      mimetype: getMimeType(extension),
      extension: extension.slice(1), // Remove the dot
      path: filePath,
      relativePath: path.relative(config.uploadDir, filePath),
      uploadDate: new Date(),
    };
  } catch (error) {
    logger.error(`Failed to get file metadata for ${filePath}:`, error);
    throw error;
  }
};

/**
 * Gets MIME type based on file extension
 */
export const getMimeType = (extension: string): string => {
  const mimeTypes: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  };
  
  return mimeTypes[extension.toLowerCase()] || 'application/octet-stream';
};

/**
 * Lists files in a directory with optional filtering
 */
export const listFiles = async (
  dirPath: string,
  options: {
    recursive?: boolean;
    extensions?: string[];
  } = {}
): Promise<string[]> => {
  try {
    const files: string[] = [];
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory() && options.recursive) {
        const subFiles = await listFiles(fullPath, options);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        if (!options.extensions || options.extensions.includes(path.extname(entry.name).slice(1))) {
          files.push(fullPath);
        }
      }
    }
    
    return files;
  } catch (error) {
    logger.error(`Failed to list files in directory ${dirPath}:`, error);
    throw error;
  }
};

/**
 * Cleans up temporary files older than specified age
 */
export const cleanupTempFiles = async (maxAge: number = 24 * 60 * 60 * 1000): Promise<void> => {
  try {
    const tempDir = path.join(config.uploadDir, 'temp');
    const files = await listFiles(tempDir);
    const now = Date.now();
    
    for (const filePath of files) {
      try {
        const stats = await fs.stat(filePath);
        const fileAge = now - stats.mtime.getTime();
        
        if (fileAge > maxAge) {
          await deleteFile(filePath);
        }
      } catch (error) {
        logger.warn(`Failed to check/delete temp file ${filePath}:`, error);
      }
    }
    
    logger.info(`Cleaned up temporary files older than ${maxAge}ms`);
  } catch (error) {
    logger.error('Failed to cleanup temporary files:', error);
  }
};
