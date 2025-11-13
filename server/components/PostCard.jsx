import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-lg transition">
      <img
        src={post.featuredImage || '/default-post.jpg'}
        alt={post.title}
        className="w-full h-48 object-cover rounded-md mb-3"
      />
      <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-600 text-sm mb-3">{post.excerpt}</p>
      <Link to={`/posts/${post.slug}`} className="text-blue-500">Read More →</Link>
    </div>
  );
};

export default PostCard;
