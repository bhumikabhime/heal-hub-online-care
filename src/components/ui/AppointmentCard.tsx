
import React from 'react';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export interface AppointmentCardProps {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  onReschedule?: (id: string) => void;
  onCancel?: (id: string) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  id,
  doctorName,
  doctorSpecialty,
  doctorImage,
  date,
  time,
  location,
  status,
  onReschedule,
  onCancel
}) => {
  const getStatusBadge = () => {
    switch(status) {
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Upcoming</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Cancelled</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12 border">
            <img 
              src={doctorImage} 
              alt={doctorName}
              className="h-full w-full object-cover"
            />
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium">{doctorName}</h3>
              {getStatusBadge()}
            </div>
            <p className="text-sm text-gray-500 mb-3">{doctorSpecialty}</p>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                <span>{date}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <span>{time}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                <span>{location}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      {status === 'upcoming' && (
        <CardFooter className="px-6 py-4 bg-gray-50 flex justify-end space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onReschedule?.(id)}
          >
            Reschedule
          </Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onCancel?.(id)}
          >
            Cancel
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AppointmentCard;
