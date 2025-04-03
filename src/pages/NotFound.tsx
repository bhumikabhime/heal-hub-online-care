
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { Frown } from 'lucide-react';

const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Frown className="h-16 w-16 text-gray-400 mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-medium text-gray-700 mb-6">Page Not Found</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
