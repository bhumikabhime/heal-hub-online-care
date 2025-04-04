
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import ContactForm from '@/components/contact/ContactForm';
import HospitalContacts from '@/components/contact/HospitalContacts';
import { supabase } from '@/integrations/supabase/client';

const ContactPage: React.FC = () => {
  // Fetch hospital contacts
  const { data: contacts, isLoading } = useQuery({
    queryKey: ['hospital-contacts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hospital_contacts')
        .select('*');
      
      if (error) {
        console.error('Error fetching hospital contacts:', error);
        return [];
      }
      
      return data || [];
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get in touch with our healthcare professionals for any queries. We're here to help you with all your healthcare needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <HospitalContacts contacts={contacts || []} isLoading={isLoading} />
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
