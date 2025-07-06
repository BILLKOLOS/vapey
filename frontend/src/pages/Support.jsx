import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Phone, Mail, Clock, Send, FileText, HelpCircle, AlertCircle } from 'lucide-react';

const Support = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  const faqData = [
    {
      question: "How does the 2% daily ROI work?",
      answer: "Our platform generates consistent returns through advanced trading algorithms. The 2% daily ROI is calculated on your active investment amount and is paid out daily for the duration of your 200-day contract."
    },
    {
      question: "What is the minimum investment amount?",
      answer: "The minimum investment amount is $20, and the maximum is $10,000 per contract. You can have multiple active contracts simultaneously."
    },
    {
      question: "How do withdrawals work?",
      answer: "You can withdraw a minimum of $10 twice daily. Withdrawals are processed via Binance USDT TRC20 and typically complete within 24 hours."
    },
    {
      question: "How does the referral system work?",
      answer: "Earn 7% commission on Level 1 referrals, 3% on Level 2, and 1% on Level 3. Your referral earnings are credited immediately when your referrals make investments."
    },
    {
      question: "Is my investment secure?",
      answer: "Yes, we use bank-grade security measures including SSL encryption, two-factor authentication, and secure payment processing to protect your investments."
    },
    {
      question: "What happens if I want to withdraw early?",
      answer: "Early withdrawals are subject to a 10% fee. We recommend completing your full 200-day contract to maximize your returns."
    }
  ];

  const supportChannels = [
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Live Chat",
      description: "Get instant help from our support team",
      status: "Online",
      responseTime: "2-5 minutes",
      color: "text-green-400"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      description: "Send us a detailed message",
      status: "24/7",
      responseTime: "2-4 hours",
      color: "text-blue-400"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      description: "Speak directly with our team",
      status: "Business Hours",
      responseTime: "Immediate",
      color: "text-purple-400"
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Implement chat functionality
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleSubmitTicket = () => {
    if (ticketSubject.trim() && ticketMessage.trim()) {
      // TODO: Implement ticket submission
      console.log('Submitting ticket:', { subject: ticketSubject, message: ticketMessage });
      setTicketSubject('');
      setTicketMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-4">Support Center</h1>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Need help? Our support team is here to assist you 24/7. Choose your preferred method of contact or browse our FAQ section.
              </p>
            </div>
          </div>

          {/* Support Channels */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {supportChannels.map((channel, index) => (
              <motion.div
                key={channel.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center hover:bg-white/15 transition-colors cursor-pointer"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white/10 rounded-full">
                    {channel.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{channel.title}</h3>
                <p className="text-gray-300 text-sm mb-4">{channel.description}</p>
                <div className="space-y-2">
                  <p className={`text-sm ${channel.color}`}>{channel.status}</p>
                  <p className="text-xs text-gray-400">Response: {channel.responseTime}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'chat'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                Live Chat
              </button>
              <button
                onClick={() => setActiveTab('ticket')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'ticket'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                Submit Ticket
              </button>
              <button
                onClick={() => setActiveTab('faq')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'faq'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                FAQ
              </button>
            </div>

            {/* Chat Tab */}
            {activeTab === 'chat' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="bg-white/5 rounded-lg p-4 h-64 overflow-y-auto">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">S</span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-blue-500/20 rounded-lg p-3">
                          <p className="text-white text-sm">Hello! Welcome to VapeY Investment Support. How can I help you today?</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Support Team • Just now</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Ticket Tab */}
            {activeTab === 'ticket' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Brief description of your issue..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Please provide detailed information about your issue..."
                    rows={6}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <button
                  onClick={handleSubmitTicket}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Submit Ticket
                </button>
              </motion.div>
            )}

            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {faqData.map((faq, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-2 flex items-center">
                      <HelpCircle className="w-4 h-4 mr-2 text-blue-400" />
                      {faq.question}
                    </h3>
                    <p className="text-gray-300 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold text-white mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-gray-300">support@vapeyinvestment.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white font-medium">Phone</p>
                    <p className="text-gray-300">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-white font-medium">Business Hours</p>
                    <p className="text-gray-300">24/7 Support Available</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-white font-medium">Emergency</p>
                    <p className="text-gray-300">Critical issues: +1 (555) 999-8888</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Support; 