
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import DoctorCard from '@/components/ui/DoctorCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Search, Filter } from 'lucide-react';

const DoctorsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');

  // Mock data for doctors
  const doctors = [
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
    },
    {
      id: "4",
      name: "Dr. Robert Thompson",
      specialty: "Orthopedics",
      rating: 4.7,
      reviewCount: 87,
      experience: "20",
      imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "5",
      name: "Dr. Emily Wilson",
      specialty: "Dermatology",
      rating: 4.9,
      reviewCount: 102,
      experience: "8",
      imageUrl: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "6",
      name: "Dr. James Rodriguez",
      specialty: "Cardiology",
      rating: 4.8,
      reviewCount: 114,
      experience: "17",
      imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "7",
      name: "Dr. Linda Chang",
      specialty: "Neurology",
      rating: 4.7,
      reviewCount: 78,
      experience: "11",
      imageUrl: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "8",
      name: "Dr. Thomas Baker",
      specialty: "Orthopedics",
      rating: 4.6,
      reviewCount: 91,
      experience: "14",
      imageUrl: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    },
    {
      id: "9",
      name: "Dr. Maria González",
      specialty: "Pediatrics",
      rating: 4.9,
      reviewCount: 132,
      experience: "13",
      imageUrl: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
    }
  ];

  // Specialties list derived from doctors data
  const specialties = ['all', ...new Set(doctors.map(doctor => doctor.specialty))];

  // Filter doctors based on search and specialty
  const filteredDoctors = doctors.filter(doctor => {
    const nameMatch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const specialtyMatch = specialtyFilter === 'all' || doctor.specialty === specialtyFilter;
    return nameMatch && specialtyMatch;
  });

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Doctors</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet our team of specialized healthcare professionals dedicated to providing 
              the highest quality medical care for you and your family.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search doctors by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="md:w-64">
                <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2 text-gray-400" />
                      <SelectValue placeholder="Filter by specialty" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty === 'all' ? 'All Specialties' : specialty}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Doctor Grid */}
          {filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
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
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No doctors found matching your criteria.</p>
              <Button onClick={() => {
                setSearchQuery('');
                setSpecialtyFilter('all');
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default DoctorsPage;
