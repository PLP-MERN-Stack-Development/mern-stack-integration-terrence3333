import React, { useEffect, useState } from 'react';
import { postService, categoryService } from '../services/api';
import { Link } from 'react-router-dom';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [page, category]);

  const fetchCategories = async () => {
    const res = await categoryService.getAllCategories();
    setCategories(res.data || res);
  };

  const fetchPosts = async () => {
    const res = await postService.getAllPosts(page, 10, category);
    setPosts(res.data || res);
    setMeta(res.meta || null);
  };

  const onSearch = async (e) => {
    e.preventDefault();
    const res = await postService.searchPosts(q);
    setPosts(res.data || res);
  };

  return (
    <div>
      <h1>Posts</h1>
      <form onSubmit={onSearch}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search..." />
        <button>Search</button>
      </form>

      <select value={category} onChange={e=> { setCategory(e.target.value); setPage(1); }}>
        <option value="">All categories</option>
        {categories.map(c=> <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>

      <ul>
        {posts.map(p => (
          <li key={p._id}>
            <Link to={`/posts/${p._id}`}>{p.title}</Link>
            <p>{p.excerpt}</p>
          </li>
        ))}
      </ul>

      {meta && (
        <div>
          <button disabled={page<=1} onClick={()=>setPage(page-1)}>Prev</button>
          <span>Page {meta.page} / {Math.ceil(meta.total/meta.limit)}</span>
          <button disabled={page>=Math.ceil(meta.total/meta.limit)} onClick={()=>setPage(page+1)}>Next</button>
        </div>
      )}
    </div>
  );
}
