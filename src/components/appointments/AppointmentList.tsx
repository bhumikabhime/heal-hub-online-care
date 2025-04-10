
import React, { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CalendarCheck, CalendarX, Loader2 } from 'lucide-react';
import AppointmentCard from '@/components/ui/AppointmentCard';

interface Appointment {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

interface AppointmentListProps {
  appointments: Appointment[];
  isLoading: boolean;
  onReschedule: (id: string) => void;
  onCancel: (id: string) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = React.memo(({ 
  appointments, 
  isLoading, 
  onReschedule, 
  onCancel 
}) => {
  // Memoize filtered appointments to prevent recalculation on re-renders
  const {
    upcomingAppointments,
    completedAppointments,
    cancelledAppointments
  } = useMemo(() => {
    return {
      upcomingAppointments: appointments.filter(app => app.status === 'upcoming'),
      completedAppointments: appointments.filter(app => app.status === 'completed'),
      cancelledAppointments: appointments.filter(app => app.status === 'cancelled')
    };
  }, [appointments]);

  // Memoize appointment list rendering
  const renderAppointments = useMemo(() => ({
    upcoming: upcomingAppointments.length > 0 ? (
      upcomingAppointments.map(appointment => (
        <AppointmentCard
          key={appointment.id}
          {...appointment}
          onReschedule={onReschedule}
          onCancel={() => onCancel(appointment.id)}
        />
      ))
    ) : (
      <div className="text-center py-8">
        <p className="text-gray-500">No upcoming appointments.</p>
      </div>
    ),
    completed: completedAppointments.length > 0 ? (
      completedAppointments.map(appointment => (
        <AppointmentCard
          key={appointment.id}
          {...appointment}
        />
      ))
    ) : (
      <div className="text-center py-8">
        <p className="text-gray-500">No completed appointments.</p>
      </div>
    ),
    cancelled: cancelledAppointments.length > 0 ? (
      cancelledAppointments.map(appointment => (
        <AppointmentCard
          key={appointment.id}
          {...appointment}
        />
      ))
    ) : (
      <div className="text-center py-8">
        <p className="text-gray-500">No cancelled appointments.</p>
      </div>
    )
  }), [upcomingAppointments, completedAppointments, cancelledAppointments, onReschedule, onCancel]);

  return (
    <Tabs defaultValue="upcoming">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="upcoming" className="flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Upcoming ({upcomingAppointments.length})
        </TabsTrigger>
        <TabsTrigger value="completed" className="flex items-center">
          <CalendarCheck className="h-4 w-4 mr-2" />
          Completed ({completedAppointments.length})
        </TabsTrigger>
        <TabsTrigger value="cancelled" className="flex items-center">
          <CalendarX className="h-4 w-4 mr-2" />
          Cancelled ({cancelledAppointments.length})
        </TabsTrigger>
      </TabsList>
      
      {isLoading && (
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-gray-500">Loading appointments...</p>
        </div>
      )}
      
      {!isLoading && (
        <>
          <TabsContent value="upcoming" className="space-y-4">
            {renderAppointments.upcoming}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {renderAppointments.completed}
          </TabsContent>
          
          <TabsContent value="cancelled" className="space-y-4">
            {renderAppointments.cancelled}
          </TabsContent>
        </>
      )}
    </Tabs>
  );
});

AppointmentList.displayName = 'AppointmentList';

export default AppointmentList;
