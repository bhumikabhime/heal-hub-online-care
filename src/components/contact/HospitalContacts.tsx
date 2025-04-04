
import React from 'react';
import { Phone, Mail, MapPin, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  department?: string;
}

interface HospitalContactsProps {
  contacts: Contact[];
  isLoading: boolean;
}

const HospitalContacts: React.FC<HospitalContactsProps> = ({ contacts, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Hospital Contacts</h2>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="mb-4">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Hospital Contacts</h2>
      {contacts.length === 0 ? (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <p className="text-gray-500 text-center">
              No contact information available at the moment. Please check back later.
            </p>
          </CardContent>
        </Card>
      ) : (
        contacts.map((contact) => (
          <Card key={contact.id} className="mb-6 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                {contact.department && (
                  <Building className="h-5 w-5 mr-2 text-primary" />
                )}
                {contact.name}
                {contact.department && (
                  <span className="ml-2 text-sm text-gray-500">({contact.department})</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-3 text-primary" />
                  <a href={`tel:${contact.phone}`} className="hover:text-primary">
                    {contact.phone}
                  </a>
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-3 text-primary" />
                  <a href={`mailto:${contact.email}`} className="hover:text-primary">
                    {contact.email}
                  </a>
                </li>
                {contact.address && (
                  <li className="flex items-start">
                    <MapPin className="h-4 w-4 mr-3 mt-1 text-primary" />
                    <span>{contact.address}</span>
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default HospitalContacts;
