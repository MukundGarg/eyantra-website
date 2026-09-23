import { ProjectProps } from "@/components/ProjectCard";

export const projects: ProjectProps[] = [
  {
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800",
    title: "Autonomous Hexapod",
    category: "Robotics",
    desc: "A custom-designed 6-legged robot capable of traversing complex terrains using inverse kinematics and spatial mapping.",
    techStack: ["C++", "ROS", "Fusion360", "Arduino"],
    link: "#",
  },
  {
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    title: "Smart IoT Greenhouse",
    category: "Embedded Systems",
    desc: "An automated micro-climate control system utilizing custom ESP32 networks and sensor arrays.",
    techStack: ["ESP32", "MQTT", "Node.js"],
    link: "#",
  },
  {
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
    title: "Defect Detection Vision",
    category: "AI & ML",
    desc: "Industrial computer vision pipeline for real-time manufacturing defect identification.",
    techStack: ["Python", "OpenCV", "TensorFlow"],
    link: "#",
  }
];

export const projectFilters = ["All", "Robotics", "Embedded Systems", "AI & ML", "Automation"];
