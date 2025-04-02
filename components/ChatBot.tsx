"use client";

import { GoogleGenerativeAI } from '@google/generative-ai';
import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatBot = ({ isOpen, onClose }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your financial assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize the Gemini AI client
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(userMessage);
      const responseText = result.response.text();

      setMessages((prev) => [...prev, { role: "assistant", content: responseText }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 md:w-96">
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-blue-600 text-white p-4 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center">
            <Bot className="mr-2 h-5 w-5" />
            Financial Assistant
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-blue-700">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-2",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] p-3 rounded-lg",
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  )}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <div className="bg-blue-600 p-2 rounded-full">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
                <div className="bg-gray-100 p-3 rounded-lg text-gray-800">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;
