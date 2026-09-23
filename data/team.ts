import { TeamMemberProps } from "@/components/TeamMemberCard";

export const teamData = {
  mentors: [
    {
      name: "Dr. Jane Doe",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
      designation: "Faculty Advisor",
      department: "Dept. of ECE",
      desc: "Guiding the society with over 15 years of experience in embedded systems.",
      linkedin: "#",
      email: "jane.doe@example.com"
    }
  ] as TeamMemberProps[],
  core: [
    {
      name: "John Smith",
      photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
      role: "President",
      subtitle: "Electronics Engine",
      linkedin: "#",
      github: "#"
    }
  ] as TeamMemberProps[],
  departments: {
    technical: [
      {
        name: "Alice Johnson",
        photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200",
        role: "Tech Lead",
        linkedin: "#",
        github: "#"
      }
    ] as TeamMemberProps[],
    management: [
      {
        name: "Bob Williams",
        photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200",
        role: "Management Lead",
        linkedin: "#"
      }
    ] as TeamMemberProps[]
  }
};
