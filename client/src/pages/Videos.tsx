/**
 * 备份文件：Videos 组件的旧版本
 * 日期：2023-05-25
 * 原因：保留以供将来参考
 * 注意：此文件当前未在项目中使用
 */


import React, { useState } from 'react';
import { Play } from 'lucide-react';
import BottomNav from '../components/BottomNav';
// Vimeo 视频 ID 数组
const videoIds = [
  '1054848193?h=2e47ea989d',
  '1054848209?h=e705167548',
  '1054848219?h=22ec4246ed',
  '1054848232?h=5194683afb',
  '1054848248?h=ccae2c6ca5',
  '1054848255?h=5ad28fb76c',
  '1054848261?h=43da8c2ffb',
  '1054848276?h=491f885121',
  '1054848296?h=1a07be9e3c',
  '1054848316?h=36ea7e9282',
  '1054848333?h=8a745e4f17',
  '1054848348?h=1cce4e0cc8',
  '1054848366?h=75fb41ea57',
  '1054848377?h=f3accf2201',
  '1054848386?h=b4c8ddeb2f',
   // 添加更多的视频 ID...
];

// 生成视频数据，使用从 videoIds 数组中获取的 ID
const generateVideos = () => {
  return videoIds.map((id, index) => {
    const separator = id.includes('?') ? '&' : '?';
    return {
      id: index + 1,  // 为每个视频分配一个 ID
      title: `인기 최고 비디오 ${index + 1}`,  // 视频标题
      thumbnail: `/images/thumbnail-${index + 1}.jpg`,  // 缩略图
      url: `https://player.vimeo.com/video/${id}${separator}badge=0&byline=0&portrait=0`,  // 根据 id 是否包含查询参数选择正确的分隔符
    };
  });
};

const VIDEOS_PER_PAGE = 12;
const ALL_VIDEOS = generateVideos();  // 生成所有的视频数据

function Videos() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const totalPages = Math.ceil(ALL_VIDEOS.length / VIDEOS_PER_PAGE);
  const currentVideos = ALL_VIDEOS.slice(
    (currentPage - 1) * VIDEOS_PER_PAGE,
    currentPage * VIDEOS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#8c52ff] to-[#ff914d] pb-20">
      <div className="bg-blue-600 text-white p-4 rounded-b-lg">
        <h1 className="text-2xl font-bold">비디오 목록</h1>
      </div>

      {/* 当选中视频时，显示视频播放器 */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="relative w-full max-w-4xl aspect-video">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-2 right-2 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition-all"
              aria-label="关闭视频"
            >
              ×
            </button>
            <iframe
              title="온라인으로 시청 중..."
              src={selectedVideo}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* 视频列表 */}
      <div className="grid grid-cols-2 gap-4 p-4">
        {currentVideos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
            <div className="relative">
              <img src={video.thumbnail} alt={video.title} className="w-full aspect-video object-cover" />
              <button
                onClick={() => setSelectedVideo(video.url)}
                aria-label={`비디오 재생：${video.title}`}
                className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              >
                <Play className="w-12 h-12 text-white" />
              </button>
            </div>
            <div className="p-2">
              <h3 className="text-sm font-medium text-gray-800">{video.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 分页 */}
      <div className="flex justify-center gap-2 my-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-8 h-8 rounded-full ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} hover:bg-blue-500 hover:text-white transition-all`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

//export default Videos;
