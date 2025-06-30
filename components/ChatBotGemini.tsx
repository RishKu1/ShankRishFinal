import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent } from './ui/dialog';
import { Loader2, Bot, User, Mic, Send, Volume2, VolumeX } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AVATARS = {
  user: <User className="w-8 h-8 text-blue-500 bg-blue-100 rounded-full p-1" />,
  assistant: <Bot className="w-8 h-8 text-purple-500 bg-purple-100 rounded-full p-1" />,
};

const ChatBotGemini: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const speak = (text: string) => {
    if (isMuted || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const toggleMute = () => {
    setIsMuted((prevMuted) => {
      const newMutedState = !prevMuted;
      if (newMutedState && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      return newMutedState;
    });
  };

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          role: 'assistant',
          content: 'Hi! I am Finzo, your AI assistant. How can I help you today?',
        },
      ]);
      setInput('');
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    // Setup Speech Recognition
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window)) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setInput(finalTranscript + interimTranscript);
      };
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user' as const, content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        const errorText = `Error: ${errorData.error}\n\nDetails: ${errorData.details || 'No details provided.'}`;
        setMessages((msgs) => [...msgs, { role: 'assistant', content: errorText }]);
        speak(errorText);
        return;
      }

      const data = await res.json();
      const responseText = data.result || 'Sorry, I could not get a response.';
      setMessages((msgs) => [...msgs, { role: 'assistant', content: responseText }]);
      speak(responseText);
    } catch (e) {
      const errorText = e instanceof Error ? e.message : 'A network error occurred.';
      const fullError = `Failed to connect to the server: ${errorText}`;
      setMessages((msgs) => [...msgs, { role: 'assistant', content: fullError }]);
      speak(fullError);
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !loading) {
      sendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <Card className="w-full h-[500px] flex flex-col">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-500 text-white flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-6 h-6" /> Finzo AI 2.0
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={toggleMute} className="text-white hover:bg-white/20">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto px-4 py-2 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="mr-2 flex-shrink-0">{AVATARS.assistant}</div>
                )}
                <div
                  className={`rounded-2xl px-4 py-2 max-w-[70%] shadow text-sm whitespace-pre-line ${
                    msg.role === 'user'
                      ? 'bg-blue-500 text-white ml-auto'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="ml-2 flex-shrink-0">{AVATARS.user}</div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <Loader2 className="animate-spin w-4 h-4" /> Finzo AI 2.0 is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <form
            className="flex items-center gap-2 p-4 border-t bg-white"
            onSubmit={e => {
              e.preventDefault();
              if (!loading) sendMessage();
            }}
          >
            <Button type="button" variant="ghost" size="icon" onClick={toggleListening}>
              <Mic className={`w-5 h-5 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'hover:text-gray-700'}`} />
            </Button>
            <Input
              className="flex-1"
              placeholder="Type your question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleInputKeyDown}
              disabled={loading}
              autoFocus
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default ChatBotGemini; 