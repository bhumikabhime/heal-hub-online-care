
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import AuthHeader from '@/components/auth/AuthHeader';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isRegisterPage = location.pathname === '/register';
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <Layout>
      <div className="container mx-auto py-12 max-w-md">
        <AuthHeader isRegisterPage={isRegisterPage} />
        
        <Card>
          {isRegisterPage ? <SignUpForm /> : <SignInForm />}
        </Card>
      </div>
    </Layout>
  );
};

export default AuthPage;
