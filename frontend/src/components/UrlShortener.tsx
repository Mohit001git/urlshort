import React, { useState } from 'react';
import { Link2, Copy, BarChart3, ExternalLink, Check } from 'lucide-react';

interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortUrl: string;
  clicks: number;
  createdAt: string;
}

const UrlShortener: React.FC = () => {
  const [url, setUrl] = useState('');
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim() || !isValidUrl(url)) {
      alert('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    
    try {
  // Step 1: Create the shortened URL
  const response = await fetch('http://localhost:8001/url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });

  const data: { shortId: string } = await response.json();
  console.log('Shortened URL response:', data);

  // Step 2: Fetch analytics for that shortId
  const analyticsResponse = await fetch(`http://localhost:8001/url/analytics/${data.shortId}`);
  const analyticsData: {
    totalClicks: number;
    analytics: { timestamp: number; _id: string }[];
  } = await analyticsResponse.json();

  console.log('Analytics data:', analyticsData);

  // Step 3: Construct new shortened URL object
  const newShortenedUrl: ShortenedUrl = {
    id: Date.now().toString(),
    originalUrl: url,
    shortUrl: data.shortId,
    clicks: analyticsData.totalClicks,
    createdAt: new Date().toISOString(),
    analytics: analyticsData.analytics // Add this field if you want to show timestamps
  };

  // Step 4: Update state
  setShortenedUrls(prev => [newShortenedUrl, ...prev]);
  // setUrl('');
} catch (error) {
      alert('Failed to shorten URL. Please try again.');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      alert('Failed to copy to clipboard');
    }
  };

  const refreshAnalytics = async (id: string) => {
    try {
      // Replace with your actual analytics API endpoint
      // const response = await fetch(`/api/analytics/${id}`);
      // const data = await response.json();
      
      // Mock analytics update
      setShortenedUrls(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, clicks: item.clicks + 1 }
            : item
        )
      );
    } catch (error) {
      alert('Failed to fetch analytics');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Link2 className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">URL Shortener</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform long URLs into short, shareable links and track their performance with detailed analytics.
          </p>
        </div>

        {/* URL Shortening Form */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-3">
                  Enter your long URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/very-long-url-that-needs-shortening"
                    className="w-full px-4 py-4 pr-32 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-200"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !url.trim()}
                    className="absolute right-2 top-2 bottom-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Shortening...
                      </div>
                    ) : (
                      'Shorten'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Shortened URLs List */}
        {shortenedUrls.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-3 text-blue-600" />
              Your Shortened URLs
            </h2>
            
            <div className="space-y-4">
              {shortenedUrls.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-500 mb-1">Original URL</p>
                        <p className="text-gray-900 truncate">{item.originalUrl}</p>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">Shortened URL</p>
                          <div className="flex items-center space-x-2">
                            <a 
                              href={`http://localhost:8001/${item.shortUrl}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                            >
                              {item.shortUrl}
                              <ExternalLink className="w-4 h-4 ml-1" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-gray-900">{item.clicks}</p>
                        <p className="text-sm text-gray-500">Clicks</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => copyToClipboard(item.shortUrl, item.id)}
                          className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-4 h-4 mr-2 text-green-600" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => refreshAnalytics(item.id)}
                          className="flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors duration-200"
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Refresh
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">
                      Created on {new Date(item.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {shortenedUrls.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-12">
            <Link2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No URLs shortened yet</h3>
            <p className="text-gray-500">Start by entering a long URL above to create your first short link!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlShortener;