import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { postService } from '../services/api';

export default function PostView() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    const load = async () => {
      const res = await postService.getPost(id);
      setPost(res.data || res);
    };
    load();
  }, [id]);

  const submitComment = async () => {
    await postService.addComment(id, { content: comment });
    // reload
    const res = await postService.getPost(id);
    setPost(res.data || res);
    setComment('');
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div>
      <h1>{post.title}</h1>
      <img src={post.featuredImage} alt={post.title} style={{ maxWidth: '100%' }} />
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <div>
        <h3>Comments</h3>
        <ul>
          {post.comments.map(c => <li key={c._id}>{c.content} — {c.user?.name || 'User'}</li>)}
        </ul>
        <textarea value={comment} onChange={e=>setComment(e.target.value)} />
        <button onClick={submitComment}>Add comment</button>
      </div>
    </div>
  );
}
