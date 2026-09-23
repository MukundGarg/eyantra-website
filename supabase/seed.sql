-- Seed Team Members
INSERT INTO team_members (name, role, category, department, image_url, linkedin_url, display_order)
VALUES
('Dr. Jane Doe', 'Faculty Advisor', 'mentors', 'Dept. of ECE', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200', '#', 1),
('John Smith', 'President', 'core', NULL, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200', '#', 1),
('Alice Johnson', 'Tech Lead', 'departments', 'technical', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=200', '#', 1),
('Bob Williams', 'Management Lead', 'departments', 'management', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200', '#', 2);

-- Seed Projects
INSERT INTO projects (title, category, short_description, tech_stack, cover_image, demo_url, display_order)
VALUES
('Autonomous Hexapod', 'Robotics', 'A custom-designed 6-legged robot capable of traversing complex terrains using inverse kinematics and spatial mapping.', ARRAY['C++', 'ROS', 'Fusion360', 'Arduino'], 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800', '#', 1),
('Smart IoT Greenhouse', 'Embedded Systems', 'An automated micro-climate control system utilizing custom ESP32 networks and sensor arrays.', ARRAY['ESP32', 'MQTT', 'Node.js'], 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800', '#', 2),
('Defect Detection Vision', 'AI & ML', 'Industrial computer vision pipeline for real-time manufacturing defect identification.', ARRAY['Python', 'OpenCV', 'TensorFlow'], 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800', '#', 3);

-- Seed Events
INSERT INTO events (title, event_type, short_description, event_date, event_time, location, cover_image, registration_url, status, display_order)
VALUES
('Autonomous Robotics Workshop', 'Workshops', 'A hands-on workshop covering the fundamentals of autonomous navigation, PID controllers, and basic ROS concepts.', '2026-10-15', '10:00 AM - 4:00 PM', 'MSIT Robotics Lab', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800', '#', 'upcoming', 1),
('e-Yantra Hackathon 2025', 'Competitions', '24-hour hardware hackathon focusing on assistive technologies.', '2025-08-20', NULL, NULL, 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&q=80&w=800', '#', 'past', 2);
