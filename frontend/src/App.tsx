import React, { useState, useRef, useEffect } from 'react';
import './App.css';

interface Photo {
  id: string;
  file: File;
  url: string;
  uploadDate: Date;
  name: string;
}

interface PhotoGroup {
  date: string;
  photos: Photo[];
}

function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [draggedPhoto, setDraggedPhoto] = useState<Photo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const photo: Photo = {
          id: Date.now() + Math.random().toString(),
          file,
          url: URL.createObjectURL(file),
          uploadDate: new Date(),
          name: file.name
        };
        setPhotos(prev => [...prev, photo]);
      }
    });

    // 重置文件输入的值，确保可以重复选择相同文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 按日期分组照片
  const groupPhotosByDate = (photos: Photo[]): PhotoGroup[] => {
    const groups: { [key: string]: Photo[] } = {};
    
    photos.forEach(photo => {
      const dateKey = photo.uploadDate.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(photo);
    });

    return Object.entries(groups)
      .map(([date, photos]) => ({ date, photos }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // 拖拽开始
  const handleDragStart = (photo: Photo) => {
    setDraggedPhoto(photo);
  };

  // 拖拽结束
  const handleDragEnd = () => {
    setDraggedPhoto(null);
  };

  // 处理拖拽排序
  const handleDrop = (targetPhoto: Photo, event: React.DragEvent) => {
    event.preventDefault();
    if (!draggedPhoto || draggedPhoto.id === targetPhoto.id) return;

    setPhotos(prev => {
      const newPhotos = [...prev];
      const draggedIndex = newPhotos.findIndex(p => p.id === draggedPhoto.id);
      const targetIndex = newPhotos.findIndex(p => p.id === targetPhoto.id);
      
      // 移除拖拽的元素
      const [draggedItem] = newPhotos.splice(draggedIndex, 1);
      // 插入到目标位置
      newPhotos.splice(targetIndex, 0, draggedItem);
      
      return newPhotos;
    });
  };

  // 删除照片
  const deletePhoto = (photoId: string) => {
    setPhotos(prev => {
      const photoToDelete = prev.find(p => p.id === photoId);
      if (photoToDelete) {
        // 释放内存中的 URL 对象
        URL.revokeObjectURL(photoToDelete.url);
      }
      return prev.filter(p => p.id !== photoId);
    });
  };

  const photoGroups = groupPhotosByDate(photos);

  // 组件卸载时清理 URL 对象
  useEffect(() => {
    return () => {
      photos.forEach(photo => {
        URL.revokeObjectURL(photo.url);
      });
    };
  }, [photos]);

  return (
    <div className="photo-manager">
      <header className="header">
        <h1>📸 照片管理系统</h1>
        <p>上传照片，按日期分组，支持拖拽排序</p>
      </header>

      <div className="upload-section">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <button 
          className="upload-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          📁 选择照片上传
        </button>
        <p className="upload-hint">支持多选，只能上传图片文件</p>
      </div>

      <div className="stats">
        <span>总共 {photos.length} 张照片</span>
        <span>分布在 {photoGroups.length} 个日期</span>
      </div>

      <div className="photo-groups">
        {photoGroups.length === 0 ? (
          <div className="empty-state">
            <p>🖼️ 还没有上传任何照片</p>
            <p>点击上方按钮开始上传照片吧！</p>
          </div>
        ) : (
          photoGroups.map(group => (
            <div key={group.date} className="photo-group">
              <h3 className="group-date">
                📅 {new Date(group.date).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                })}
                <span className="photo-count">({group.photos.length} 张)</span>
              </h3>
              <div className="photo-grid">
                {group.photos.map(photo => (
                  <div
                    key={photo.id}
                    className={`photo-item ${draggedPhoto?.id === photo.id ? 'dragging' : ''}`}
                    draggable
                    onDragStart={() => handleDragStart(photo)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(photo, e)}
                  >
                    <img src={photo.url} alt={photo.name} />
                    <div className="photo-overlay">
                      <span className="photo-name">{photo.name}</span>
                      <button 
                        className="delete-btn"
                        onClick={() => deletePhoto(photo.id)}
                        title="删除照片"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
