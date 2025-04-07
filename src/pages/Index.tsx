import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import ServiceCard from '@/components/ui/ServiceCard';
import DoctorCard from '@/components/ui/DoctorCard';
import { 
  Calendar, 
  Heart, 
  Stethoscope, 
  Brain, 
  Bone, 
  Baby, 
  Activity,
  CheckCircle
} from 'lucide-react';

const HomePage = () => {
  // Mock data for services
  const services = [
    {
      id: 'general-checkup',
      title: 'General Checkup',
      description: 'Comprehensive health examinations for overall wellness and preventive care.',
      icon: <Stethoscope className="w-8 h-8" />,
      link: '/services/general-checkup'
    },
    {
      id: 'cardiology',
      title: 'Cardiology',
      description: 'Expert care for heart conditions, including diagnostics and treatments.',
      icon: <Heart className="w-8 h-8" />,
      link: '/services/cardiology'
    },
    {
      id: 'neurology',
      title: 'Neurology',
      description: 'Specialized care for conditions affecting the brain and nervous system.',
      icon: <Brain className="w-8 h-8" />,
      link: '/services/neurology'
    },
    {
      id: 'orthopedics',
      title: 'Orthopedics',
      description: 'Treatments for bone, joint, and muscle conditions to improve mobility.',
      icon: <Bone className="w-8 h-8" />,
      link: '/services/orthopedics'
    },
    {
      id: 'pediatrics',
      title: 'Pediatrics',
      description: 'Comprehensive healthcare for infants, children, and adolescents.',
      icon: <Baby className="w-8 h-8" />,
      link: '/services/pediatrics'
    },
    {
      id: 'pathology',
      title: 'Diagnostics',
      description: 'Advanced diagnostic services including lab tests and imaging.',
      icon: <Activity className="w-8 h-8" />,
      link: '/services/pathology'
    }
  ];

  // Mock data for doctors
  const featuredDoctors = [
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      rating: 4.9,
      reviewCount: 124,
      experience: "15",
      imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "2",
      name: "Dr. Michael Chen",
      specialty: "Neurology",
      rating: 4.8,
      reviewCount: 98,
      experience: "12",
      imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "3",
      name: "Dr. Jessica Patel",
      specialty: "Pediatrics",
      rating: 4.9,
      reviewCount: 156,
      experience: "10",
      imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="hero-section py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-8 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Your Health, Our Priority
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Experience exceptional healthcare with HealHub. Our team of experts is dedicated to providing personalized care for you and your family.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link to="/appointments">Book Appointment</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/services">Our Services</Link>
                </Button>
              </div>
              <div className="mt-8 flex items-center space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                      <img 
                        src={`https://randomuser.me/api/portraits/men/${i + 20}.jpg`} 
                        alt="Patient" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium">Join 10,000+ satisfied patients</p>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star} 
                        className="w-4 h-4 text-yellow-400 fill-current"
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm text-gray-500">4.9/5</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Healthcare professionals" 
                    className="w-full"
                  />
                </div>
                <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow p-3 flex items-center animate-pulse-light">
                  <Calendar className="h-6 w-6 text-primary mr-2" />
                  <span className="text-sm font-medium">24/7 available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="stat-card">
              <div className="text-3xl font-bold text-primary mb-1">15+</div>
              <p className="text-gray-600 text-sm">Years Experience</p>
            </div>
            <div className="stat-card">
              <div className="text-3xl font-bold text-primary mb-1">50+</div>
              <p className="text-gray-600 text-sm">Specialist Doctors</p>
            </div>
            <div className="stat-card">
              <div className="text-3xl font-bold text-primary mb-1">10k+</div>
              <p className="text-gray-600 text-sm">Happy Patients</p>
            </div>
            <div className="stat-card">
              <div className="text-3xl font-bold text-primary mb-1">24/7</div>
              <p className="text-gray-600 text-sm">Emergency Care</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a wide range of healthcare services to meet your medical needs, 
              all provided by experienced professionals in state-of-the-art facilities.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard 
                key={service.id}
                id={service.id}
                title={service.title}
                description={service.description}
                icon={service.icon}
                link={service.link}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Specialists</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our team of highly qualified healthcare professionals is dedicated to providing 
              exceptional care for all your health needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDoctors.map((doctor) => (
              <DoctorCard 
                key={doctor.id}
                id={doctor.id}
                name={doctor.name}
                specialty={doctor.specialty}
                rating={doctor.rating}
                reviewCount={doctor.reviewCount}
                experience={doctor.experience}
                imageUrl={doctor.imageUrl}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild variant="outline">
              <Link to="/doctors">View All Doctors</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose HealHub?</h2>
              <p className="text-gray-600 mb-6">
                We're committed to providing the highest quality healthcare services, with a focus on patient comfort and satisfaction.
              </p>
              <div className="space-y-4">
                <div className="flex">
                  <CheckCircle className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Expert Specialists</h4>
                    <p className="text-sm text-gray-600">Our doctors are highly qualified and experienced in their respective fields.</p>
                  </div>
                </div>
                <div className="flex">
                  <CheckCircle className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Modern Technology</h4>
                    <p className="text-sm text-gray-600">We use the latest medical equipment and technologies for accurate diagnosis and treatment.</p>
                  </div>
                </div>
                <div className="flex">
                  <CheckCircle className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">Patient-Centered Care</h4>
                    <p className="text-sm text-gray-600">Your comfort and wellbeing are our top priorities throughout your healthcare journey.</p>
                  </div>
                </div>
                <div className="flex">
                  <CheckCircle className="h-6 w-6 text-primary mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium">24/7 Support</h4>
                    <p className="text-sm text-gray-600">Our medical staff is available round the clock for emergencies and inquiries.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
                    alt="Modern medical facility" 
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
                    alt="Doctor consulting patient" 
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
                    alt="Medical equipment" 
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" 
                    alt="Hospital room" 
                    className="w-full h-48 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to experience better healthcare?</h2>
          <p className="text-primary-foreground text-lg mb-8 max-w-2xl mx-auto">
            Schedule an appointment today and take the first step towards better health and wellness.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary">
              <Link to="/appointments">Book an Appointment</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-primary">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
