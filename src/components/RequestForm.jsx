import React, { useState } from "react";
import { supabase, hasSupabase } from "../lib/supabase";

const services = [
  "Website Security Check",
  "Standard Website Security Check",
  "Web Application Security",
  "Wi-Fi / Network Security",
  "Website + Wi-Fi Combo",
  "Data & Access Security",
  "Cybersecurity Awareness / Training",
  "Phishing Awareness",
  "WAF Setup Assistance",
  "Website Hardening",
  "Security Assessment",
  "Security Incident Assistance",
  "Other",
];

function RequestForm({ selectedService = "" }) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (!(form instanceof HTMLFormElement)) {
      setStatus("Unable to access the form. Please refresh the page.");
      return;
    }

    setLoading(true);
    setStatus("");

    try {
      if (!hasSupabase || !supabase) {
        throw new Error(
          "Request service is temporarily unavailable. Please try again shortly."
        );
      }

      const formData = new FormData(form);

      const payload = {
        name: String(formData.get("name") || "").trim(),
        organization: String(
          formData.get("organization") || ""
        ).trim(),
        phone: String(formData.get("phone") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        service: String(formData.get("service") || "").trim(),
        message: String(formData.get("message") || "").trim(),
      };

      if (
        !payload.name ||
        !payload.organization ||
        !payload.phone ||
        !payload.email ||
        !payload.service ||
        !payload.message
      ) {
        throw new Error("Please fill in all required fields.");
      }

      const { error } = await supabase
        .from("inquiries")
        .insert([payload]);

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
      }

      setStatus(
        "Request submitted successfully. KAVACH will contact you."
      );

      form.reset();
    } catch (error) {
      console.error("Request submission error:", error);

      setStatus(
        error instanceof Error
          ? error.message
          : "Could not submit your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="contact-form request-form"
      onSubmit={submit}
    >
      <div className="selected-service">
        <span>SELECTED SERVICE</span>
        <strong>
          {selectedService || "Choose a service"}
        </strong>
      </div>

      <label>
        Full Name *
        <input
          name="name"
          type="text"
          required
          placeholder="Your full name" autoComplete="name"
        />
      </label>

      <label>
        Company / Organisation *
        <input
          name="organization"
          type="text"
          required
          placeholder="Company / organisation" autoComplete="organization"
        />
      </label>

      <div className="form-two">
        <label>
          Phone *
          <input
            name="phone"
            type="tel"
            required
            placeholder="Your phone number" autoComplete="tel" inputMode="tel"
          />
        </label>

        <label>
          Email *
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com" autoComplete="email"
          />
        </label>
      </div>

      <label>
        Service *
        <select
          name="service"
          defaultValue={selectedService || ""}
          required
        >
          <option value="" disabled>
            Select a service
          </option>

          {services.map((service) => (
            <option
              key={service}
              value={service}
            >
              {service}
            </option>
          ))}
        </select>
      </label>

      <label>
        Requirement *
        <textarea
          name="message"
          required
          rows="6"
          placeholder="Tell us what you want checked or secured. Please do not share passwords, API keys or other secrets."
        />
      </label>

      <button
        type="submit"
        className="btn btn-dark"
        disabled={loading}
      >
        {loading
          ? "Submitting..."
          : "Submit Security Request ↗"}
      </button>

      {status && (
        <div
          className="form-status"
          role="status"
          aria-live="polite"
        >
          {status}
        </div>
      )}
    </form>
  );
}

/* BOTH EXPORTS */
export { RequestForm };
export default RequestForm;
