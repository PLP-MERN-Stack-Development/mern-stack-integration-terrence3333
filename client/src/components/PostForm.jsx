import { useState } from 'react';

const PostForm = ({ onSubmit, initialData = {} }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [content, setContent] = useState(initialData.content || '');
  const [featuredImage, setFeaturedImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    if (featuredImage) postData.append('featuredImage', featuredImage);
    onSubmit(postData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <div>
        <label className="block font-medium">Title</label>
        <input
          type="text"
          className="w-full border rounded px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          required
        />
      </div>
      <div>
        <label className="block font-medium">Content</label>
        <textarea
          className="w-full border rounded px-3 py-2 h-40"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post..."
          required
        ></textarea>
      </div>
      <div>
        <label className="block font-medium">Featured Image</label>
        <input type="file" onChange={(e) => setFeaturedImage(e.target.files[0])} />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
};

export default PostForm;
