"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Iconify from "@/components/Iconify";

export interface TeamMemberProps {
  name: string;
  photo: string | null;
  role?: string | null; // For core/dept
  designation?: string | null; // For mentors
  department?: string | null; // For mentors
  subtitle?: string | null; // For core
  desc?: string | null; // For mentors
  linkedin?: string | null;
  github?: string | null;
  twitter?: string | null;
  email?: string | null;
}

export default function TeamMemberCard({
  member,
  variant = "core",
}: {
  member: TeamMemberProps;
  variant?: "mentor" | "core" | "dept";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const openLightbox = () => {
    if (!member.photo) return;
    setIsClosing(false);
    setIsOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeLightbox]);

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  const renderLightbox = () => {
    if (!isOpen || !member.photo || typeof document === "undefined") return null;

    return createPortal(
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md transition-opacity duration-200 ease-out ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        style={{ animation: isClosing ? undefined : "lightboxFadeIn 0.2s ease-out" }}
        onClick={closeLightbox}
      >
        <style>{`
          @keyframes lightboxFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes lightboxScaleIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Enlarged photo of ${member.name}`}
          className={`relative max-w-xl max-h-[90vh] w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col items-center transition-all duration-200 ease-out ${
            isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
          style={{ animation: isClosing ? undefined : "lightboxScaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex items-center justify-between pb-3 px-1 border-b border-[var(--border)] mb-3">
            <div className="flex flex-col pr-2">
              <h3 className="text-base font-bold font-mono text-[var(--text-primary)] tracking-tight">{member.name}</h3>
              {(member.designation || member.role) && (
                <p className="text-xs text-[var(--accent-red)] font-mono uppercase tracking-wider font-semibold">
                  {member.designation || member.role}
                </p>
              )}
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeLightbox}
              className="p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface-alt)] hover:bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-red)] shrink-0"
              aria-label="Close enlarged photo"
            >
              <Iconify icon="lucide:x" className="w-5 h-5" />
            </button>
          </div>

          <div className="relative flex items-center justify-center overflow-hidden rounded-xl bg-[var(--bg-surface-alt)] border border-[var(--border)] max-h-[70vh] w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member.photo}
              alt={member.name}
              className="max-h-[70vh] w-auto h-auto max-w-full object-contain rounded-xl"
            />
          </div>
        </div>
      </div>,
      document.body
    );
  };

  const renderSocialLinks = () => (
    <div className="social-reveal flex gap-3 mt-auto pt-4 w-full justify-center">
      {member.linkedin && (
        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <Iconify icon="lucide:linkedin" className="w-4 h-4" />
        </a>
      )}
      {member.github && (
        <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <Iconify icon="lucide:github" className="w-4 h-4" />
        </a>
      )}
      {member.twitter && (
        <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <Iconify icon="lucide:twitter" className="w-4 h-4" />
        </a>
      )}
      {member.email && (
        <a href={`mailto:${member.email}`} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <Iconify icon="lucide:mail" className="w-4 h-4" />
        </a>
      )}
    </div>
  );

  if (variant === "mentor") {
    return (
      <>
        <div className="card-hover group relative overflow-hidden p-6 border border-[var(--border)] bg-[var(--bg-surface)] rounded-xl flex items-start gap-4 shadow-sm hover:shadow-md">
          {member.photo ? (
            <button
              type="button"
              onClick={openLightbox}
              className="group/photo relative w-20 h-20 rounded-lg overflow-hidden shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-red)] text-left"
              aria-label={`Enlarge photo of ${member.name}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={member.photo}
                alt={member.name}
                className="card-img w-full h-full rounded-lg object-cover bg-[var(--bg-surface-alt)] border border-[var(--border)] grayscale opacity-85 transition-all duration-300 group-hover/photo:scale-110 group-hover/photo:grayscale-0 group-hover/photo:opacity-100"
              />
              <span className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                <Iconify icon="lucide:zoom-in" className="w-5 h-5 text-white drop-shadow" />
              </span>
            </button>
          ) : (
            <div className="w-20 h-20 rounded-lg bg-[var(--bg-surface-alt)] border border-[var(--border)] flex items-center justify-center shrink-0">
              <Iconify icon="lucide:user" className="w-8 h-8 text-[var(--text-secondary)]" />
            </div>
          )}
          <div className="flex-1 flex flex-col h-full">
            <h3 className="text-lg font-bold font-mono text-[var(--text-primary)] tracking-tight">{member.name}</h3>
            <p className="text-[var(--accent-red)] text-xs font-mono uppercase tracking-wider mb-2 font-semibold">{member.designation}</p>
            <p className="text-xs text-[var(--text-secondary)] mb-3">{member.department}</p>
            {member.desc && <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 font-normal">{member.desc}</p>}
            <div className="mt-auto pt-4 flex gap-3 w-full justify-start">
              {member.linkedin && (
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  <Iconify icon="lucide:linkedin" className="w-4 h-4" />
                </a>
              )}
              {member.github && (
                <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  <Iconify icon="lucide:github" className="w-4 h-4" />
                </a>
              )}
              {member.twitter && (
                <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  <Iconify icon="lucide:twitter" className="w-4 h-4" />
                </a>
              )}
              {member.email && (
                <a href={`mailto:${member.email}`} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  <Iconify icon="lucide:mail" className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
        {renderLightbox()}
      </>
    );
  }

  if (variant === "dept") {
    return (
      <>
        <div className="card-hover group relative overflow-hidden p-5 border border-[var(--border)] bg-[var(--bg-surface)] rounded-xl flex items-center gap-4 filter-fade shadow-sm hover:shadow-md">
          {member.photo ? (
            <button
              type="button"
              onClick={openLightbox}
              className="group/photo relative w-16 h-16 rounded-lg overflow-hidden shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-red)] text-left"
              aria-label={`Enlarge photo of ${member.name}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={member.photo}
                alt={member.name}
                className="card-img w-full h-full rounded-lg object-cover bg-[var(--bg-surface-alt)] border border-[var(--border)] grayscale opacity-85 transition-all duration-300 group-hover/photo:scale-110 group-hover/photo:grayscale-0 group-hover/photo:opacity-100"
              />
              <span className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
                <Iconify icon="lucide:zoom-in" className="w-4 h-4 text-white drop-shadow" />
              </span>
            </button>
          ) : (
            <div className="w-16 h-16 rounded-lg bg-[var(--bg-surface-alt)] border border-[var(--border)] flex items-center justify-center shrink-0">
              <Iconify icon="lucide:user" className="w-6 h-6 text-[var(--text-secondary)]" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-md font-bold font-mono text-[var(--text-primary)] tracking-tight leading-tight mb-1">{member.name}</h3>
            <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-medium">{member.role}</p>
            <div className="social-reveal mt-2 flex gap-3">
              {member.linkedin && (
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  <Iconify icon="lucide:linkedin" className="w-3 h-3" />
                </a>
              )}
              {member.github && (
                <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                  <Iconify icon="lucide:github" className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
        {renderLightbox()}
      </>
    );
  }

  return (
    <>
      <div className="card-hover group relative overflow-hidden p-6 border border-[var(--border)] bg-[var(--bg-surface)] rounded-xl text-center flex flex-col items-center shadow-sm hover:shadow-md">
        {member.photo ? (
          <button
            type="button"
            onClick={openLightbox}
            className="group/photo relative w-24 h-24 rounded-full overflow-hidden shrink-0 mb-4 border-2 border-[var(--border)] group-hover:border-[var(--accent-red)] hover:border-[var(--accent-red)] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-red)]"
            aria-label={`Enlarge photo of ${member.name}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={member.photo}
              alt={member.name}
              className="card-img w-full h-full rounded-full object-cover bg-[var(--bg-surface-alt)] grayscale opacity-85 transition-all duration-300 group-hover/photo:scale-110 group-hover/photo:grayscale-0 group-hover/photo:opacity-100"
            />
            <span className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
              <Iconify icon="lucide:zoom-in" className="w-6 h-6 text-white drop-shadow" />
            </span>
          </button>
        ) : (
          <div className="w-24 h-24 rounded-full bg-[var(--bg-surface-alt)] border-2 border-[var(--border)] flex items-center justify-center mb-4 shrink-0">
            <Iconify icon="lucide:user" className="w-10 h-10 text-[var(--text-secondary)]" />
          </div>
        )}
        <h3 className="text-lg font-bold font-mono text-[var(--text-primary)] tracking-tight">{member.name}</h3>
        <p className="text-[var(--accent-red)] text-xs font-mono uppercase tracking-wider mt-1 font-semibold">{member.role}</p>
        {member.subtitle && <p className="text-[10px] text-[var(--text-secondary)] mt-1 uppercase tracking-widest">{member.subtitle}</p>}
        {renderSocialLinks()}
      </div>
      {renderLightbox()}
    </>
  );
}
