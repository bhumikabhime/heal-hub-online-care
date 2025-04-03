
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { Search, Filter, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const DoctorsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('all');
  const { toast } = useToast();

  // Fetch doctors from Supabase
  const { data: doctors, isLoading, error } = useQuery({
    queryKey: ['doctors'],
    queryFn: async () => {
      const { data, error } = await supabase.from('doctors').select('*');
      if (error) {
        console.error('Error fetching doctors:', error);
        toast({
          title: "Error fetching doctors",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      return data || [];
    }
  });

  // Filter doctors based on search and specialty
  const filteredDoctors = doctors?.filter(doctor => {
    const nameMatch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const specialtyMatch = specialtyFilter === 'all' || doctor.specialty === specialtyFilter;
    return nameMatch && specialtyMatch;
  }) || [];

  // Get unique specialties from the data
  const specialties = doctors 
    ? ['all', ...new Set(doctors.map(doctor => doctor.specialty))] 
    : ['all'];

  // Handle error state
  useEffect(() => {
    if (error) {
      toast({
        title: "Error connecting to database",
        description: "Could not fetch doctors data. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

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

          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-4 text-gray-500">Loading doctors...</p>
            </div>
          )}

          {/* Doctor Grid */}
          {!isLoading && filteredDoctors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor.id}
                  id={doctor.id}
                  name={doctor.name}
                  specialty={doctor.specialty}
                  rating={doctor.rating}
                  reviewCount={doctor.review_count}
                  experience={doctor.experience}
                  imageUrl={doctor.image_url}
                />
              ))}
            </div>
          ) : !isLoading && (
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
