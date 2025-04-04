
import React, { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import AppointmentScheduler from '@/components/appointments/AppointmentScheduler';
import AppointmentList from '@/components/appointments/AppointmentList';

const AppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch doctors with stale time and caching
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
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch user's appointments with optimized caching
  const { data: appointments, isLoading: isLoadingAppointments } = useQuery({
    queryKey: ['appointments', user?.email],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          doctors (
            id,
            name,
            specialty,
            image_url
          )
        `)
        .eq('patient_email', user.email);

      if (error) {
        toast({
          title: "Error fetching appointments",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data?.map(appointment => ({
        id: appointment.id,
        doctorName: appointment.doctors?.name || 'Unknown Doctor',
        doctorSpecialty: appointment.doctors?.specialty || 'General',
        doctorImage: appointment.doctors?.image_url || '',
        date: format(new Date(appointment.appointment_date), 'MMMM d, yyyy'),
        time: appointment.appointment_time,
        location: appointment.location,
        status: appointment.status as 'upcoming' | 'completed' | 'cancelled'
      })) || [];
    },
    enabled: !!user,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
  });

  // Handle appointment cancellation
  const cancelAppointment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Appointment Cancelled",
        description: "Your appointment has been cancelled successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to cancel appointment: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Use callbacks for event handlers to prevent unnecessary re-renders
  const handleReschedule = useCallback((id: string) => {
    toast({
      title: "Reschedule Requested",
      description: `You've requested to reschedule appointment #${id}. Our staff will contact you shortly.`,
    });
  }, [toast]);

  const handleCancel = useCallback((id: string) => {
    cancelAppointment.mutate(id);
  }, [cancelAppointment]);
  
  return (
    <Layout>
      {!user && (
        <div className="text-center py-8">
          <p className="text-gray-500">Please log in to view your appointments.</p>
        </div>
      )}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Appointments</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Manage your upcoming appointments, view past visits, and schedule new consultations with our healthcare professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <AppointmentScheduler 
                doctors={doctors || []} 
                isLoading={isLoadingDoctors} 
              />
            </div>
            
            <div className="lg:col-span-2">
              <AppointmentList 
                appointments={appointments || []} 
                isLoading={isLoadingAppointments}
                onReschedule={handleReschedule}
                onCancel={handleCancel}
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AppointmentsPage;
