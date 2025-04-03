
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import AppointmentCard from '@/components/ui/AppointmentCard';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarIcon, Clock, CalendarCheck, CalendarX, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';

// Form schema for booking appointments
const appointmentSchema = z.object({
  doctor_id: z.string({ required_error: "Please select a doctor" }),
  patient_name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  patient_email: z.string().email({ message: "Please enter a valid email" }),
  appointment_date: z.date({ required_error: "Please select a date" }),
  appointment_time: z.string({ required_error: "Please select a time" }),
  reason: z.string().optional(),
  location: z.string().min(2, { message: "Please enter a location" })
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

const AppointmentsPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<string[]>([
    "09:00 AM - 09:30 AM", 
    "09:30 AM - 10:00 AM", 
    "10:00 AM - 10:30 AM", 
    "10:30 AM - 11:00 AM", 
    "11:00 AM - 11:30 AM", 
    "11:30 AM - 12:00 PM", 
    "02:00 PM - 02:30 PM", 
    "02:30 PM - 03:00 PM", 
    "03:00 PM - 03:30 PM", 
    "03:30 PM - 04:00 PM", 
    "04:00 PM - 04:30 PM"
  ]);
  
  // Fetch doctors for appointment booking
  const { data: doctors, isLoading: isLoadingDoctors } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const { data, error } = await supabase.from('doctors').select('*');
      if (error) {
        toast({
          title: "Error fetching doctors",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data || [];
    }
  });

  // Fetch appointments from Supabase
  const { data: appointments, isLoading: isLoadingAppointments, error: appointmentsError } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('appointments').select(`
        *,
        doctors (
          id,
          name,
          specialty,
          image_url
        )
      `);
      if (error) {
        toast({
          title: "Error fetching appointments",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      // Transform data to match the expected format for AppointmentCard
      return data?.map(appointment => ({
        id: appointment.id,
        doctorName: appointment.doctors?.name || 'Unknown Doctor',
        doctorSpecialty: appointment.doctors?.specialty || 'General',
        doctorImage: appointment.doctors?.image_url || '',
        date: format(new Date(appointment.appointment_date), 'MMMM d, yyyy'),
        time: appointment.appointment_time,
        location: appointment.location,
        status: appointment.status
      })) || [];
    }
  });

  // Mutation for booking an appointment
  const bookAppointment = useMutation({
    mutationFn: async (values: AppointmentFormValues) => {
      const { error } = await supabase.from('appointments').insert([values]);
      
      if (error) {
        throw new Error(error.message);
      }
      return values;
    },
    onSuccess: () => {
      toast({
        title: "Appointment Booked",
        description: "Your appointment has been successfully scheduled.",
      });
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patient_name: '',
      patient_email: '',
      reason: '',
      location: 'Main Hospital',
      appointment_time: ''
    }
  });

  // Handle appointment form submission
  const onSubmit = (values: AppointmentFormValues) => {
    bookAppointment.mutate(values);
  };

  // Handle reschedule appointment
  const handleReschedule = (id: string) => {
    toast({
      title: "Reschedule Requested",
      description: `You've requested to reschedule appointment #${id}. Our staff will contact you shortly.`,
    });
  };

  // Handle cancel appointment
  const handleCancel = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Appointment Cancelled",
        description: `Appointment has been cancelled successfully.`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: `Failed to cancel appointment: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Filter appointments by status
  const upcomingAppointments = appointments?.filter(app => app.status === 'upcoming') || [];
  const completedAppointments = appointments?.filter(app => app.status === 'completed') || [];
  const cancelledAppointments = appointments?.filter(app => app.status === 'cancelled') || [];
  
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
                    
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-primary hover:bg-primary/90">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          Book Appointment
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[525px]">
                        <DialogHeader>
                          <DialogTitle>Book an Appointment</DialogTitle>
                          <DialogDescription>
                            Fill in your information to schedule a consultation with one of our specialists.
                          </DialogDescription>
                        </DialogHeader>
                        
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                              control={form.control}
                              name="doctor_id"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Doctor</FormLabel>
                                  <select 
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(e);
                                      setSelectedDoctorId(e.target.value);
                                    }}
                                  >
                                    <option value="">Select a doctor</option>
                                    {doctors?.map(doctor => (
                                      <option key={doctor.id} value={doctor.id}>
                                        {doctor.name} - {doctor.specialty}
                                      </option>
                                    ))}
                                  </select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="patient_name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Your Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Full name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="patient_email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input type="email" placeholder="Your email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={form.control}
                              name="appointment_date"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Date</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="date" 
                                      value={date ? format(date, 'yyyy-MM-dd') : ''}
                                      onChange={(e) => {
                                        const newDate = e.target.value ? new Date(e.target.value) : undefined;
                                        setDate(newDate);
                                        field.onChange(newDate);
                                      }}
                                      min={format(new Date(), 'yyyy-MM-dd')}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="appointment_time"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Time Slot</FormLabel>
                                  <select 
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    {...field}
                                  >
                                    <option value="">Select a time</option>
                                    {availableTimes.map(time => (
                                      <option key={time} value={time}>{time}</option>
                                    ))}
                                  </select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="reason"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Reason for Visit</FormLabel>
                                  <FormControl>
                                    <Textarea placeholder="Briefly describe your symptoms or reason for appointment" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="location"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Location</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Hospital location" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <DialogFooter>
                              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button type="submit" disabled={bookAppointment.isPending}>
                                {bookAppointment.isPending ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Booking...
                                  </>
                                ) : "Book Appointment"}
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
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
                
                {/* Loading state */}
                {isLoadingAppointments && (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="mt-4 text-gray-500">Loading appointments...</p>
                  </div>
                )}
                
                <TabsContent value="upcoming" className="space-y-4">
                  {!isLoadingAppointments && upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map(appointment => (
                      <AppointmentCard
                        key={appointment.id}
                        {...appointment}
                        onReschedule={handleReschedule}
                        onCancel={() => handleCancel(appointment.id)}
                      />
                    ))
                  ) : !isLoadingAppointments && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No upcoming appointments.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="completed" className="space-y-4">
                  {!isLoadingAppointments && completedAppointments.length > 0 ? (
                    completedAppointments.map(appointment => (
                      <AppointmentCard
                        key={appointment.id}
                        {...appointment}
                      />
                    ))
                  ) : !isLoadingAppointments && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No completed appointments.</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="cancelled" className="space-y-4">
                  {!isLoadingAppointments && cancelledAppointments.length > 0 ? (
                    cancelledAppointments.map(appointment => (
                      <AppointmentCard
                        key={appointment.id}
                        {...appointment}
                      />
                    ))
                  ) : !isLoadingAppointments && (
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
