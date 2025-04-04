
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'in-progress' | 'completed';
  created_at: string;
}

const EnquiriesList: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: enquiries, isLoading } = useQuery({
    queryKey: ['enquiries', statusFilter],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase.from('enquiries').select('*');

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // Order by created_at in descending order
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      
      if (error) {
        toast({
          title: "Error fetching enquiries",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      return data as Enquiry[];
    },
    enabled: !!user,
    refetchOnWindowFocus: true,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('enquiries')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      toast({
        title: "Status Updated",
        description: "The enquiry status has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update the status.",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="default" className="bg-blue-500">New</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="border-orange-500 text-orange-500">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="border-green-500 text-green-500">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Please login to view enquiries.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customer Enquiries</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Filter:</span>
          <Select defaultValue="all" onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Enquiries</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading enquiries...</p>
        </div>
      ) : enquiries && enquiries.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enquiries.map((enquiry) => (
                <TableRow key={enquiry.id}>
                  <TableCell className="font-medium">
                    {format(new Date(enquiry.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>{enquiry.name}</TableCell>
                  <TableCell>
                    <div>
                      <a href={`mailto:${enquiry.email}`} className="text-primary hover:underline block">
                        {enquiry.email}
                      </a>
                      {enquiry.phone && (
                        <a href={`tel:${enquiry.phone}`} className="text-sm text-gray-500 hover:underline">
                          {enquiry.phone}
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    <div className="max-h-20 overflow-y-auto">
                      {enquiry.message}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {getStatusBadge(enquiry.status)}
                      <Select 
                        defaultValue={enquiry.status} 
                        onValueChange={(value) => handleStatusChange(enquiry.id, value)}
                      >
                        <SelectTrigger className="w-[130px] h-8 text-xs">
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 border rounded-md">
          <p className="text-gray-500">No enquiries found.</p>
        </div>
      )}
    </div>
  );
};

export default EnquiriesList;
