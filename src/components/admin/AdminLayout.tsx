
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger 
} from '@/components/ui/sidebar';
import { Hospital, LayoutDashboard, Users, Calendar, MessageSquare, Settings, LogOut, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log out",
        variant: "destructive",
      });
    }
  };
  
  const getUserInitials = () => {
    if (!user) return 'AD';
    const email = user.email || '';
    return email.substring(0, 2).toUpperCase();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center p-2">
              <Hospital className="h-6 w-6 text-primary mr-2" />
              <span className="text-lg font-semibold">HealHub Admin</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/admin')}>
                  <Link to="/admin">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/admin/doctors')}>
                  <Link to="/admin/doctors">
                    <Users />
                    <span>Doctors</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/admin/appointments')}>
                  <Link to="/admin/appointments">
                    <Calendar />
                    <span>Appointments</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/medical-records')}>
                  <Link to="/medical-records">
                    <FileText />
                    <span>Medical Records</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/admin/enquiries')}>
                  <Link to="/admin/enquiries">
                    <MessageSquare />
                    <span>Enquiries</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive('/admin/settings')}>
                  <Link to="/admin/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="p-4 border-t flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleLogout}
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1 p-8 overflow-auto">
          <div className="flex items-center justify-between mb-8">
            <SidebarTrigger className="ml-2" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div /> {/* Empty div for flex spacing */}
          </div>
          <main className="bg-white p-6 rounded-lg shadow">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
