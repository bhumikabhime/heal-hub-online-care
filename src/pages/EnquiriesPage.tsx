
import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import EnquiriesList from '@/components/contact/EnquiriesList';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const EnquiriesPage: React.FC = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // Redirect if not an admin
  if (user && !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Manage Enquiries</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            View and respond to customer enquiries. Update their status as you process them.
          </p>
        </div>

        {!user ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">You need to be logged in to view this page.</p>
            <Button onClick={() => navigate('/login')}>
              Login
            </Button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <EnquiriesList />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EnquiriesPage;
