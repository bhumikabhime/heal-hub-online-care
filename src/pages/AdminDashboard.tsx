
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminOverview from '@/components/admin/AdminOverview';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Appointment {
  id: string;
  patient_name: string;
  patient_email: string;
  doctor_name: string;
  appointment_date: string;
  appointment_time: string;
  location: string;
  reason: string | null;
  status: string;
}

const AdminDashboard: React.FC = () => {
  const { user, loading, isAdmin } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user || !isAdmin()) return;
      
      try {
        setIsLoadingAppointments(true);
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            doctors (name)
          `)
          .order('appointment_date', { ascending: false });

        if (error) {
          throw error;
        }

        // Transform the data to include doctor name
        const formattedAppointments = data.map((appointment: any) => ({
          ...appointment,
          doctor_name: appointment.doctors?.name || 'Unknown Doctor',
        }));

        setAppointments(formattedAppointments);
      } catch (error: any) {
        toast({
          title: "Error fetching appointments",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoadingAppointments(false);
      }
    };

    if (user && isAdmin()) {
      fetchAppointments();
    }
  }, [user, isAdmin, toast]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-700">Upcoming</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if not an admin
  if (user && !isAdmin()) {
    toast({
      title: "Access Denied",
      description: "You do not have permission to access the admin dashboard",
      variant: "destructive",
    });
    return <Navigate to="/" replace />;
  }

  return (
    <AdminLayout>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Dashboard Overview</TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Appointments
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <AdminOverview />
        </TabsContent>
        
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Users className="mr-2 h-6 w-6 text-primary" />
                <CardTitle>Patient Appointments</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingAppointments ? (
                <div className="flex justify-center py-10">
                  <p>Loading appointments...</p>
                </div>
              ) : (
                <Table>
                  <TableCaption>A list of all patient appointments</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.length > 0 ? (
                      appointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell className="font-medium">
                            {appointment.patient_name}
                            <div className="text-xs text-muted-foreground">{appointment.patient_email}</div>
                          </TableCell>
                          <TableCell>{appointment.doctor_name}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <Calendar className="mr-1 h-3 w-3 text-muted-foreground" />
                                <span>{formatDate(appointment.appointment_date)}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="mr-1 h-3 w-3" />
                                <span>{appointment.appointment_time}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{appointment.reason || 'General checkup'}</TableCell>
                          <TableCell>{appointment.location}</TableCell>
                          <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          No appointments found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminDashboard;
