'use client';

import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import { 
  MoonIcon, 
  SunIcon, 
  ChartBarIcon, 
  ClockIcon, 
  ShieldCheckIcon, 
  CreditCardIcon, 
  ChartPieIcon, 
  ArrowTrendingUpIcon, 
  UserCircleIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ShareIcon,
  ChatBubbleLeftRightIcon,
  PhotoIcon,
  LinkIcon,
  CalculatorIcon
} from "@heroicons/react/24/outline";
import { useTypewriter } from '../hooks/useTypewriter';
import ChatBot from '@/components/ChatBot';

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);
  const containerRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const pricingRef = useRef(null);
  const faqRef = useRef(null);
  const resourcesRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const { scrollY } = useScroll();
  
  const typedText = useTypewriter({
    words: [
      'Master Your Money',
      'Shape Your Future',
      'Control Your Finances',
      'Build Your Wealth'
    ],
    typingSpeed: 80,
    deletingSpeed: 40,
    delayBetweenWords: 2000,
  });

  const opacity = useTransform(
    scrollY,
    [0, 400],
    [1, 0]
  );

  const scale = useTransform(
    scrollY,
    [0, 400],
    [1, 0.8]
  );

  const navItems = [
    { name: 'Stats', ref: statsRef },
    { name: 'Features', ref: featuresRef },
    { name: 'Pricing', ref: pricingRef },
    { name: 'Resources', ref: resourcesRef },
    { name: 'FAQ', ref: faqRef },
    { name: 'Testimonials', ref: testimonialsRef },
    { name: 'Get Started', ref: contactRef },
  ];

  const features = [
    {
      title: "Smart Analytics",
      description: "Get detailed insights into your spending patterns and financial health with AI-powered analytics.",
      icon: ChartBarIcon,
      stats: "85% of users improve savings within 3 months",
      details: [
        "Real-time spending analysis",
        "Customizable financial reports",
        "Predictive budgeting tools",
        "Investment portfolio tracking"
      ]
    },
    {
      title: "Automated Tracking",
      description: "Effortlessly track expenses and income with intelligent categorization and smart notifications.",
      icon: ClockIcon,
      stats: "Save 5+ hours monthly on financial management",
      details: [
        "Automatic expense categorization",
        "Bill payment reminders",
        "Receipt scanning & storage",
        "Multi-currency support"
      ]
    },
    {
      title: "Secure Platform",
      description: "Bank-level security ensures your financial data stays protected with advanced encryption.",
      icon: ShieldCheckIcon,
      stats: "256-bit encryption for all transactions",
      details: [
        "Two-factor authentication",
        "End-to-end encryption",
        "Regular security audits",
        "Secure data backup"
      ]
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      content: "This platform transformed how I manage my business finances. The insights are invaluable.",
      rating: 5,
      company: "Johnson & Co. LLC"
    },
    {
      name: "Michael Chen",
      role: "Personal Investor",
      content: "The investment tracking features helped me optimize my portfolio performance significantly.",
      rating: 5,
      company: "Tech Investments"
    },
    {
      name: "Emily Rodriguez",
      role: "Freelancer",
      content: "Perfect for managing multiple income streams. It's like having a financial advisor in my pocket.",
      rating: 5,
      company: "Digital Solutions"
    }
  ];

  return (
    <div ref={containerRef} className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#1a1a1a] text-white' : 'bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 text-[#2E2A47]'}`}>
      {/* Navigation Bar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full py-6 px-8 flex justify-between items-center fixed top-0 z-50 backdrop-blur-lg ${
          isDarkMode ? 'bg-[#1a1a1a]/80' : 'bg-gradient-to-r from-purple-50/90 to-pink-50/90'
        }`}
      >
        <div className="flex items-center">
          <Image 
            src={isDarkMode ? "/logo.svg" : "/next.svg"} 
            height={32} 
            width={32} 
            alt="Logo" 
          />
          <span className="ml-3 text-xl font-medium">FinanceFlow</span>
        </div>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.ref)}
              className={`text-sm font-medium hover:text-purple-600 transition-colors ${
                isDarkMode ? 'text-gray-300 hover:text-purple-400' : 'text-gray-600'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-6">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full transition-colors ${
              isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'
            }`}
          >
            {isDarkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>
          <SignInButton mode="modal">
            <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2.5 rounded-full hover:from-purple-700 hover:to-pink-600 transition-all text-sm font-medium shadow-lg">
              Sign In
            </button>
          </SignInButton>
        </div>
      </motion.nav>

      {/* Hero Section with Parallax */}
      <motion.div 
        style={{ opacity, scale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-purple-900/20' : 'bg-gradient-to-br from-purple-100/50 via-pink-100/30 to-orange-100/20'}`} />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className={`w-[800px] h-[800px] rounded-full ${
              isDarkMode ? 'bg-purple-600/10' : 'bg-gradient-to-br from-purple-200/50 via-pink-200/30 to-orange-200/20'
            }`} />
          </motion.div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-600/10 to-pink-500/10 text-purple-600 text-sm font-medium"
              >
                <span className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full mr-2 animate-pulse"></span>
                New: AI-Powered Financial Insights
              </motion.div>
              
              <div className="space-y-4">
                <motion.h1 
                  className={`text-5xl md:text-6xl font-bold tracking-tight leading-tight ${
                    isDarkMode ? 'text-white' : 'text-[#2E2A47]'
                  }`}
                >
                  <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">{typedText}</span>
                  <span className="inline-block w-1 h-12 ml-1 bg-gradient-to-r from-purple-600 to-pink-500 animate-blink"></span>
                </motion.h1>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`text-xl max-w-xl ${
                    isDarkMode ? 'text-gray-300' : 'text-[#7E8CA0]'
                  }`}
                >
                  Take control of your financial journey with powerful insights
                  and intelligent management tools. Experience the future of personal finance.
                </motion.p>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <SignInButton mode="modal">
                  <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full hover:from-purple-700 hover:to-pink-600 transition-all text-lg font-medium flex items-center shadow-lg">
                    Start Free Trial
                    <ArrowTrendingUpIcon className="ml-2 h-5 w-5" />
                  </button>
                </SignInButton>
                <button className={`px-8 py-4 rounded-full border-2 ${
                  isDarkMode 
                    ? 'border-purple-400 text-purple-400 hover:bg-purple-400/10' 
                    : 'border-purple-600 text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50'
                } transition-colors text-lg font-medium flex items-center`}>
                  Watch Demo
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </motion.div>

              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className={`p-4 rounded-xl ${
                  isDarkMode ? 'bg-[#2a2a2a]' : 'bg-gradient-to-br from-purple-50 to-pink-50'
                } shadow-lg`}>
                  <div className="flex items-center mb-2">
                    <ShieldCheckIcon className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="font-medium">Bank-Level Security</span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    256-bit encryption & 2FA
                  </p>
                </div>
                <div className={`p-4 rounded-xl ${
                  isDarkMode ? 'bg-[#2a2a2a]' : 'bg-gradient-to-br from-purple-50 to-pink-50'
                } shadow-lg`}>
                  <div className="flex items-center mb-2">
                    <ChartBarIcon className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="font-medium">Smart Analytics</span>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    AI-powered insights
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Screenshot */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className={`absolute inset-0 rounded-3xl ${
                isDarkMode ? 'bg-purple-600/20' : 'bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100'
              } blur-3xl`} />
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/dashboard-screenshot.png"
                  alt="FinanceFlow Dashboard"
                  width={3840}
                  height={2160}
                  quality={100}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className={`absolute -bottom-6 -right-6 p-4 rounded-xl ${
                  isDarkMode ? 'bg-[#2a2a2a]' : 'bg-gradient-to-br from-purple-50 to-pink-50'
                } shadow-lg`}
              >
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse" />
                  <span className="font-medium">2M+ Active Users</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Statistics Section */}
      <section ref={statsRef} className={`py-20 ${isDarkMode ? 'bg-[#222222]' : 'bg-gradient-to-br from-slate-50 via-purple-50/20 to-pink-50/20'}`}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#2E2A47]'}`}>
              Trusted by Millions
            </h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-[#7E8CA0]'}`}>
              Join our growing community of successful financial managers
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { 
                number: "2M+", 
                label: "Active Users",
                description: "Growing community of financial managers"
              },
              { 
                number: "$50B+", 
                label: "Transactions Tracked",
                description: "Secure and reliable transaction processing"
              },
              { 
                number: "98%", 
                label: "User Satisfaction",
                description: "Consistently high user ratings"
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`text-center p-8 rounded-2xl ${
                  isDarkMode ? 'bg-[#2a2a2a]' : 'bg-gradient-to-br from-purple-50/80 to-pink-50/80'
                } shadow-lg`}
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-[#2E2A47]'}`}>
                  {stat.label}
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#2E2A47]'}`}>
              Why Choose FinanceFlow?
            </h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-[#7E8CA0]'}`}>
              Powerful features to transform your financial management
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className={`p-8 rounded-2xl ${
                  isDarkMode 
                    ? 'bg-[#2a2a2a] hover:bg-[#333333]' 
                    : 'bg-gradient-to-br from-purple-50/80 to-pink-50/80 hover:from-purple-100/80 hover:to-pink-100/80'
                } transition-colors`}
              >
                <feature.icon className="h-12 w-12 text-purple-600 mb-6" />
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-[#7E8CA0]'}`}>
                  {feature.description}
                </p>
                <p className="text-purple-600 font-medium mb-6">{feature.stats}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} className={`py-20 ${isDarkMode ? 'bg-[#222222]' : 'bg-gradient-to-br from-slate-50 via-purple-50/20 to-pink-50/20'}`}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#2E2A47]'}`}>
              What Our Users Say
            </h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-[#7E8CA0]'}`}>
              Join thousands of satisfied users who have transformed their financial management
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`p-8 rounded-2xl ${
                  isDarkMode ? 'bg-[#2a2a2a]' : 'bg-gradient-to-br from-purple-50/80 to-pink-50/80'
                } shadow-lg`}
              >
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 rounded-full bg-purple-600/10 flex items-center justify-center">
                    <UserCircleIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {testimonial.role}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {testimonial.company}
                    </p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  &ldquo;{testimonial.content}&rdquo;
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#2E2A47]'}`}>
              Simple, Transparent Pricing
            </h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-[#7E8CA0]'}`}>
              Choose the plan that best fits your financial needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Starter",
                price: "$9",
                features: [
                  "Basic financial tracking",
                  "Monthly reports",
                  "Email support",
                  "Up to 2 accounts",
                  "Basic analytics"
                ],
                popular: false
              },
              {
                name: "Professional",
                price: "$29",
                features: [
                  "Advanced financial tracking",
                  "Weekly reports",
                  "Priority support",
                  "Unlimited accounts",
                  "Advanced analytics",
                  "Investment tracking",
                  "Custom categories"
                ],
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                features: [
                  "Everything in Professional",
                  "Dedicated account manager",
                  "Custom integrations",
                  "API access",
                  "Team collaboration",
                  "Advanced security",
                  "SLA guarantee"
                ],
                popular: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`p-8 rounded-2xl ${
                  plan.popular
                    ? 'bg-gradient-to-br from-purple-600 to-pink-500 text-white'
                    : isDarkMode
                    ? 'bg-[#2a2a2a]'
                    : 'bg-gradient-to-br from-purple-50/80 to-pink-50/80'
                } shadow-lg relative`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-lg">/month</span>}
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-full font-medium transition-colors ${
                  plan.popular
                    ? 'bg-white text-purple-600 hover:bg-gray-100'
                    : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600'
                }`}>
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section ref={resourcesRef} className={`py-20 ${isDarkMode ? 'bg-[#222222]' : 'bg-gradient-to-br from-slate-50 via-purple-50/20 to-pink-50/20'}`}>
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#2E2A47]'}`}>
              Financial Resources
            </h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-[#7E8CA0]'}`}>
              Access our comprehensive library of financial guides and tools
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Financial Guides",
                description: "Learn the fundamentals of personal finance and investment strategies",
                icon: ChartBarIcon,
                items: [
                  "Budgeting Basics",
                  "Investment Strategies",
                  "Debt Management",
                  "Retirement Planning"
                ]
              },
              {
                title: "Tools & Calculators",
                description: "Use our interactive tools to plan and optimize your finances",
                icon: CalculatorIcon,
                items: [
                  "Loan Calculator",
                  "Investment Calculator",
                  "Retirement Planner",
                  "Tax Estimator"
                ]
              },
              {
                title: "Market Insights",
                description: "Stay informed with the latest market trends and analysis",
                icon: ChartPieIcon,
                items: [
                  "Market Reports",
                  "Economic Updates",
                  "Investment Trends",
                  "Industry Analysis"
                ]
              }
            ].map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`p-8 rounded-2xl ${
                  isDarkMode ? 'bg-[#2a2a2a]' : 'bg-gradient-to-br from-purple-50/80 to-pink-50/80'
                } shadow-lg`}
              >
                <resource.icon className="h-12 w-12 text-purple-600 mb-6" />
                <h3 className="text-xl font-semibold mb-4">{resource.title}</h3>
                <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {resource.description}
                </p>
                <ul className="space-y-3">
                  {resource.items.map((item, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section ref={faqRef} className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#2E2A47]'}`}>
              Frequently Asked Questions
            </h2>
            <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-[#7E8CA0]'}`}>
              Find answers to common questions about FinanceFlow
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "How secure is my financial data?",
                answer: "We use bank-level encryption and security measures to protect your data. All information is encrypted in transit and at rest, and we never store sensitive banking credentials."
              },
              {
                question: "Can I connect my bank accounts?",
                answer: "Yes, we support connections to thousands of banks and financial institutions through secure APIs. The process is quick and easy, and you can disconnect at any time."
              },
              {
                question: "What kind of support do you offer?",
                answer: "We provide 24/7 customer support through email, chat, and phone. Premium users get priority support and a dedicated account manager."
              },
              {
                question: "Is there a free trial?",
                answer: "Yes, we offer a 14-day free trial of our Professional plan. You can upgrade, downgrade, or cancel at any time."
              },
              {
                question: "How do you handle data privacy?",
                answer: "We take your privacy seriously. We never sell your data, and you have complete control over what information you share. All data is stored in secure, encrypted databases."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`p-6 rounded-xl ${
                  isDarkMode ? 'bg-[#2a2a2a]' : 'bg-gradient-to-br from-purple-50/80 to-pink-50/80'
                } shadow-lg`}
              >
                <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-[#2E2A47]'}`}>
                  {faq.question}
                </h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section ref={contactRef} className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`text-center p-12 rounded-3xl ${
              isDarkMode ? 'bg-[#2a2a2a]' : 'bg-gradient-to-br from-purple-50/80 via-pink-50/60 to-orange-50/40'
            }`}
          >
            <h2 className={`text-4xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-[#2E2A47]'}`}>
              Ready to Transform Your Finances?
            </h2>
            <p className={`text-xl mb-8 max-w-2xl mx-auto ${
              isDarkMode ? 'text-gray-300' : 'text-[#7E8CA0]'
            }`}>
              Join thousands of users who have already taken control of their financial future.
              Start your journey today with a 14-day free trial.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <SignInButton mode="modal">
                <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-4 rounded-full hover:from-purple-700 hover:to-pink-600 transition-all text-lg font-medium">
                  Get Started Now
                </button>
              </SignInButton>
              <button className={`px-8 py-4 rounded-full border-2 ${
                isDarkMode 
                  ? 'border-purple-400 text-purple-400 hover:bg-purple-400/10' 
                  : 'border-purple-600 text-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50'
              } transition-colors text-lg font-medium`}>
                Schedule Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-16 ${isDarkMode ? 'bg-[#1a1a1a] border-t border-gray-800' : 'bg-gradient-to-br from-slate-50 via-purple-50/20 to-pink-50/20 border-t border-gray-200'}`}>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Image 
                  src={isDarkMode ? "/logo.svg" : "/next.svg"} 
                  height={32} 
                  width={32} 
                  alt="Logo" 
                />
                <span className="ml-3 text-xl font-medium">FinanceFlow</span>
              </div>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Empowering individuals and businesses to take control of their financial future with innovative solutions.
              </p>
              <div className="flex space-x-4">
                <a href="#" className={`p-2 rounded-full transition-colors ${
                  isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'
                }`}>
                  <ShareIcon className="h-5 w-5" />
                </a>
                <a href="#" className={`p-2 rounded-full transition-colors ${
                  isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'
                }`}>
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                </a>
                <a href="#" className={`p-2 rounded-full transition-colors ${
                  isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'
                }`}>
                  <PhotoIcon className="h-5 w-5" />
                </a>
                <a href="#" className={`p-2 rounded-full transition-colors ${
                  isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/10'
                }`}>
                  <LinkIcon className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-[#2E2A47]'}`}>
                Quick Links
              </h3>
              <ul className="space-y-3">
                {['About Us', 'Features', 'Pricing', 'Blog', 'Careers', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href="#" className={`hover:text-purple-600 transition-colors ${
                      isDarkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600'
                    }`}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-[#2E2A47]'}`}>
                Support
              </h3>
              <ul className="space-y-3">
                {['Help Center', 'Documentation', 'API Reference', 'Status', 'Terms of Service', 'Privacy Policy'].map((link) => (
                  <li key={link}>
                    <a href="#" className={`hover:text-purple-600 transition-colors ${
                      isDarkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600'
                    }`}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className={`text-lg font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-[#2E2A47]'}`}>
                Contact Us
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-purple-600 mt-1" />
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    support@financeflow.com
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <PhoneIcon className="h-5 w-5 text-purple-600 mt-1" />
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    +1 (555) 123-4567
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <MapPinIcon className="h-5 w-5 text-purple-600 mt-1" />
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    123 Finance Street<br />
                    New York, NY 10001
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`pt-8 border-t ${
            isDarkMode ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                © {new Date().getFullYear()} FinanceFlow. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <a href="#" className={`text-sm hover:text-purple-600 transition-colors ${
                  isDarkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600'
                }`}>
                  Terms of Service
                </a>
                <a href="#" className={`text-sm hover:text-purple-600 transition-colors ${
                  isDarkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600'
                }`}>
                  Privacy Policy
                </a>
                <a href="#" className={`text-sm hover:text-purple-600 transition-colors ${
                  isDarkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600'
                }`}>
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <ChatBot isOpen={isChatBotOpen} onClose={() => setIsChatBotOpen(false)} />
    </div>
  );
} 