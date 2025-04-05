
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ServiceCard from '@/components/ui/ServiceCard';
import DoctorCard from '@/components/ui/DoctorCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Stethoscope, HeartPulse, Brain, Eye, Bone, Baby, Flask, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Define services with their icons
const services = [
  {
    id: 'cardiology',
    title: 'Cardiology',
    description: 'Comprehensive heart care including diagnosis, treatment, and prevention of cardiovascular diseases.',
    icon: <HeartPulse className="h-8 w-8" />,
    link: '/services/cardiology'
  },
  {
    id: 'neurology',
    title: 'Neurology',
    description: 'Specialized care for disorders of the nervous system, including the brain, spinal cord, and nerves.',
    icon: <Brain className="h-8 w-8" />,
    link: '/services/neurology'
  },
  {
    id: 'ophthalmology',
    title: 'Ophthalmology',
    description: 'Complete eye care services including routine exams, treatments for eye diseases, and surgical procedures.',
    icon: <Eye className="h-8 w-8" />,
    link: '/services/ophthalmology'
  },
  {
    id: 'orthopedics',
    title: 'Orthopedics',
    description: 'Treatment for musculoskeletal issues including fractures, joint problems, and spine disorders.',
    icon: <Bone className="h-8 w-8" />,
    link: '/services/orthopedics'
  },
  {
    id: 'pediatrics',
    title: 'Pediatrics',
    description: 'Comprehensive healthcare for infants, children, and adolescents, focusing on growth and development.',
    icon: <Baby className="h-8 w-8" />,
    link: '/services/pediatrics'
  },
  {
    id: 'pathology',
    title: 'Pathology',
    description: 'Diagnostic services including laboratory testing and analysis to identify diseases and conditions.',
    icon: <Flask className="h-8 w-8" />,
    link: '/services/pathology'
  }
];

const ServicesPage: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = React.useState('all');

  // Fetch doctors from Supabase
  const { data: doctors, isLoading } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const { data, error } = await supabase.from('doctors').select('*');
      if (error) {
        console.error('Error fetching doctors:', error);
        return [];
      }
      return data || [];
    }
  });

  // Filter doctors based on selected department
  const filteredDoctors = selectedDepartment === 'all' 
    ? doctors 
    : doctors?.filter(doctor => 
        doctor.specialty.toLowerCase() === selectedDepartment.toLowerCase()
      );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We offer a wide range of comprehensive healthcare services to meet your needs. 
            Our experienced medical professionals are dedicated to providing high-quality care.
          </p>
        </div>

        {/* Services Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Medical Departments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                icon={service.icon}
                link={service.link}
              />
            ))}
          </div>
        </section>

        {/* Doctors Section */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Our Specialists</h2>
            <Tabs 
              value={selectedDepartment} 
              onValueChange={setSelectedDepartment}
              className="mt-4 md:mt-0"
            >
              <TabsList>
                <TabsTrigger value="all">All Departments</TabsTrigger>
                <TabsTrigger value="cardiology">Cardiology</TabsTrigger>
                <TabsTrigger value="neurology">Neurology</TabsTrigger>
                <TabsTrigger value="orthopedics">Orthopedics</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-4 text-gray-500">Loading doctors...</p>
            </div>
          ) : filteredDoctors && filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.slice(0, 3).map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  id={doctor.id}
                  name={doctor.name}
                  specialty={doctor.specialty}
                  rating={doctor.rating}
                  reviewCount={doctor.review_count}
                  experience={doctor.experience}
                  imageUrl={doctor.image_url || '/placeholder.svg'}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Stethoscope className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 mb-4">No doctors found for this department.</p>
              <Button onClick={() => setSelectedDepartment('all')}>
                View All Departments
              </Button>
            </div>
          )}

          {filteredDoctors && filteredDoctors.length > 3 && (
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link to="/doctors">View All Doctors</Link>
              </Button>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default ServicesPage;
