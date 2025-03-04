import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600">404</h1>
        <p className="mt-4 text-lg text-gray-700">Oops! The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
