import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postService, categoryService } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState({ title:'', content:'', excerpt:'', category: '', tags: [] });
  const [featuredImage, setFeaturedImage] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(()=>{
    fetchCategories();
    if (id) loadPost();
  }, [id]);

  const fetchCategories = async () => {
    const res = await categoryService.getAllCategories();
    setCategories(res.data || res);
  };

  const loadPost = async () => {
    const res = await postService.getPost(id);
    setPost(res.data || res);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', post.title);
    formData.append('content', post.content);
    formData.append('excerpt', post.excerpt);
    formData.append('category', post.category);
    formData.append('tags', (post.tags || []).join(','));

    if (featuredImage) formData.append('featuredImage', featuredImage);

    if (id) {
      await postService.updatePost(id, formData);
    } else {
      await postService.createPost(formData);
    }
    navigate('/');
  };

  // lightweight tag handler
  const addTag = (t) => setPost(p => ({ ...p, tags: [...(p.tags||[]), t] }));

  return (
    <form onSubmit={onSubmit}>
      {!user && <div>You must be logged in to create or edit posts</div>}
      <input value={post.title} onChange={e=>setPost({...post, title: e.target.value})} placeholder="Title" />
      <select value={post.category} onChange={e=>setPost({...post, category: e.target.value})}>
        <option value="">Select category</option>
        {categories.map(c=> <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>
      <textarea value={post.excerpt} onChange={e=>setPost({...post, excerpt: e.target.value})} placeholder="Excerpt" />
      <textarea value={post.content} onChange={e=>setPost({...post, content: e.target.value})} placeholder="Content (HTML allowed)" />
      <input type="file" onChange={e=>setFeaturedImage(e.target.files[0])} />
      <button type="submit">Save</button>
    </form>
  );
}
