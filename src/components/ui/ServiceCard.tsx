
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  id: string; // Added id prop for identifying services
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon,
  link,
  id
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 card-hover">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <Button asChild variant="link" className="p-0 text-primary hover:text-primary/80">
        <Link to={`/services/${id}`} className="flex items-center">
          Learn more
          <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </Button>
    </div>
  );
};

export default ServiceCard;
