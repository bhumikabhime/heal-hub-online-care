
import React, { useState, useMemo, useCallback } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AppointmentBookingForm from './AppointmentBookingForm';

interface AppointmentSchedulerProps {
  doctors: any[];
  isLoading: boolean;
}

const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = React.memo(({ doctors, isLoading }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Memoize available times to prevent recalculation on re-renders
  const availableTimes = useMemo(() => [
    "09:00 AM - 09:30 AM", 
    "09:30 AM - 10:00 AM", 
    "10:00 AM - 10:30 AM", 
    "10:30 AM - 11:00 AM", 
    "11:00 AM - 11:30 AM", 
    "11:30 AM - 12:00 PM", 
    "02:00 PM - 02:30 PM", 
    "02:30 PM - 03:00 PM", 
    "03:00 PM - 03:30 PM", 
    "03:30 PM - 04:00 PM", 
    "04:00 PM - 04:30 PM"
  ], []);

  // Use callbacks for event handlers
  const handleOpenDialog = useCallback(() => setIsDialogOpen(true), []);
  const handleCloseDialog = useCallback(() => setIsDialogOpen(false), []);
  const handleDateChange = useCallback((newDate: Date | undefined) => setDate(newDate), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule New Appointment</CardTitle>
        <CardDescription>Select a date to see available time slots</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            className="rounded-md border"
            disabled={{ before: new Date() }}
          />
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <Button 
              className="w-full bg-primary hover:bg-primary/90" 
              onClick={handleOpenDialog}
              disabled={isLoading}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Book Appointment
            </Button>
            
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Book an Appointment</DialogTitle>
                <DialogDescription>
                  Fill in your information to schedule a consultation with one of our specialists.
                </DialogDescription>
              </DialogHeader>
              
              <AppointmentBookingForm 
                doctors={doctors} 
                selectedDate={date}
                onDateChange={handleDateChange}
                availableTimes={availableTimes}
                onClose={handleCloseDialog}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
});

AppointmentScheduler.displayName = 'AppointmentScheduler';

export default AppointmentScheduler;
