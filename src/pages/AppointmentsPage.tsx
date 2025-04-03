
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import AppointmentCard from '@/components/ui/AppointmentCard';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Clock, CalendarCheck, CalendarX } from 'lucide-react';

const AppointmentsPage = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Mock appointment data
  const appointments = [
    {
      id: "1",
      doctorName: "Dr. Sarah Johnson",
      doctorSpecialty: "Cardiology",
      doctorImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      date: "June 15, 2025",
      time: "10:00 AM - 10:30 AM",
      location: "Main Hospital, Room 203",
      status: 'upcoming' as const
    },
    {
      id: "2",
      doctorName: "Dr. Michael Chen",
      doctorSpecialty: "Neurology",
      doctorImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      date: "June 22, 2025",
      time: "02:15 PM - 02:45 PM",
      location: "North Wing, Room 105",
      status: 'upcoming' as const
    },
    {
      id: "3",
      doctorName: "Dr. Jessica Patel",
      doctorSpecialty: "Pediatrics",
      doctorImage: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      date: "May 30, 2025",
      time: "09:30 AM - 10:00 AM",
      location: "Children's Wing, Room 302",
      status: 'completed' as const
    },
    {
      id: "4",
      doctorName: "Dr. Robert Thompson",
      doctorSpecialty: "Orthopedics",
      doctorImage: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      date: "May 18, 2025",
      time: "11:45 AM - 12:15 PM",
      location: "East Wing, Room 405",
      status: 'cancelled' as const
    }
  ];

  const handleReschedule = (id: string) => {
    toast({
      title: "Reschedule Requested",
      description: `You've requested to reschedule appointment #${id}. Our staff will contact you shortly.`,
    });
  };

  const handleCancel = (id: string) => {
    toast({
      title: "Appointment Cancelled",
      description: `Appointment #${id} has been cancelled successfully.`,
      variant: "destructive",
    });
  };

  const upcomingAppointments = appointments.filter(app => app.status === 'upcoming');
  const completedAppointments = appointments.filter(app => app.status === 'completed');
  const cancelledAppointments = appointments.filter(app => app.status === 'cancelled');

  return (
    <Layout>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Appointments</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Manage your upcoming appointments, view past visits, and schedule new consultations with our healthcare professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar & New Appointment Section */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule New Appointment</CardTitle>
                  <CardDescription>Select a date to see available time slots</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col space-y-4">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                      disabled={{ before: new Date() }}
                    />
                    
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Find Available Slots
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Appointments List */}
            <div className="lg:col-span-2">
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
                
                <TabsContent value="upcoming" className="space-y-4">
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map(appointment => (
                      <AppointmentCard
                        key={appointment.id}
                        {...appointment}
                        onReschedule={handleReschedule}
                        onCancel={handleCancel}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No upcoming appointments.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="completed" className="space-y-4">
                  {completedAppointments.length > 0 ? (
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
                  )}
                </TabsContent>
                
                <TabsContent value="cancelled" className="space-y-4">
                  {cancelledAppointments.length > 0 ? (
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
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AppointmentsPage;
