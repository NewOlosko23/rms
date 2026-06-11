// FILE: src/pages/Help.tsx
import React, { useState } from "react";
import { ChevronDown, Send, AlertCircle, CheckCircle2 } from "lucide-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "How do I add a new tenant to a unit?",
    answer: "Navigate to the Tenants page, click 'Add Tenant', fill in the tenant details including name, phone, email, national ID, select a unit, move-in date, and emergency contact information. The system will automatically create a rent record for the current month."
  },
  {
    id: "faq-2",
    question: "How can I track rent payments for a specific month?",
    answer: "Go to the Rent Tracker page. You can filter by month, location, or tenant status. All rent records are displayed with their current status (Paid, Pending, or Overdue). Click on any record to view payment details and mark as paid."
  },
  {
    id: "faq-3",
    question: "What happens when a tenant's lease expires?",
    answer: "When a lease is about to expire (within 60 days), you'll receive a notification and see it in the Calendar. You can renew the lease, or if the tenant vacates, use the Vacate function to mark the unit as vacant and remove pending rent records."
  },
  {
    id: "faq-4",
    question: "How do I configure M-Pesa payments?",
    answer: "Go to Settings and update your M-Pesa Till Number. Once configured, you can simulate M-Pesa payments directly in the Rent Tracker. In production, this integrates with your M-Pesa API."
  },
  {
    id: "faq-5",
    question: "Can I set different late payment fees for different properties?",
    answer: "Yes! In Settings, you can enable late payment fees and specify which property locations have this fee applied. The configured late fee amount is applied automatically to overdue rent records."
  },
  {
    id: "faq-6",
    question: "How do I generate reports on occupancy and revenue?",
    answer: "Use the Reports page to view revenue charts (last 6 months), occupancy rates, and tenant breakdown by location. All charts update dynamically based on your current data."
  },
  {
    id: "faq-7",
    question: "What information do I need to add a new unit?",
    answer: "Navigate to Units, click 'Add Unit', and provide the property location, unit number, unit type (Bedsitter, 1BR, 2BR), monthly rent amount, and floor number. The system generates a unit ID automatically based on the property."
  },
  {
    id: "faq-8",
    question: "Can I enable SMS reminders for rent payment?",
    answer: "Yes! In Settings, enable 'SMS Reminders' to send automatic payment reminders to tenants. The system uses the phone numbers in tenant profiles for SMS delivery."
  }
];

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: "bug" | "feature" | "general" | "billing";
}

export default function Help() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general"
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const handleFAQToggle = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setFormError("All fields are required");
      return;
    }

    if (!formData.email.includes("@")) {
      setFormError("Please enter a valid email address");
      return;
    }

    // Simulate sending (in production, this would call an API)
    console.log("Support request submitted:", formData);
    
    // Show success message
    setFormSubmitted(true);
    setFormError("");
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        category: "general"
      });
      setFormSubmitted(false);
    }, 3000);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Help & Support</h2>
        <p className="text-slate-600 text-sm">Find answers to common questions or contact our support team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FAQ Section - Takes 2 columns on large screens */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Frequently Asked Questions
            </h3>

            <div className="space-y-3">
              {FAQS.map((faq) => (
                <div key={faq.id} className="border border-slate-200 rounded-lg overflow-hidden hover:border-indigo-200 transition-colors">
                  <button
                    onClick={() => handleFAQToggle(faq.id)}
                    className="w-full px-4 py-3.5 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                  >
                    <span className="font-semibold text-slate-800 text-sm pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        expandedFAQ === faq.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedFAQ === faq.id && (
                    <div className="px-4 py-3.5 border-t border-slate-200 bg-white animate-in fade-in duration-150">
                      <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form Section - Takes 1 column on large screens */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-indigo-600" />
              Contact Support
            </h3>

            {formSubmitted && (
              <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex gap-3 animate-in fade-in duration-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-emerald-800">Message sent!</p>
                  <p className="text-xs text-emerald-600 mt-0.5">Our team will respond within 24 hours.</p>
                </div>
              </div>
            )}

            {formError && (
              <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-lg flex gap-3 animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-rose-800">{formError}</p>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              {/* Name Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="John Doe"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors bg-slate-50"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors bg-slate-50"
                />
              </div>

              {/* Category Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors bg-slate-50"
                >
                  <option value="general">General Inquiry</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Feature Request</option>
                  <option value="billing">Billing Issue</option>
                </select>
              </div>

              {/* Subject Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleFormChange}
                  placeholder="Brief subject line"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors bg-slate-50"
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleFormChange}
                  placeholder="Describe your issue or question..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors bg-slate-50 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>

            {/* Support Info */}
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
              <p className="text-xs text-slate-500 font-mono">
                <span className="font-semibold text-slate-600">Email:</span> support@avodal.co.ke
              </p>
              <p className="text-xs text-slate-500">
                <span className="font-semibold text-slate-600">Response time:</span> Within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6">
        <h3 className="font-bold text-slate-800 mb-4">Additional Support</h3>
        <p className="text-sm text-slate-600">For more detailed assistance, please reach out to our support team using the contact form above.</p>
      </div>
    </div>
  );
}
