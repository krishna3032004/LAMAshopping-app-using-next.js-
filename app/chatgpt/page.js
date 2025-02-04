"use client"
import { useState,useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Loader2 } from "lucide-react";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ✅ Initial message from the bot when the chat loads
    setMessages([
      {
        sender: "bot",
        text: "👋 Hello! I'm Gemini, your AI assistant. Ask me anything about products, orders, or help with your shopping! 🛍️",
      },
    ]);
  }, []);


  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const conversationHistory = messages.map(msg => `${msg.sender === 'user' ? 'User' : 'Bot'}: ${msg.text}`).join('\n');

  // Add the current user message to the history
  const fullConversation = conversationHistory + `\nUser: ${input}`;
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: fullConversation }),
      });

      const data = await response.json();
      const botMessage = { sender: "bot", text: data.candidates?.[0]?.content.parts[0].text || "No response", };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Error: Could not fetch response" }]);
    }finally {
        setLoading(false);
      }
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto bg-white text-gray-900 shadow-xl rounded-2xl overflow-hidden border border-gray-300">
    {/* Header */}
    <div className="bg-blue-500 text-white text-center py-3 text-lg font-semibold">
      Chat with Gemini
    </div>

    {/* Chat Messages */}
    <div className="flex flex-col gap-2 p-4 overflow-y-auto h-80 bg-gray-100">
      {messages.map((msg, index) => (
        <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
          <div
            className={`p-3 max-w-xs rounded-xl ${
              msg.sender === "user"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-900"
            }`}
          >
            <ReactMarkdown>{msg.text}</ReactMarkdown> {/* Renders markdown */}
          </div>
        </div>
      ))}
      {loading && (
        <div className="flex justify-start">
          <div className="p-3 bg-gray-200 text-gray-900 rounded-xl flex items-center gap-2">
            <Loader2 className="animate-spin w-4 h-4" />
            Typing...
          </div>
        </div>
      )}
    </div>

    {/* Input Field */}
    <div className="border-t border-gray-300 p-3 flex items-center gap-2 bg-white">
      <input
        type="text"
        className="flex-1 p-2 rounded-lg bg-gray-200 text-gray-900 border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Type a message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 flex items-center gap-2"
        onClick={sendMessage}
        disabled={loading}
      >
        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
      </button>
    </div>
  </div>
  );
}