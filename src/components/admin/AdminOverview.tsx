
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, MessageSquare, UserCheck } from 'lucide-react';

const AdminOverview: React.FC = () => {
  const { data: doctorsCount = 0, isLoading: isDoctorsLoading } = useQuery({
    queryKey: ['doctorsCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('doctors')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: appointmentsCount = 0, isLoading: isAppointmentsLoading } = useQuery({
    queryKey: ['appointmentsCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: enquiriesCount = 0, isLoading: isEnquiriesLoading } = useQuery({
    queryKey: ['enquiriesCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('enquiries')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: recentEnquiries = [], isLoading: isRecentEnquiriesLoading } = useQuery({
    queryKey: ['recentEnquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
  });

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isDoctorsLoading ? "..." : doctorsCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Specialists available
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isAppointmentsLoading ? "..." : appointmentsCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Total scheduled
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Enquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isEnquiriesLoading ? "..." : enquiriesCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Customer requests
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Patients</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* Placeholder data */}
              145
            </div>
            <p className="text-xs text-muted-foreground">
              Active registrations
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Recent Enquiries</h3>
        <div className="rounded-md border">
          <div className="grid grid-cols-4 p-4 font-medium border-b text-sm">
            <div>Name</div>
            <div>Email</div>
            <div>Date</div>
            <div>Status</div>
          </div>
          {isRecentEnquiriesLoading ? (
            <div className="p-4 text-center">Loading recent enquiries...</div>
          ) : recentEnquiries.length > 0 ? (
            recentEnquiries.map((enquiry: any) => (
              <div 
                key={enquiry.id} 
                className="grid grid-cols-4 p-4 border-b last:border-0 text-sm hover:bg-muted/50"
              >
                <div className="font-medium">{enquiry.name}</div>
                <div className="text-muted-foreground">{enquiry.email}</div>
                <div className="text-muted-foreground">{formatDate(enquiry.created_at)}</div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    enquiry.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                    enquiry.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {enquiry.status === 'in-progress' ? 'In Progress' : 
                     (enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1))}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">No recent enquiries found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
