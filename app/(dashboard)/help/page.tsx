"use client";

import { useState, useContext } from "react";
import { 
  Search, 
  MessageCircle, 
  Mail, 
  Phone, 
  ChevronDown, 
  ChevronUp,
  BookOpen
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EmailForm } from "@/components/email-form";
import FinzoChatContext from "@/components/finzo-chat-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ChatBotGemini from '@/components/ChatBotGemini';

const faqs = [
  {
    question: "How do I add a new account?",
    answer: "To add a new account, go to the Accounts page and click the 'Add new' button. Fill in the account details and click 'Create account'."
  },
  {
    question: "How do I categorize transactions?",
    answer: "Transactions can be categorized by selecting a category when creating or editing a transaction. You can also set up automatic categorization rules in the Settings page."
  },
  {
    question: "Can I export my data?",
    answer: "Yes, you can export your data in CSV or PDF format. Go to the Settings page and look for the 'Export Data' option."
  },
  {
    question: "How secure is my financial data?",
    answer: "We use Clerk Authentication to ensure that all of our users are protected!"
  },
  {
    question: "How do I edit my transactions if I made a mistake?",
    answer: "Just click on the 3 dots towards the very right, and easily edit your information!"
  },
  {
    question: "How can I access specfic information about a specific users!",
    answer: "Go to your Overview page, or your Transaction page. Click on the drop down next to the calender, and choose a specific user!"
  }
];

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const finzoContext = useContext(FinzoChatContext);

  // Filtered FAQs
  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for help..."
            className="pl-10 h-12"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Contact Options */}
        <div className="grid gap-4 md:grid-cols-3 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Email Support</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Send us an email and we'll get back to you
              </p>
              <Button variant="outline" className="w-full" onClick={() => setIsEmailOpen(true)}>Send Email</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Phone Support</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Call us directly for immediate assistance
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = 'tel:+6023489225'}
              >
                Call Now
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Live Chat Support</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Chat with our AI assistant for instant help and answers to any question!
              </p>
              <Button className="w-full" onClick={() => setIsChatOpen(true)}>Start Chat</Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQs */}
        <div>
          <h3 className="text-xl font-semibold mb-4 mt-4">Frequently Asked Questions</h3>
          <Accordion type="single" collapsible className="w-full">
            {filteredFaqs.length === 0 ? (
              <div className="text-muted-foreground p-4">No FAQs found for "{searchQuery}".</div>
            ) : (
              filteredFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
              ))
            )}
          </Accordion>
        </div>
      </div>

      {/* TODO: Integrate the Finzo chatbot from the overview section here when available */}
      
      {/* Email Form */}
      <EmailForm isOpen={isEmailOpen} onClose={() => setIsEmailOpen(false)} />

      {/* Chat Bot */}
      <ChatBotGemini isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default HelpPage; 