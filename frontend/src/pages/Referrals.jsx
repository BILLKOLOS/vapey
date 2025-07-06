import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Share2, Copy, ExternalLink, TrendingUp, Gift, Star } from 'lucide-react';

const Referrals = () => {
  const [copied, setCopied] = useState(false);

  const referralData = {
    totalReferrals: 24,
    activeReferrals: 18,
    totalEarnings: 890,
    thisMonthEarnings: 156,
    referralCode: 'JOHN2024',
    referralLink: 'https://vapeyinvestment.com/ref/JOHN2024'
  };

  const referralLevels = [
    {
      level: 1,
      percentage: 7,
      description: 'Direct referrals',
      earnings: 623,
      count: 12
    },
    {
      level: 2,
      percentage: 3,
      description: 'Second level',
      earnings: 189,
      count: 8
    },
    {
      level: 3,
      percentage: 1,
      description: 'Third level',
      earnings: 78,
      count: 4
    }
  ];

  const recentReferrals = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      date: '2024-01-15',
      status: 'active',
      earnings: 35,
      level: 1
    },
    {
      id: 2,
      name: 'Mike Chen',
      email: 'mike.chen@example.com',
      date: '2024-01-14',
      status: 'pending',
      earnings: 0,
      level: 1
    },
    {
      id: 3,
      name: 'Emma Davis',
      email: 'emma.davis@example.com',
      date: '2024-01-13',
      status: 'active',
      earnings: 28,
      level: 2
    },
    {
      id: 4,
      name: 'Alex Rodriguez',
      email: 'alex.r@example.com',
      date: '2024-01-12',
      status: 'active',
      earnings: 42,
      level: 1
    }
  ];

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralData.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join VapeY Investment and earn together!',
        text: 'Use my referral link to get started with VapeY Investment trading platform',
        url: referralData.referralLink
      });
    } else {
      copyReferralLink();
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-white">Referral Program</h1>
                <p className="text-gray-300 mt-2">Earn up to 7% commission on your referrals' investments</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={shareReferralLink}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button
                  onClick={copyReferralLink}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Referrals</p>
                  <p className="text-2xl font-bold text-white">{referralData.totalReferrals}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Active Referrals</p>
                  <p className="text-2xl font-bold text-white">{referralData.activeReferrals}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Total Earnings</p>
                  <p className="text-2xl font-bold text-green-400">${referralData.totalEarnings}</p>
                </div>
                <Gift className="w-8 h-8 text-yellow-400" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">This Month</p>
                  <p className="text-2xl font-bold text-blue-400">${referralData.thisMonthEarnings}</p>
                </div>
                <Star className="w-8 h-8 text-purple-400" />
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Referral Link Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Your Referral Link</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Referral Code
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={referralData.referralCode}
                        readOnly
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-mono"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(referralData.referralCode)}
                        className="bg-blue-500 hover:bg-blue-600 p-3 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Referral Link
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={referralData.referralLink}
                        readOnly
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm"
                      />
                      <button
                        onClick={() => window.open(referralData.referralLink, '_blank')}
                        className="bg-green-500 hover:bg-green-600 p-3 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-400 mb-2">How it works</h3>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Share your referral link with friends</li>
                    <li>• They sign up and make their first investment</li>
                    <li>• You earn 7% commission on their investments</li>
                    <li>• Additional earnings from 2nd and 3rd level referrals</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Referral Levels */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Referral Levels</h2>
                
                <div className="space-y-4">
                  {referralLevels.map((level, index) => (
                    <div key={level.level} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">{level.level}</span>
                        </div>
                        <div>
                          <h3 className="text-white font-medium">
                            Level {level.level} - {level.percentage}% Commission
                          </h3>
                          <p className="text-sm text-gray-300">{level.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-semibold">${level.earnings}</p>
                        <p className="text-sm text-gray-300">{level.count} referrals</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Referrals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Recent Referrals</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Level
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Earnings
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentReferrals.map((referral) => (
                      <tr key={referral.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-4">
                          <div className="text-white font-medium">{referral.name}</div>
                        </td>
                        <td className="px-4 py-4 text-gray-300">{referral.email}</td>
                        <td className="px-4 py-4 text-gray-300">
                          {new Date(referral.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                            Level {referral.level}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            referral.status === 'active'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-green-400 font-semibold">
                          ${referral.earnings}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Referrals; 