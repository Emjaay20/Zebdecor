'use client';

import React, { useState } from 'react';

interface SpatialConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle?: string;
}

export default function SpatialConsultationModal({
  isOpen,
  onClose,
  productTitle,
}: SpatialConsultationModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [timeSlot, setTimeSlot] = useState('Weekday Morning (10:00 - 12:00)');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-primary/70 backdrop-blur-md flex items-center justify-center p-gutter-mobile">
      <div className="bg-surface rounded-xl shadow-2xl max-w-lg w-full p-space-lg space-y-space-md relative border border-surface-container-highest/60 animate-in fade-in zoom-in-95 duration-200">
        <button
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors"
          onClick={handleReset}
          type="button"
          aria-label="Close Modal"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-secondary-container text-secondary mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[36px]">verified</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary">
              Appointment Requested
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mx-auto">
              Thank you, <span className="font-semibold text-primary">{name}</span>. A senior interior concierge from our Maitama Atelier will contact you via WhatsApp ({phone}) within 2 business hours to confirm your laser spatial scan.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-lg bg-primary text-on-primary font-label-uppercase text-label-uppercase tracking-wider hover:bg-secondary transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-space-xs">
              <span className="font-label-uppercase text-label-uppercase text-secondary tracking-widest block uppercase">
                In-Situ Spatial Assessment
              </span>
              <h3 className="font-headline-md text-headline-md text-primary">
                Book an Abuja Architectural Survey
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                A Senior Zebdecor Interior Architect will visit your residence in Maitama, Asokoro, Guzape, or Victoria Island with physical marble swatches and digital 3D spatial measuring tools
                {productTitle ? ` for ${productTitle}` : ''}.
              </p>
            </div>

            <form className="space-y-space-sm" onSubmit={handleSubmit}>
              <div>
                <label className="block font-label-uppercase text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">
                  Your Full Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-space-sm py-2.5 rounded bg-surface-container text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary border border-surface-container-highest/50"
                  placeholder="Arch. / Dr. / Alhaji..."
                  required
                  type="text"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-xs">
                <div>
                  <label className="block font-label-uppercase text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-space-sm py-2.5 rounded bg-surface-container text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary border border-surface-container-highest/50"
                    placeholder="+234..."
                    required
                    type="tel"
                  />
                </div>
                <div>
                  <label className="block font-label-uppercase text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">
                    Estate / Neighborhood
                  </label>
                  <input
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full px-space-sm py-2.5 rounded bg-surface-container text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary border border-surface-container-highest/50"
                    placeholder="Maitama, Abuja"
                    required
                    type="text"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label-uppercase text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">
                  Preferred Time of Visit
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-space-sm py-2.5 rounded bg-surface-container text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary border border-surface-container-highest/50"
                >
                  <option>Weekday Morning (10:00 - 12:00)</option>
                  <option>Weekday Afternoon (14:00 - 17:00)</option>
                  <option>Saturday Private Session</option>
                </select>
              </div>

              <button
                className="w-full py-3.5 rounded bg-primary text-on-primary font-label-uppercase text-label-uppercase tracking-widest hover:bg-secondary transition-all shadow-md mt-2"
                type="submit"
              >
                Confirm Atelier Consultation Request
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
