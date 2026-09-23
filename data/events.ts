import { EventProps } from "@/components/EventCard";

export const upcomingEvents: EventProps[] = [
  {
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    title: "Autonomous Robotics Workshop",
    category: "Workshops",
    date: "Oct 15, 2026",
    time: "10:00 AM - 4:00 PM",
    location: "MSIT Robotics Lab",
    desc: "A hands-on workshop covering the fundamentals of autonomous navigation, PID controllers, and basic ROS concepts.",
    link: "#"
  }
];

export const pastEvents: EventProps[] = [
  {
    image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=800",
    title: "e-Yantra Hackathon 2025",
    category: "Competitions",
    date: "Aug 20, 2025",
    summary: "24-hour hardware hackathon focusing on assistive technologies.",
    highlight: "150+ Participants",
    link: "#"
  }
];

export const eventFilters = ["All", "Workshops", "Competitions", "Talks", "Showcases"];
