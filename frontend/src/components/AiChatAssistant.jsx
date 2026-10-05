import React, { useState, useRef, useEffect } from "react";
import { chatWithAssistant } from "../services/api";

export default function AiChatAssistant({ onSchemeSelect, onBookmarkToggle, isBookmarked }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Namaste! 🙏 I am **SevaSaathi**, your AI Government Scheme Assistant. Tell me about your age, occupation, state, or financial requirements, and I will find the exact central and state schemes you qualify for with direct application links!",
      schemes: [],
      tips: [
        "Mention your occupation (Farmer, Student, Artisan, Business Owner, Homemaker)",
        "State if you have special eligibility (BPL card, Landholding, SC/ST/OBC quota)"
      ]
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const samplePrompts = [
    "🌾 Small farmer with 2 acres looking for input support & crop insurance",
    "🎓 SC female college student needing post-matric scholarship & tuition waiver",
    "☀️ How do I get ₹78,000 subsidy for rooftop solar on my house?",
    "🛠️ I am a carpenter/artisan. How to apply for PM Vishwakarma ₹15k toolkit?",
    "💼 Need ₹5 Lakh collateral-free loan to expand my grocery store in UP",
    "👵 68-year-old senior citizen looking for free healthcare & pension"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userMsg = { role: "user", text: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText("");
    setLoading(true);

    try {
      const response = await chatWithAssistant(text.trim());
      const botMsg = {
        role: "assistant",
        text: response.reply,
        schemes: response.schemes || [],
        tips: response.tips || []
      };
      setMessages([...updatedMessages, botMsg]);
    } catch (err) {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          text: "I encountered a connection error while analyzing schemes. Please ensure the backend server is running.",
          schemes: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-8 bg-slate-50 min-h-[calc(100vh-4rem)] flex flex-col">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col">
        
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-sky-700 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-inner">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">SevaSaathi AI Assistant</h2>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold bg-emerald-400 text-slate-950 rounded-full">
                  Online
                </span>
              </div>
              <p className="text-xs text-sky-200 mt-0.5">
                Natural Language Semantic Matching for Indian Government Schemes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-sky-200 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
            <span>🛡️ Official Ministry Links Verified</span>
          </div>
        </div>

        {/* Suggested Prompts Pills */}
        <div className="mb-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            💡 Tap any example prompt to ask:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="text-xs bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200/80 hover:border-sky-300 rounded-xl px-3 py-1.5 font-medium transition-all shadow-sm text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 bg-white rounded-2xl shadow-md border border-slate-200/80 p-4 sm:p-6 overflow-y-auto max-h-[60vh] space-y-6 mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <div className="flex items-start gap-2.5 max-w-3xl">
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm">
                    🤖
                  </div>
                )}
                
                <div
                  className={`rounded-2xl px-5 py-3.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white rounded-tr-none shadow-md"
                      : "bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Tips list if any */}
                  {msg.tips && msg.tips.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs text-slate-600 space-y-1">
                      <div className="font-semibold text-slate-700">📌 Helpdesk Tips:</div>
                      {msg.tips.map((tip, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <span className="text-emerald-500">•</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Embedded Matching Scheme Cards */}
                  {msg.schemes && msg.schemes.length > 0 && (
                    <div className="mt-4 space-y-3 pt-3 border-t border-slate-200">
                      <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                        🎯 Recommended Scheme Matches:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {msg.schemes.map((item) => {
                          const s = item.scheme;
                          const score = item.match_percentage || 85;
                          const isSaved = isBookmarked ? isBookmarked(s.id) : false;

                          return (
                            <div
                              key={s.id}
                              className="bg-white rounded-xl border border-slate-200 p-4 hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between text-left"
                            >
                              <div>
                                <div className="flex items-start justify-between gap-2 mb-1.5">
                                  <span className="text-xs font-extrabold text-sky-700 line-clamp-1">
                                    {s.name}
                                  </span>
                                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full flex-shrink-0">
                                    {score}% Match
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-500 mb-2">
                                  {s.ministry}
                                </div>
                                <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                                  {s.description}
                                </p>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2">
                                <button
                                  onClick={() => onSchemeSelect(s)}
                                  className="text-xs font-bold text-sky-600 hover:text-sky-800"
                                >
                                  View Details →
                                </button>
                                
                                {s.apply_link && (
                                  <a
                                    href={s.apply_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-sm"
                                  >
                                    <span>Apply Now</span>
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                  </a>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm">
                    👤
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                🤖
              </div>
              <div className="bg-slate-50 rounded-2xl rounded-tl-none px-4 py-3 border border-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-600 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-500 font-medium ml-1">Analyzing criteria & schemes...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-300 shadow-md focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-transparent transition-all"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask anything: e.g. 'I am 45, have 1 acre land and want loan for tractor'..."
            className="flex-1 px-4 py-3 text-slate-800 text-sm outline-none font-medium placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="px-5 py-3 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5 flex-shrink-0"
          >
            <span>Ask</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>

      </div>
    </section>
  );
}
