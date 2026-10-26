import Image from "next/image";
import Iconify from "@/components/Iconify";
import Link from "next/link";
import type { TeamMember } from "@/types/index";
import { supabase } from "@/utils/supabase";
import styles from "./HomeCoreSection.module.css";

type CoreMember = Pick<
  TeamMember,
  "id" | "name" | "role" | "image_url" | "category"
>;

function MemberCards({
  members,
  duplicate = false,
}: {
  members: CoreMember[];
  duplicate?: boolean;
}) {
  return (
    <div
      className={styles.cardSet}
      aria-hidden={duplicate || undefined}
      inert={duplicate}
    >
      {members.map((member, index) => (
        <article className={styles.card} key={member.id}>
          <div className={styles.cardTop}>
            <span className={styles.number}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className={styles.memberPhoto}>
              {member.image_url ? (
                <Image
                  src={member.image_url}
                  alt=""
                  fill
                  sizes="84px"
                  unoptimized
                />
              ) : (
                <span aria-hidden="true">
                  {member.name
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")
                    .toUpperCase()}
                </span>
              )}
            </span>
          </div>
          <h3>{member.name}</h3>
          <p>{member.role || "Core team member"}</p>
          <span className={styles.cardLabel}>
            <span />
            e-Yantra MSIT · {member.category === "core" ? "Core" : "Department"}
          </span>
        </article>
      ))}
    </div>
  );
}

async function getCoreMembers(): Promise<CoreMember[]> {
  const { data, error } = await supabase
    .from("team_members")
    .select("id, name, role, image_url, category")
    .in("category", ["core", "departments"])
    .eq("active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Homepage core team error:", error);
    return [];
  }

  return (data ?? []) as CoreMember[];
}

export default async function HomeCoreSection() {
  const members = await getCoreMembers();

  return (
    <section className={styles.section} aria-labelledby="home-core-title">
      <div className={styles.header}>
        <div className={styles.headingGroup}>
          <p className={styles.eyebrow}>The people behind the builds</p>
          <h2 id="home-core-title">
            At our <span>core.</span>
          </h2>
        </div>
        <div className={styles.intro}>
          <p>
            Meet the current core and department members who bring people,
            ideas, and engineering together at e-Yantra MSIT.
          </p>
          <Link href="/team" className={styles.exploreLink}>
            Meet the whole team
            <Iconify icon="lucide:arrow-up-right" />
          </Link>
        </div>
      </div>

      {members.length ? (
        <>
          <div
            className={styles.marquee}
            role="region"
            aria-label="Current e-Yantra MSIT core and department team"
            tabIndex={0}
          >
            <div className={styles.track}>
              <MemberCards members={members} />
              {Array.from({ length: 5 }, (_, index) => (
                <MemberCards
                  key={`duplicate-${index}`}
                  members={members}
                  duplicate
                />
              ))}
            </div>
          </div>
          <p className={styles.marqueeHint}>
            The people building e-Yantra MSIT together
          </p>
        </>
      ) : (
        <div className={styles.emptyState}>
          <p>Our core team is getting ready to meet you.</p>
          <Link href="/team">
            Visit the team page
            <Iconify icon="lucide:arrow-up-right" />
          </Link>
        </div>
      )}

      <span className={styles.sectionIndex} aria-hidden="true">
        02 / THE PEOPLE
      </span>
    </section>
  );
}
