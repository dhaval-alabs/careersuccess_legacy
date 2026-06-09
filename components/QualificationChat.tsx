'use client';

import React, { useState, useEffect, useRef } from 'react';

interface QualificationChatProps {
  firstName: string;
  courseSubject: string;
  questions: string[];
  options: (string[])[];
  onComplete: (conversation: string[], preferredCallbackTime: string) => void;
}

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  isTyping?: boolean;
}

export default function QualificationChat({
  firstName,
  courseSubject,
  questions,
  options,
  onComplete,
}: QualificationChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [questionIndex, setQuestionIndex] = useState(-1);
  const [showOptions, setShowOptions] = useState(false);
  const [freeText, setFreeText] = useState('');
  const [conversation, setConversation] = useState<string[]>([]);
  const [preferredCallbackTime, setPreferredCallbackTime] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, showOptions]);

  const getQuestionText = (index: number) => {
    let q = questions[index];
    if (q) {
      q = q.replace('{course}', courseSubject);
    }
    return q;
  };

  useEffect(() => {
    // Start sequence
    if (questionIndex === -1) {
      const intro = `Hi ${firstName || 'there'} 👋 Just 4 quick taps so the right learning advisor can call you at a good time. Takes about 30 seconds.`;
      setMessages([{ id: 'intro', sender: 'bot', text: intro, isTyping: false }]);
      
      setTimeout(() => {
        setQuestionIndex(0);
      }, 1500);
    }
  }, []);

  useEffect(() => {
    if (questionIndex >= 0 && questionIndex < questions.length) {
      const q = getQuestionText(questionIndex);
      setMessages(prev => [...prev, { id: Math.random().toString(), sender: 'bot', text: q, isTyping: true }]);
      setTimeout(() => {
        setMessages(prev => prev.map(m => m.isTyping && m.text === q ? { ...m, isTyping: false } : m));
        setShowOptions(true);
      }, 800);
    } else if (questionIndex === questions.length) {
      // Chat complete
      const outro = "Perfect — sending your verification code to WhatsApp now. Talk soon!";
      setMessages(prev => [...prev, { id: 'outro', sender: 'bot', text: outro }]);
      setTimeout(() => {
        onComplete(conversation, preferredCallbackTime);
      }, 1500);
    }
  }, [questionIndex]);

  const handleUserReply = async (replyText: string, isSpecificTime = false) => {
    setShowOptions(false);
    setShowTimePicker(false);
    setFreeText('');
    
    // Add user message
    setMessages(prev => [...prev, { id: Math.random().toString(), sender: 'user', text: replyText }]);
    
    // Append to conversation
    const q = getQuestionText(questionIndex);
    const line = `Q: ${q}\nA: ${replyText}`;
    const newConv = [...conversation, line];
    setConversation(newConv);

    if (questionIndex === questions.length - 1) {
      // It's the last question (callback time)
      setPreferredCallbackTime(replyText);
      setQuestionIndex(prev => prev + 1);
    } else {
      // Need ack
      try {
        setMessages(prev => [...prev, { id: 'ack_typing', sender: 'bot', text: '...', isTyping: true }]);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout per brief
        
        const res = await fetch('/api/chat/ack', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: replyText, courseSubject }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        let ackText = "Got it.";
        if (res.ok) {
          const data = await res.json();
          ackText = data.ack;
        }
        
        setMessages(prev => prev.filter(m => m.id !== 'ack_typing'));
        setMessages(prev => [...prev, { id: Math.random().toString(), sender: 'bot', text: ackText }]);
        
        setTimeout(() => {
          setQuestionIndex(prev => prev + 1);
        }, 1000);
      } catch (err) {
        // Fallback on timeout or error
        setMessages(prev => prev.filter(m => m.id !== 'ack_typing'));
        setTimeout(() => {
          setQuestionIndex(prev => prev + 1);
        }, 500);
      }
    }
  };

  const handleSpecificTimeSubmit = () => {
    if (selectedDate && selectedTime) {
      const dt = new Date(selectedDate);
      const day = dt.getDay(); // 0 is Sunday
      if (day === 0) {
         alert("Advisors are not available on Sundays. Please pick Monday to Saturday.");
         return;
      }
      const timeVal = selectedTime; 
      const [hh, mm] = timeVal.split(':').map(Number);
      if (hh < 10 || hh > 18 || (hh === 18 && mm > 0)) {
         alert("Please pick a time between 10 AM and 6 PM.");
         return;
      }
      handleUserReply(`${selectedDate} at ${selectedTime}`, true);
    }
  };

  const currentOptions = questionIndex >= 0 && questionIndex < options.length ? options[questionIndex] : [];

  return (
    <div className="flex flex-col h-[400px] w-full bg-[#f0faf8] rounded-xl border border-[#D6ECEB] overflow-hidden" id="qualification-chat">
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
              m.sender === 'user' 
                ? 'bg-[#09263F] text-white rounded-br-none' 
                : 'bg-white text-[#09263F] border border-[#D6ECEB] rounded-bl-none shadow-sm'
            }`}>
              {m.isTyping ? (
                <div className="flex items-center gap-1 h-5">
                  <div className="w-1.5 h-1.5 bg-[#4A6275] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-[#4A6275] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-[#4A6275] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{m.text}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {showOptions && !showTimePicker && (
        <div className="p-4 bg-white border-t border-[#D6ECEB] space-y-2 animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-wrap gap-2">
            {currentOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => {
                  if (opt === 'Let me pick a specific time') {
                    setShowTimePicker(true);
                  } else {
                    handleUserReply(opt);
                  }
                }}
                className="px-4 py-2 bg-[#f0faf8] text-[#09263F] text-sm font-medium rounded-full border border-[#29E8A4] hover:bg-[#29E8A4] hover:text-[#09263F] transition-colors"
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && freeText.trim()) {
                  handleUserReply(freeText.trim());
                }
              }}
              placeholder="Or type your own answer..."
              className="flex-1 px-4 py-2 text-sm border border-[#D6ECEB] rounded-full focus:outline-none focus:border-[#29E8A4] focus:ring-1 focus:ring-[#29E8A4]"
            />
            <button
              onClick={() => freeText.trim() && handleUserReply(freeText.trim())}
              className="px-4 py-2 bg-[#09263F] text-white text-sm font-medium rounded-full disabled:opacity-50"
              disabled={!freeText.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {showTimePicker && (
        <div className="p-4 bg-white border-t border-[#D6ECEB] space-y-3 animate-in slide-in-from-bottom-2 duration-300">
          <p className="text-sm font-bold text-[#09263F]">Pick a time (Mon-Sat, 10 AM - 6 PM)</p>
          <div className="grid grid-cols-2 gap-2">
            <input 
              type="date" 
              className="px-3 py-2 text-sm border border-[#D6ECEB] rounded-lg focus:outline-none focus:border-[#29E8A4]"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <input 
              type="time" 
              className="px-3 py-2 text-sm border border-[#D6ECEB] rounded-lg focus:outline-none focus:border-[#29E8A4]"
              value={selectedTime}
              min="10:00"
              max="18:00"
              onChange={(e) => setSelectedTime(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTimePicker(false)}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg"
            >
              Back
            </button>
            <button
              onClick={handleSpecificTimeSubmit}
              disabled={!selectedDate || !selectedTime}
              className="flex-1 px-4 py-2 bg-[#29E8A4] text-[#09263F] text-sm font-bold rounded-lg disabled:opacity-50"
            >
              Confirm Time
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
