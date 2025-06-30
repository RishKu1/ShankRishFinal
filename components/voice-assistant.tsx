"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Bot, User, X, Loader2, Send, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { formatCurrency } from '@/lib/utils';
import { Button } from './ui/button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; left: number };
  setPosition: React.Dispatch<React.SetStateAction<{ top: number; left: number }>>;
}

const VoiceAssistant = ({ isOpen, onClose, position, setPosition }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const [input, setInput] = useState('');
  const [lastCategoryContext, setLastCategoryContext] = useState<string | null>(null);
  
  const { data: summaryData, isLoading: isSummaryLoading } = useGetSummary();
  const { data: categories = [], isLoading: isCategoriesLoading } = useGetCategories();
  const { data: accounts = [], isLoading: isAccountsLoading } = useGetAccounts();
  const { data: transactions = [], isLoading: isTransactionsLoading } = useGetTransactions();

  const isLoading = isSummaryLoading || isCategoriesLoading || isAccountsLoading || isTransactionsLoading;

  const exampleQuestions = [
    "What is my total income?",
    "What are my categories?",
    "List my accounts.",
    "Show transactions for groceries.",
    "What's the total spent on travel?",
    "How many transactions in groceries?",
    "What's my largest transaction?",
    "Show all transactions in [category name]."
  ];

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window)) {
      const recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          handleUserQuery(finalTranscript.trim());
        }
      };
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognitionRef.current = recognition;
    }
  }, []);

  const processQuery = useCallback((query: string) => {
    let response = "I'm sorry, I don't understand. Can you please rephrase?";
    const q = query.toLowerCase();

    // Helper to format transaction list
    const formatTxList = (txs: any[]) =>
      txs.map(t => `• ${t.payee} (${formatCurrency(t.amount)}, ${new Date(t.date).toLocaleDateString()})`).join('\n');

    // Navigation
    if (q.includes('take me to')) {
      if (q.includes('categories')) {
        router.push('/accounts');
        setTimeout(() => triggerTabChange('categories'), 100); // Give time for page to load
        response = "Taking you to Categories.";
      } else if (q.includes('accounts')) {
        router.push('/accounts');
        setTimeout(() => triggerTabChange('accounts'), 100);
        response = "Taking you to Accounts.";
      } else if (q.includes('settings')) {
        router.push('/settings');
        response = "Taking you to Settings.";
      } else if (q.includes('notification')) {
        router.push('/notifications');
        response = "Taking you to Notifications.";
      } else if (q.includes('overview')) {
        router.push('/analytics');
        setTimeout(() => triggerTabChange('overview'), 100);
        response = "Taking you to Overview.";
      }
    }
    // Categories (flexible match)
    else if ((q.match(/(what|show|list)( are)?( my| the)? categories?/) || q.match(/categories/))) {
      setLastCategoryContext(null);
      if (categories.length === 0) response = "You have no categories.";
      else response = `Your categories are: ${categories.map(c => c.name).join(', ')}.`;
    }
    // Accounts (flexible match)
    else if ((q.match(/(what|show|list)( are)?( my| the)? accounts?/) || q.match(/accounts/))) {
      setLastCategoryContext(null);
      if (accounts.length === 0) response = "You have no accounts.";
      else response = `Your accounts are: ${accounts.map(a => a.name).join(', ')}.`;
    }
    // Transactions for a category (and remember context)
    else if (q.match(/transactions? (in|for|of) (.+)/) || q.match(/how many transactions (in|for|of) (.+)/)) {
      const match = q.match(/transactions? (in|for|of) (.+)/) || q.match(/how many transactions (in|for|of) (.+)/);
      const catName = match?.[2]?.trim();
      const cat = categories.find(c => c.name.toLowerCase() === catName);
      if (!cat) {
        setLastCategoryContext(null);
        response = `I couldn't find a category named ${catName}.`;
      } else {
        setLastCategoryContext(cat.id);
        const txs = transactions.filter(t => t.categoryId === cat.id);
        if (txs.length === 0) response = `No transactions found for ${cat.name}.`;
        else response = `You have ${txs.length} transactions in ${cat.name}.$
${formatTxList(txs)}`;
      }
    }
    // List transactions for last category context
    else if ((q.includes('what are they') || q.includes('show them') || q.includes('list them')) && lastCategoryContext) {
      const cat = categories.find(c => c.id === lastCategoryContext);
      if (!cat) {
        response = "Sorry, I lost track of the category.";
      } else {
        const txs = transactions.filter(t => t.categoryId === cat.id);
        if (txs.length === 0) response = `No transactions found for ${cat.name}.`;
        else response = `Here are your transactions in ${cat.name}:\n${formatTxList(txs)}`;
      }
    }
    // Total for a category
    else if (q.match(/total (spent|for|in|on) (.+)/)) {
      const match = q.match(/total (spent|for|in|on) (.+)/);
      const catName = match?.[2]?.trim();
      const cat = categories.find(c => c.name.toLowerCase() === catName);
      setLastCategoryContext(cat ? cat.id : null);
      if (!cat) response = `I couldn't find a category named ${catName}.`;
      else {
        const txs = transactions.filter(t => t.categoryId === cat.id);
        const total = txs.reduce((sum, t) => sum + (t.amount || 0), 0);
        response = `Total for ${cat.name} is ${formatCurrency(total)}.`;
      }
    }
    // Largest transaction
    else if (q.includes('largest transaction')) {
      setLastCategoryContext(null);
      if (transactions.length === 0) response = "No transactions found.";
      else {
        const largest = transactions.reduce((a, b) => (a.amount > b.amount ? a : b));
        response = `Your largest transaction is ${formatCurrency(largest.amount)} for ${largest.payee}.`;
      }
    }
    // Smallest transaction
    else if (q.includes('smallest transaction')) {
      setLastCategoryContext(null);
      if (transactions.length === 0) response = "No transactions found.";
      else {
        const smallest = transactions.reduce((a, b) => (a.amount < b.amount ? a : b));
        response = `Your smallest transaction is ${formatCurrency(smallest.amount)} for ${smallest.payee}.`;
      }
    }
    // Transactions for an account
    else if (q.match(/transactions? (in|for|of) account (.+)/)) {
      setLastCategoryContext(null);
      const match = q.match(/transactions? (in|for|of) account (.+)/);
      const accName = match?.[2]?.trim();
      const acc = accounts.find(a => a.name.toLowerCase() === accName);
      if (!acc) response = `I couldn't find an account named ${accName}.`;
      else {
        const txs = transactions.filter(t => t.accountId === acc.id);
        if (txs.length === 0) response = `No transactions found for account ${acc.name}.`;
        else response = `You have ${txs.length} transactions in account ${acc.name}.`;
      }
    }
    // Default: summary
    else if (summaryData) {
      setLastCategoryContext(null);
      if (q.includes('income')) {
        response = `Your total income is ${formatCurrency(summaryData.incomeAmount)}.`;
      } else if (q.includes('expenses')) {
        response = `Your total expenses are ${formatCurrency(summaryData.expensesAmount)}.`;
      } else if (q.includes('balance') || q.includes('remaining')) {
        response = `Your remaining balance is ${formatCurrency(summaryData.remainingAmount)}.`;
      }
    }
    speak(response);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
  }, [summaryData, categories, accounts, transactions, lastCategoryContext, router]);

  useEffect(() => {
    if (!isLoading && pendingQuery) {
      processQuery(pendingQuery);
      setPendingQuery(null);
    }
  }, [isLoading, pendingQuery, processQuery]);

  const handleMicDown = () => {
    recognitionRef.current?.start();
  };
  const handleMicUp = () => {
    recognitionRef.current?.stop();
  };

  const handleUserQuery = (query: string) => {
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    if (isLoading) {
      setPendingQuery(query);
      return;
    }
    processQuery(query);
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setDragging(true);
    let clientX = 0, clientY = 0;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    dragOffset.current = {
      x: clientX - position.left,
      y: clientY - position.top,
    };
    document.body.style.userSelect = 'none';
  };

  const handleDrag = (e: MouseEvent | TouchEvent) => {
    if (!dragging) return;
    let clientX = 0, clientY = 0;
    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    setPosition({
      left: Math.max(0, Math.min(window.innerWidth - 384, clientX - dragOffset.current.x)),
      top: Math.max(0, Math.min(window.innerHeight - 400, clientY - dragOffset.current.y)),
    });
  };

  const handleDragEnd = () => {
    setDragging(false);
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent | TouchEvent) => handleDrag(e);
    const up = () => handleDragEnd();
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move);
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchend', up);
    };
  }, [dragging]);

  const handleInputSend = (e?: React.FormEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    const value = input.trim();
    if (!value) return;
    setInput('');
    handleUserQuery(value);
  };

  // Helper: trigger tab change in accounts page
  const triggerTabChange = (tab: string) => {
    // Dispatch a custom event that the accounts page listens for
    window.dispatchEvent(new CustomEvent('finzo-tab-change', { detail: { tab } }));
  };

  // Stop speech helper
  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  useEffect(() => {
    if (!isOpen) stopSpeaking();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed z-50"
        style={{ top: position.top, left: position.left, width: 384 }}
      >
        <div className="bg-gradient-to-br from-purple-700 via-pink-600 to-orange-400 bg-opacity-90 rounded-2xl shadow-2xl w-96 border border-white/20 text-white">
          <div
            className="p-4 flex justify-between items-center bg-white/10 rounded-t-2xl cursor-move select-none"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <h3 className="font-semibold text-lg flex items-center"><Bot className="mr-2"/> Finzo Finance</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={stopSpeaking} className="text-white hover:bg-white/20 cursor-pointer select-auto" aria-label="Stop talking">
                <VolumeX className="size-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20 cursor-pointer select-auto" aria-label="Close assistant">
                <X className="size-4" />
              </Button>
            </div>
          </div>
          <div className="p-4 h-64 overflow-y-auto space-y-4" style={{ maxHeight: 320 }}>
            <div className="mb-4">
              <div className="font-semibold text-white/90 mb-2">Try asking me:</div>
              <ul className="list-disc list-inside space-y-1 text-white/80 text-sm">
                {exampleQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && <Bot className="flex-shrink-0 text-orange-200" />}
                <div className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-white/20 text-white' : 'bg-white/10 text-orange-100'}`}>
                  {msg.content}
                </div>
                {msg.role === 'user' && <User className="flex-shrink-0 text-purple-200" />}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin text-white w-8 h-8" />
              </div>
            )}
          </div>
          <div className="p-4 border-t border-white/10 flex flex-col gap-2 bg-white/5 rounded-b-2xl">
            <div className="flex justify-center items-center mb-2">
              <Button
                onMouseDown={handleMicDown}
                onMouseUp={handleMicUp}
                onMouseLeave={handleMicUp}
                onTouchStart={handleMicDown}
                onTouchEnd={handleMicUp}
                size="lg"
                className={`rounded-full w-20 h-20 transition-all duration-300 ${isListening ? 'bg-orange-500 hover:bg-orange-600' : 'bg-purple-600 hover:bg-pink-600'} text-white shadow-lg flex items-center justify-center`}
                aria-label="Hold to speak"
              >
                <Mic className="size-8" />
                {isListening && (
                  <span className="ml-2 animate-pulse text-xs">Listening…</span>
                )}
              </Button>
            </div>
            <form onSubmit={handleInputSend} className="flex items-center gap-2 w-full">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    handleInputSend(e);
                  }
                }}
                className="flex-1 rounded-lg px-4 py-2 bg-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Type your question..."
                autoComplete="off"
              />
              <Button type="submit" size="icon" className="bg-purple-600 hover:bg-pink-600 text-white">
                <Send className="size-5" />
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VoiceAssistant; 