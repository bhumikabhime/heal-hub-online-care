
import React from 'react';
import { Link } from 'react-router-dom';
import { Hospital } from 'lucide-react';
import { CardTitle, CardDescription, CardHeader } from '@/components/ui/card';

interface AuthHeaderProps {
  isRegisterPage: boolean;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ isRegisterPage }) => {
  return (
    <>
      <div className="flex flex-col items-center justify-center mb-6">
        <Hospital className="h-12 w-12 text-primary mb-2" />
        <h1 className="text-2xl font-bold text-center">Welcome to HealHub</h1>
        <p className="text-gray-500 text-center">Sign in to access your account</p>
      </div>

      <CardHeader>
        <div className="grid w-full grid-cols-2 mb-4">
          <Link 
            to="/login" 
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${!isRegisterPage ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
          >
            Sign In
          </Link>
          <Link 
            to="/register" 
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${isRegisterPage ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
          >
            Sign Up
          </Link>
        </div>
        
        {isRegisterPage ? (
          <div className="mt-4">
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>Fill in your details to create a new account</CardDescription>
          </div>
        ) : (
          <div className="mt-4">
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </div>
        )}
      </CardHeader>
    </>
  );
};

export default AuthHeader;
