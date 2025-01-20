import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShortUrl('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/shorten`, { url });
      setShortUrl(response.data.shortUrl);
    } catch (err) {
      setError('Failed to shorten URL. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          URL Shortener
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                Enter URL to shorten
              </label>
              <div className="mt-1">
                <input
                  id="url"
                  name="url"
                  type="url"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Shorten URL
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 text-red-600 text-sm">
              {error}
            </div>
          )}

          {shortUrl && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">Your shortened URL:</h3>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-500"
              >
                {shortUrl}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

