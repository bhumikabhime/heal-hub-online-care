
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

interface MedicalRecord {
  id: string;
  patient_name: string;
  patient_email: string;
  doctor_name: string;
  doctor_id: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  visit_date: string;
  notes: string | null;
  created_at: string;
}

const MedicalRecordsPage = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('medical_records')
          .select(`
            *,
            doctors(name)
          `)
          .order('visit_date', { ascending: false });

        if (error) {
          throw error;
        }

        // Transform the data to match our MedicalRecord interface
        const formattedRecords = data.map((record: any) => ({
          ...record,
          doctor_name: record.doctors?.name || 'Unknown Doctor',
        }));

        setRecords(formattedRecords);
      } catch (error: any) {
        toast({
          title: "Error fetching medical records",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchMedicalRecords();
    }
  }, [user, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Display admin layout for admins, regular layout for users
  if (isAdmin()) {
    return (
      <AdminLayout>
        <Card>
          <CardHeader>
            <div className="flex items-center">
              <FileText className="mr-2 h-6 w-6 text-primary" />
              <div>
                <CardTitle>Medical Records</CardTitle>
                <CardDescription>
                  View and manage all patient medical records
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-10">
                <p>Loading medical records...</p>
              </div>
            ) : (
              <Table>
                <TableCaption>A list of all medical records.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Treatment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.length > 0 ? (
                    records.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {record.patient_name}
                          <div className="text-xs text-muted-foreground">{record.patient_email}</div>
                        </TableCell>
                        <TableCell>{record.doctor_name}</TableCell>
                        <TableCell>{formatDate(record.visit_date)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{record.diagnosis}</Badge>
                        </TableCell>
                        <TableCell>{record.treatment}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No medical records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="flex items-center mb-6">
          <FileText className="mr-2 h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Your Medical Records</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <p>Loading your medical records...</p>
          </div>
        ) : (
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="detailed">Detailed View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Treatment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.length > 0 ? (
                    records.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{formatDate(record.visit_date)}</TableCell>
                        <TableCell>{record.doctor_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{record.diagnosis}</Badge>
                        </TableCell>
                        <TableCell>{record.treatment}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No medical records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="detailed">
              {records.length > 0 ? (
                <div className="space-y-6">
                  {records.map((record) => (
                    <Card key={record.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              Visit on {formatDate(record.visit_date)}
                            </CardTitle>
                            <CardDescription>
                              Doctor: {record.doctor_name}
                            </CardDescription>
                          </div>
                          <Badge variant="outline">{record.diagnosis}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4">
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Treatment</h4>
                            <p>{record.treatment}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm mb-1">Prescription</h4>
                            <p>{record.prescription}</p>
                          </div>
                          {record.notes && (
                            <div>
                              <h4 className="font-semibold text-sm mb-1">Notes</h4>
                              <p className="text-sm">{record.notes}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>No medical records found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Layout>
  );
};

export default MedicalRecordsPage;
