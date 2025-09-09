// src/pages/LandingPage.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Bell, Users, Wrench, BarChart } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Manage Your Vehicles Smarter
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-8">
          VIS Manager helps you track vehicles, licenses, drivers, and
          maintenance logs—all in one place.
        </p>
        <div className="flex gap-4">
          <Button
            size="lg"
            className="bg-white text-blue-700 hover:bg-gray-100"
            onClick={() => navigate("/")}
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-blue-700"
          >
            See Features
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 md:px-12 lg:px-20 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Key Features
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: <BarChart className="h-8 w-8 text-blue-600" />,
              title: "Smart Dashboard",
              desc: "Monitor vehicles, drivers, and logs in real time.",
            },
            {
              icon: <Wrench className="h-8 w-8 text-blue-600" />,
              title: "Maintenance Tracking",
              desc: "Track repairs, oil changes, and service history.",
            },
            {
              icon: <Bell className="h-8 w-8 text-blue-600" />,
              title: "License Alerts",
              desc: "Get notified before vehicle licenses expire.",
            },
            {
              icon: <Users className="h-8 w-8 text-blue-600" />,
              title: "Driver Management",
              desc: "Assign drivers and monitor accountability easily.",
            },
          ].map((f, idx) => (
            <Card
              key={idx}
              className="shadow-md hover:shadow-lg transition rounded-xl"
            >
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          How It Works
        </h2>
        <div className="grid gap-8 md:grid-cols-3 text-center">
          {[
            {
              step: "1",
              title: "Register Vehicles & Drivers",
              desc: "Add vehicles and assign drivers with license details.",
            },
            {
              step: "2",
              title: "Log Trips & Maintenance",
              desc: "Track mileage, expenses, and incidents in seconds.",
            },
            {
              step: "3",
              title: "Generate Reports",
              desc: "Stay compliant and keep your fleet in check.",
            },
          ].map((s, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white text-lg font-bold mb-4">
                {s.step}
              </div>
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-gray-600 text-sm max-w-xs">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-700 to-blue-900 text-white text-center px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Be the first to experience VIS Manager
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          Join early access and take control of your vehicle management system.
        </p>
        <form className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 rounded-lg text-gray-900 w-full sm:w-auto flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <Button
            size="lg"
            className="bg-white text-blue-700 hover:bg-gray-100"
          >
            Join Early Access
          </Button>
        </form>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-sm py-6 px-6 text-center">
        <p>© {new Date().getFullYear()} VIS Manager. All rights reserved.</p>
        <p className="mt-2">Built with ❤️ using React, Tailwind & ShadCN</p>
      </footer>
    </div>
  );
}
