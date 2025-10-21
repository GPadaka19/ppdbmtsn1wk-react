import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX, Clock } from 'lucide-react';

const DashboardAdmin = () => {
  const stats = [
    { icon: Users, label: 'Total Pendaftar', value: 145, color: 'text-primary' },
    { icon: Clock, label: 'Pending', value: 23, color: 'text-warning' },
    { icon: UserCheck, label: 'Verified', value: 98, color: 'text-success' },
    { icon: UserX, label: 'Rejected', value: 12, color: 'text-destructive' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="section-padding">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>
          
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardAdmin;
