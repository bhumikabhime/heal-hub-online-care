
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Star } from 'lucide-react';
import { Avatar } from "@/components/ui/avatar";
import { Link } from 'react-router-dom';

interface DoctorCardProps {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  experience: string;
  imageUrl: string;
}

const DoctorCard: React.FC<DoctorCardProps> = ({
  id,
  name,
  specialty,
  rating,
  reviewCount,
  experience,
  imageUrl
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex flex-col items-center mb-4">
          <Avatar className="h-24 w-24 mb-4">
            <img 
              src={imageUrl} 
              alt={`Dr. ${name}`}
              className="h-full w-full object-cover"
            />
          </Avatar>
          <h3 className="font-bold text-lg text-gray-900">{name}</h3>
          <p className="text-primary text-sm">{specialty}</p>
        </div>
        
        <div className="flex justify-center items-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="ml-2 text-xs text-gray-500">({reviewCount} reviews)</span>
        </div>
        
        <div className="text-center mb-4">
          <p className="text-sm text-gray-500">{experience} years experience</p>
        </div>
        
        <div className="flex space-x-2">
          <Button asChild variant="outline" className="flex-1">
            <Link to={`/doctor/${id}`}>View Profile</Link>
          </Button>
          <Button asChild className="flex-1 bg-primary hover:bg-primary/90">
            <Link to={`/appointments/book/${id}`}>
              <Calendar className="h-4 w-4 mr-2" />
              Book
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
