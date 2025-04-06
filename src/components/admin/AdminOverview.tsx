
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  UserCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  ChartLegend, 
  ChartLegendContent
} from '@/components/ui/chart';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useIsMobile } from '@/hooks/use-mobile';

const AdminOverview: React.FC = () => {
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState('overview');
  const [showAll, setShowAll] = useState(false);

  // Queries for the dashboard metrics
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

  // Query for recent enquiries
  const { data: recentEnquiries = [], isLoading: isRecentEnquiriesLoading } = useQuery({
    queryKey: ['recentEnquiries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(showAll ? 100 : 5);
      
      if (error) throw error;
      return data || [];
    },
  });

  // Query for appointments by date (for the line chart)
  const { data: appointmentsByDate = [], isLoading: isAppointmentsByDateLoading } = useQuery({
    queryKey: ['appointmentsByDate'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('appointment_date, status')
        .order('appointment_date', { ascending: true });
      
      if (error) throw error;

      // Group appointments by date
      const dateMap = new Map();
      data?.forEach(appointment => {
        const date = appointment.appointment_date;
        if (!dateMap.has(date)) {
          dateMap.set(date, { date, count: 0 });
        }
        dateMap.get(date).count += 1;
      });

      // Convert to array and sort by date
      return Array.from(dateMap.values())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-10); // Last 10 days with appointments
    },
  });

  // Query for doctors by specialty (for the pie chart)
  const { data: doctorsBySpecialty = [], isLoading: isDoctorsBySpecialtyLoading } = useQuery({
    queryKey: ['doctorsBySpecialty'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('specialty');
      
      if (error) throw error;

      // Count doctors by specialty
      const specialtyCounts = data?.reduce((acc: Record<string, number>, doctor) => {
        acc[doctor.specialty] = (acc[doctor.specialty] || 0) + 1;
        return acc;
      }, {});

      // Convert to array for the chart
      return Object.entries(specialtyCounts || {}).map(([name, value]) => ({
        name,
        value,
      }));
    },
  });

  // Query for enquiry status breakdown (for the bar chart)
  const { data: enquiriesByStatus = [], isLoading: isEnquiriesByStatusLoading } = useQuery({
    queryKey: ['enquiriesByStatus'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enquiries')
        .select('status');
      
      if (error) throw error;

      // Count enquiries by status
      const statusCounts = data?.reduce((acc: Record<string, number>, enquiry) => {
        acc[enquiry.status] = (acc[enquiry.status] || 0) + 1;
        return acc;
      }, {});

      // Convert to array for the chart
      return Object.entries(statusCounts || {}).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }));
    },
  });

  // Appointments by status (for pie chart)
  const { data: appointmentsByStatus = [], isLoading: isAppointmentsByStatusLoading } = useQuery({
    queryKey: ['appointmentsByStatus'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('status');
      
      if (error) throw error;

      // Count appointments by status
      const statusCounts = data?.reduce((acc: Record<string, number>, appointment) => {
        acc[appointment.status] = (acc[appointment.status] || 0) + 1;
        return acc;
      }, {});

      // Convert to array for the chart
      return Object.entries(statusCounts || {}).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }));
    },
  });

  // Get all doctors for the table view
  const { data: doctors = [], isLoading: isDoctorsTableLoading } = useQuery({
    queryKey: ['doctorsTable'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });

  // Get all appointments for the table view
  const { data: appointments = [], isLoading: isAppointmentsTableLoading } = useQuery({
    queryKey: ['appointmentsTable'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, doctors(name)')
        .order('appointment_date', { ascending: false })
        .limit(20);
      
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

  // Function to get color based on status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'upcoming':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Pie chart colors
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" value={activeView} onValueChange={setActiveView}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="doctors">Doctors</TabsTrigger>
          <TabsTrigger value="enquiries">Enquiries</TabsTrigger>
        </TabsList>
        
        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Appointments Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Appointments Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {isAppointmentsByDateLoading ? (
                  <div className="flex items-center justify-center h-[300px]">Loading chart data...</div>
                ) : (
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        count: {
                          label: "Appointments",
                          theme: {
                            light: "#8884d8",
                            dark: "#8884d8"
                          }
                        }
                      }}
                    >
                      <LineChart data={appointmentsByDate}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => format(new Date(date), 'MM/dd')}
                        />
                        <YAxis />
                        <ChartTooltip 
                          content={
                            <ChartTooltipContent 
                              labelFormatter={(date) => format(new Date(date as string), 'MMM dd, yyyy')}
                            />
                          } 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="count" 
                          stroke="#8884d8" 
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ChartContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Doctor Specialties Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Doctor Specialties</CardTitle>
              </CardHeader>
              <CardContent>
                {isDoctorsBySpecialtyLoading ? (
                  <div className="flex items-center justify-center h-[300px]">Loading chart data...</div>
                ) : (
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        specialty: {
                          label: "Specialty",
                          theme: {
                            light: "#82ca9d",
                            dark: "#82ca9d"
                          }
                        }
                      }}
                    >
                      <PieChart>
                        <Pie
                          data={doctorsBySpecialty}
                          cx="50%"
                          cy="50%"
                          labelLine={!isMobile}
                          label={!isMobile ? ({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%` : undefined}
                          outerRadius={isMobile ? 80 : 120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {doctorsBySpecialty.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                      </PieChart>
                    </ChartContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Enquiries Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Recent Enquiries</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAll(!showAll)}
                className="flex items-center gap-1"
              >
                {showAll ? (
                  <>Show Less <ChevronUp className="h-4 w-4" /></>
                ) : (
                  <>Show More <ChevronDown className="h-4 w-4" /></>
                )}
              </Button>
            </div>
            
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
                        getStatusColor(enquiry.status)
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
        </TabsContent>

        {/* APPOINTMENTS TAB */}
        <TabsContent value="appointments" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Appointments by Status Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Appointments by Status</CardTitle>
              </CardHeader>
              <CardContent>
                {isAppointmentsByStatusLoading ? (
                  <div className="flex items-center justify-center h-[300px]">Loading chart data...</div>
                ) : (
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        status: {
                          label: "Status",
                          theme: {
                            light: "#ffc658",
                            dark: "#ffc658"
                          }
                        }
                      }}
                    >
                      <PieChart>
                        <Pie
                          data={appointmentsByStatus}
                          cx="50%"
                          cy="50%"
                          labelLine={!isMobile}
                          label={!isMobile ? ({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%` : undefined}
                          outerRadius={isMobile ? 80 : 120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {appointmentsByStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                      </PieChart>
                    </ChartContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Appointments Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Recent Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {isAppointmentsByDateLoading ? (
                  <div className="flex items-center justify-center h-[300px]">Loading chart data...</div>
                ) : (
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        count: {
                          label: "Appointments",
                          theme: {
                            light: "#8884d8",
                            dark: "#8884d8"
                          }
                        }
                      }}
                    >
                      <BarChart data={appointmentsByDate}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => format(new Date(date), 'MM/dd')}
                        />
                        <YAxis />
                        <ChartTooltip 
                          content={
                            <ChartTooltipContent 
                              labelFormatter={(date) => format(new Date(date as string), 'MMM dd, yyyy')}
                            />
                          } 
                        />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ChartContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Appointments Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Recent Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              {isAppointmentsTableLoading ? (
                <div className="py-8 text-center">Loading appointments...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment: any) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">{appointment.patient_name}</TableCell>
                        <TableCell>{appointment.doctors?.name}</TableCell>
                        <TableCell>{formatDate(appointment.appointment_date)}</TableCell>
                        <TableCell>{appointment.appointment_time}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            getStatusColor(appointment.status)
                          }`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* DOCTORS TAB */}
        <TabsContent value="doctors" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Doctor Specialties Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Doctor Specialties</CardTitle>
              </CardHeader>
              <CardContent>
                {isDoctorsBySpecialtyLoading ? (
                  <div className="flex items-center justify-center h-[300px]">Loading chart data...</div>
                ) : (
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        specialty: {
                          label: "Specialty",
                          theme: {
                            light: "#82ca9d",
                            dark: "#82ca9d"
                          }
                        }
                      }}
                    >
                      <PieChart>
                        <Pie
                          data={doctorsBySpecialty}
                          cx="50%"
                          cy="50%"
                          labelLine={!isMobile}
                          label={!isMobile ? ({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%` : undefined}
                          outerRadius={isMobile ? 80 : 120}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {doctorsBySpecialty.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend content={<ChartLegendContent />} />
                      </PieChart>
                    </ChartContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Doctor Ratings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Doctor Ratings</CardTitle>
              </CardHeader>
              <CardContent>
                {isDoctorsTableLoading ? (
                  <div className="flex items-center justify-center h-[300px]">Loading chart data...</div>
                ) : (
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        rating: {
                          label: "Rating",
                          theme: {
                            light: "#ffc658",
                            dark: "#ffc658"
                          }
                        }
                      }}
                    >
                      <BarChart 
                        data={doctors.slice(0, 10).map(d => ({ 
                          name: d.name.split(' ')[0], 
                          rating: d.rating,
                          reviews: d.review_count
                        }))}
                        layout={isMobile ? "vertical" : "horizontal"}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        {isMobile ? (
                          <>
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={80} />
                          </>
                        ) : (
                          <>
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 5]} />
                          </>
                        )}
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="rating" fill="#ffc658" />
                      </BarChart>
                    </ChartContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Doctors Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Doctors Directory</CardTitle>
            </CardHeader>
            <CardContent>
              {isDoctorsTableLoading ? (
                <div className="py-8 text-center">Loading doctors...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Specialty</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Reviews</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {doctors.map((doctor: any) => (
                      <TableRow key={doctor.id}>
                        <TableCell className="font-medium">{doctor.name}</TableCell>
                        <TableCell>{doctor.specialty}</TableCell>
                        <TableCell>{doctor.experience}</TableCell>
                        <TableCell>{doctor.rating.toFixed(1)}/5</TableCell>
                        <TableCell>{doctor.review_count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ENQUIRIES TAB */}
        <TabsContent value="enquiries" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Enquiries by Status Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Enquiries by Status</CardTitle>
              </CardHeader>
              <CardContent>
                {isEnquiriesByStatusLoading ? (
                  <div className="flex items-center justify-center h-[300px]">Loading chart data...</div>
                ) : (
                  <div className="h-[300px]">
                    <ChartContainer
                      config={{
                        value: {
                          label: "Count",
                          theme: {
                            light: "#8884d8",
                            dark: "#8884d8"
                          }
                        }
                      }}
                    >
                      <BarChart 
                        data={enquiriesByStatus}
                        layout={isMobile ? "vertical" : "horizontal"}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        {isMobile ? (
                          <>
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={100} />
                          </>
                        ) : (
                          <>
                            <XAxis dataKey="name" />
                            <YAxis />
                          </>
                        )}
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" fill="#8884d8" />
                      </BarChart>
                    </ChartContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Monthly Enquiries Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">Monthly Enquiries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <p className="text-muted-foreground">Coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enquiries Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Recent Enquiries</CardTitle>
            </CardHeader>
            <CardContent>
              {isRecentEnquiriesLoading ? (
                <div className="py-8 text-center">Loading enquiries...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentEnquiries.map((enquiry: any) => (
                      <TableRow key={enquiry.id}>
                        <TableCell className="font-medium">{enquiry.name}</TableCell>
                        <TableCell>{enquiry.email}</TableCell>
                        <TableCell>{enquiry.phone || 'N/A'}</TableCell>
                        <TableCell>{formatDate(enquiry.created_at)}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            getStatusColor(enquiry.status)
                          }`}>
                            {enquiry.status === 'in-progress' ? 'In Progress' : 
                             (enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1))}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminOverview;
