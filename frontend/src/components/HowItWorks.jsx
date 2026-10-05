import React from "react";

export default function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: "Tell Us About Yourself",
      desc: "Share your age, income, location, caste, occupation, and interests.",
      icon: "👤",
    },
    {
      step: 2,
      title: "Smart Matching",
      desc: "Our AI engine filters thousands of schemes and computes match scores using TF-IDF and eligibility rules.",
      icon: "🧠",
    },
    {
      step: 3,
      title: "Get Personalized Recommendations",
      desc: "Receive a ranked list of schemes tailored to your profile with detailed eligibility breakdown.",
      icon: "🎯",
    },
    {
      step: 4,
      title: "Apply with Confidence",
      desc: "Click through to official portals and apply for your matched schemes.",
      icon: "🚀",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
          <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
            SchemeSeva uses a combination of content-based filtering and
            eligibility matching to find the most relevant government schemes
            for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.step} className="relative">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-200/60 text-center h-full">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.desc}</p>
              </div>
              {step.step < steps.length && (
                <div className="hidden lg:block absolute top-8 -right-4 w-8 h-0.5 bg-slate-300" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-slate-50 rounded-xl p-6 border border-slate-200/60">
          <h3 className="font-semibold text-slate-900 mb-3">
            How Recommendations Are Computed
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-medium text-primary-700">60%</div>
              <p className="text-sm text-slate-600">Eligibility Matching</p>
            </div>
            <div>
              <div className="text-lg font-medium text-primary-700">45%</div>
              <p className="text-sm text-slate-600">
                Text Similarity (TF-IDF + Keywords)
              </p>
            </div>
            <div>
              <div className="text-lg font-medium text-primary-700">256-bit</div>
              <p className="text-sm text-slate-600">Feature Vectors</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
