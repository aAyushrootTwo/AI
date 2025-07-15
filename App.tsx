
import React, { useState, useCallback } from 'react';
import { Header }
import { Footer } from './components/Footer';
import { BlogForm } from './components/BlogForm';
import { BlogPostDisplay } from './components/BlogPostDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import type { BlogFormInput } from './types';
import { generateBlogPost } from './services/geminiService';

function App() {
  const [blogPost, setBlogPost] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = useCallback(async (formData: BlogFormInput) => {
    setIsLoading(true);
    setError(null);
    setBlogPost('');

    try {
      const post = await generateBlogPost(formData);
      setBlogPost(post);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to generate post: ${err.message}. Please check your connection or API key setup.`);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-200 font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">Content Controls</h2>
              <BlogForm onSubmit={handleFormSubmit} isLoading={isLoading} />
            </div>
          </div>
          <div className="lg:col-span-8">
             <h2 className="text-2xl font-bold text-cyan-400 mb-4">Generated Post</h2>
            <div className="bg-slate-800 rounded-xl shadow-lg p-6 min-h-[500px] border border-slate-700 relative">
              {isLoading && (
                <div className="absolute inset-0 bg-slate-800 bg-opacity-75 flex flex-col items-center justify-center rounded-xl z-10">
                  <LoadingSpinner />
                  <p className="mt-4 text-lg text-slate-300">AI is crafting your post...</p>
                </div>
              )}
              {error && (
                <div className="text-red-400 bg-red-900/50 p-4 rounded-lg">
                  <p className="font-bold">Error</p>
                  <p>{error}</p>
                </div>
              )}
              <BlogPostDisplay post={blogPost} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
