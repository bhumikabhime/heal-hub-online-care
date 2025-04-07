
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import DoctorCard from '@/components/ui/DoctorCard';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Calendar, HeartPulse, Brain, Eye, Bone, Baby, Activity, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Define service data to match with URL params
const servicesData = {
  cardiology: {
    title: 'Cardiology',
    description: 'Our cardiology department provides comprehensive diagnosis, treatment, and management of heart conditions including coronary artery disease, heart failure, arrhythmias, and more.',
    icon: <HeartPulse className="h-16 w-16" />,
    features: [
      'Non-invasive cardiac testing',
      'Heart attack prevention and rehabilitation',
      'Pacemaker implantation and management',
      'Heart failure treatment'
    ]
  },
  neurology: {
    title: 'Neurology',
    description: 'Our neurology department specializes in the diagnosis and treatment of disorders affecting the brain, spinal cord, nerves, and muscles, including stroke, epilepsy, headaches, and neurodegenerative diseases.',
    icon: <Brain className="h-16 w-16" />,
    features: [
      'Stroke treatment and prevention',
      'Epilepsy monitoring and management',
      'Headache and migraine treatment',
      'Movement disorder management'
    ]
  },
  ophthalmology: {
    title: 'Ophthalmology',
    description: 'Our ophthalmology department provides comprehensive eye care, from routine vision tests to treatment of complex eye conditions such as glaucoma, cataracts, macular degeneration, and more.',
    icon: <Eye className="h-16 w-16" />,
    features: [
      'Comprehensive eye examinations',
      'Cataract surgery',
      'Glaucoma treatment',
      'Refractive error correction'
    ]
  },
  orthopedics: {
    title: 'Orthopedics',
    description: 'Our orthopedics department specializes in the diagnosis, treatment, and prevention of disorders of the bones, joints, ligaments, tendons, and muscles.',
    icon: <Bone className="h-16 w-16" />,
    features: [
      'Joint replacement surgery',
      'Sports injury treatment',
      'Fracture care',
      'Spine disorder management'
    ]
  },
  pediatrics: {
    title: 'Pediatrics',
    description: 'Our pediatrics department provides comprehensive healthcare for infants, children, and adolescents, focusing on growth and development, preventive health, and treating childhood illnesses.',
    icon: <Baby className="h-16 w-16" />,
    features: [
      'Well-child visits and vaccinations',
      'Developmental assessments',
      'Acute illness care',
      'Chronic condition management'
    ]
  },
  pathology: {
    title: 'Pathology',
    description: 'Our pathology department provides essential diagnostic services including laboratory testing and analysis to identify diseases and conditions.',
    icon: <Activity className="h-16 w-16" />,
    features: [
      'Clinical laboratory testing',
      'Anatomic pathology',
      'Molecular diagnostics',
      'Blood banking and transfusion services'
    ]
  }
};

const ServiceDetailPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  
  // Fetch doctors from Supabase that match the specialty
  const { data: doctors, isLoading } = useQuery({
    queryKey: ['doctors', serviceId],
    queryFn: async () => {
      // Match the serviceId to the appropriate specialty name 
      // (e.g., 'cardiology' to 'Cardiology')
      const specialty = serviceId ? servicesData[serviceId as keyof typeof servicesData]?.title : '';
      
      if (!specialty) return [];

      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .ilike('specialty', specialty);
        
      if (error) {
        console.error('Error fetching doctors:', error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!serviceId
  });

  // Get service data based on the serviceId
  const serviceData = serviceId ? servicesData[serviceId as keyof typeof servicesData] : null;

  if (!serviceData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/services">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumb navigation */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="p-0 text-gray-500 hover:text-primary">
            <Link to="/services" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Link>
          </Button>
        </div>
        
        {/* Service Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="p-4 bg-primary/10 rounded-lg text-primary">
              {serviceData.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{serviceData.title}</h1>
              <p className="text-gray-600 max-w-2xl">{serviceData.description}</p>
            </div>
          </div>
        </div>
        
        {/* Service Features */}
        <div className="bg-gray-50 p-6 rounded-lg mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-4">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {serviceData.features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Department Doctors */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Meet Our {serviceData.title} Specialists</h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-4 text-gray-500">Loading doctors...</p>
            </div>
          ) : doctors && doctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
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
              <p className="text-gray-500 mb-4">No specialists are currently listed for this department.</p>
              <Button asChild>
                <Link to="/appointments">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book an Appointment
                </Link>
              </Button>
            </div>
          )}
        </div>
        
        {/* CTA Section */}
        <div className="bg-primary text-white p-8 rounded-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Need a {serviceData.title} Consultation?</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Our expert team is ready to help you with your health concerns. Schedule an appointment today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="secondary">
                <Link to="/appointments">Book an Appointment</Link>
              </Button>
              <Button asChild variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-primary">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceDetailPage;
