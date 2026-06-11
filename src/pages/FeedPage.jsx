import React, { useState } from 'react';
import {
  PostCard, StoriesRow, Lightbox, RightSidebar,
  StoryViewer, CreateStoryModal
} from '../components/SharedComponents';
import { useApp } from '../context/AppContext';

export default function FeedPage() {
  const { posts, stories, addStory, showToast } = useApp();
  const [lightboxPost, setLightboxPost] = useState(null);
  const [storyViewIndex, setStoryViewIndex] = useState(null); // null = closed, number = open
  const [showCreateStory, setShowCreateStory] = useState(false);

  const handlePublishStory = (storyData) => {
    if (addStory) addStory(storyData);
  };

  return (
    <div className="main-content">
      <div className="main-inner">
        {/* ── Feed Column ── */}
        <div className="feed-column">
          <StoriesRow
            stories={stories}
            onStoryClick={(index) => setStoryViewIndex(index)}
            onCreateStory={() => setShowCreateStory(true)}
          />

          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onImageClick={setLightboxPost}
            />
          ))}
        </div>

        {/* ── Right Sidebar ── */}
        <RightSidebar />
      </div>

      {/* ── Overlays ── */}
      {lightboxPost && (
        <Lightbox post={lightboxPost} onClose={() => setLightboxPost(null)} />
      )}
      {storyViewIndex !== null && stories.length > 0 && (
        <StoryViewer
          stories={stories}
          startIndex={storyViewIndex}
          onClose={() => setStoryViewIndex(null)}
        />
      )}
      {showCreateStory && (
        <CreateStoryModal
          onClose={() => setShowCreateStory(false)}
          onPublish={handlePublishStory}
        />
      )}
    </div>
  );
}
