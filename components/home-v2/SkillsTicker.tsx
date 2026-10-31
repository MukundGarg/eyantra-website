import styles from "./SkillsTicker.module.css";

const skills = [
  "Robotics",
  "Embedded Systems",
  "IoT",
  "Automation",
  "Computer Vision",
  "Autonomous Navigation",
  "ROS",
  "Microcontrollers",
  "PCB Design",
  "Sensor Integration",
  "Motor Control",
  "PID Control",
  "C / C++",
  "Arduino",
  "STM32",
  "ESP32",
  "I2C / SPI / UART",
  "Python",
  "Edge Inference",
];

function SkillSet({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul className={styles.skillSet} aria-hidden={duplicate || undefined}>
      {skills.map((skill) => (
        <li key={skill}>{skill}</li>
      ))}
    </ul>
  );
}

export default function SkillsTicker() {
  return (
    <section className={styles.section} aria-label="e-Yantra technical skills">
      <div className={styles.viewport}>
        <div className={styles.track}>
          <SkillSet />
          <SkillSet duplicate />
        </div>
      </div>
    </section>
  );
}
