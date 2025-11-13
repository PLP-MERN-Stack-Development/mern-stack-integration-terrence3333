import { useState } from 'react';
import { postService } from '../services/api';

const CommentSection = ({ postId, comments }) => {
  const [newComment, setNewComment] = useState('');

  const handleAddComment = async (e) => {
    e.preventDefault();
    await postService.addComment(postId, { content: newComment });
    setNewComment('');
    window.location.reload();
  };

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-3">Comments</h3>
      {comments.map((c, i) => (
        <div key={i} className="border-b py-2">
          <p>{c.content}</p>
          <small className="text-gray-500">{new Date(c.createdAt).toLocaleString()}</small>
        </div>
      ))}
      <form onSubmit={handleAddComment} className="mt-4 flex gap-2">
        <input
          type="text"
          className="flex-1 border px-3 py-2 rounded"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Post</button>
      </form>
    </div>
  );
};

export default CommentSection;
