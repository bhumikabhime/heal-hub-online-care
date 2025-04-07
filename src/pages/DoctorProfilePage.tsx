
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Avatar } from "@/components/ui/avatar";
import { Star, ArrowLeft, Calendar, Phone, Mail, MapPin, Award, Clock, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

const DoctorProfilePage = () => {
  const { doctorId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch doctor details from Supabase
  const { data: doctor, isLoading, error } = useQuery({
    queryKey: ['doctor', doctorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', doctorId)
        .single();
      
      if (error) {
        console.error('Error fetching doctor:', error);
        toast({
          title: "Error fetching doctor details",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }
      
      return data;
    }
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-gray-200 h-24 w-24 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !doctor) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Doctor Not Found</h2>
            <p className="text-gray-600 mb-6">
              Sorry, we couldn't find the doctor you're looking for.
            </p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Placeholder data (in a real app, these would come from the database)
  const education = [
    { degree: "MD in Medicine", institution: "Harvard Medical School", year: "2010-2014" },
    { degree: "Residency in Cardiology", institution: "Johns Hopkins Hospital", year: "2014-2017" },
    { degree: "Fellowship in Interventional Cardiology", institution: "Mayo Clinic", year: "2017-2019" }
  ];

  const services = [
    "Cardiac Consultation",
    "Echocardiography",
    "Stress Testing",
    "Heart Disease Prevention",
    "Cardiac Rehabilitation",
    "Electrophysiology"
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Doctors
        </Button>

        {/* Doctor Profile Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="bg-primary/5 p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                <img 
                  src={doctor.image_url || '/placeholder.svg'} 
                  alt={`Dr. ${doctor.name}`}
                  className="h-full w-full object-cover"
                />
              </Avatar>
              
              <div className="text-center md:text-left flex-grow">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
                <p className="text-primary font-medium mb-2">{doctor.specialty}</p>
                
                <div className="flex items-center justify-center md:justify-start mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < doctor.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-500">({doctor.review_count} reviews)</span>
                </div>
                
                <p className="text-gray-600 mb-4">
                  <Award className="inline-block h-4 w-4 mr-1 text-primary" />
                  {doctor.experience} years experience
                </p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
                  <Button asChild>
                    <Link to={`/appointments/book/${doctor.id}`}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Appointment
                    </Link>
                  </Button>
                  <Button variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Information Tabs */}
        <Tabs defaultValue="about" className="mb-12">
          <TabsList className="mb-6">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">About Dr. {doctor.name}</h2>
            <p className="text-gray-600 mb-6">
              Dr. {doctor.name} is a highly skilled {doctor.specialty.toLowerCase()} specialist with {doctor.experience} years of 
              experience. Their practice focuses on providing exceptional patient care and utilizing the latest 
              medical advancements to treat a wide range of conditions.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900">Email</h3>
                      <p className="text-gray-600 text-sm">doctor.{doctor.name.toLowerCase().replace(/\s+/g, '.')}@hospital.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900">Phone</h3>
                      <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900">Location</h3>
                      <p className="text-gray-600 text-sm">123 Medical Center, Suite 456</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900">Hours</h3>
                      <p className="text-gray-600 text-sm">Mon-Fri: 9:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
              
            <div className="bg-primary/5 p-4 rounded-md flex items-start">
              <Shield className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-600">
                Dr. {doctor.name} is board certified in {doctor.specialty} and stays current with the latest 
                advancements through continuous professional development.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="education" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Education & Training</h2>
            <div className="space-y-6">
              {education.map((item, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <h3 className="font-bold text-gray-800">{item.degree}</h3>
                  <p className="text-primary text-sm">{item.institution}</p>
                  <p className="text-gray-500 text-sm">{item.year}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="services" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Services Offered</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {services.map((service, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-md">
                  <div className="h-2 w-2 rounded-full bg-primary mr-3"></div>
                  <span className="text-gray-700">{service}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Schedule</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Day</th>
                    <th className="py-2 px-4 border-b text-left">Morning</th>
                    <th className="py-2 px-4 border-b text-left">Afternoon</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b font-medium">Monday</td>
                    <td className="py-2 px-4 border-b text-gray-600">9:00 AM - 12:00 PM</td>
                    <td className="py-2 px-4 border-b text-gray-600">1:00 PM - 5:00 PM</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b font-medium">Tuesday</td>
                    <td className="py-2 px-4 border-b text-gray-600">9:00 AM - 12:00 PM</td>
                    <td className="py-2 px-4 border-b text-gray-600">1:00 PM - 5:00 PM</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b font-medium">Wednesday</td>
                    <td className="py-2 px-4 border-b text-gray-600">9:00 AM - 12:00 PM</td>
                    <td className="py-2 px-4 border-b text-gray-600">1:00 PM - 5:00 PM</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b font-medium">Thursday</td>
                    <td className="py-2 px-4 border-b text-gray-600">9:00 AM - 12:00 PM</td>
                    <td className="py-2 px-4 border-b text-gray-600">1:00 PM - 5:00 PM</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b font-medium">Friday</td>
                    <td className="py-2 px-4 border-b text-gray-600">9:00 AM - 12:00 PM</td>
                    <td className="py-2 px-4 border-b text-gray-600">1:00 PM - 5:00 PM</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 font-medium">Saturday - Sunday</td>
                    <td className="py-2 px-4 text-gray-600" colSpan={2}>Closed</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 text-center">
              <Button asChild>
                <Link to={`/appointments/book/${doctor.id}`}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Book an Appointment
                </Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DoctorProfilePage;
