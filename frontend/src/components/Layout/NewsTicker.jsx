import React, { useState, useEffect } from 'react';

const NewsTicker = () => {
  const [currentNews, setCurrentNews] = useState(0);
  
  const newsItems = [
    "🔥 Bitcoin up 5.2% today • USDT maintains $1.00 stability • New milestone: 50,000+ active investors • Daily volume: $2.8M • Platform uptime: 99.9% • Next maintenance: Never",
    "🚀 New feature: Automated trading signals now available • Referral bonuses increased • Security audit completed • Mobile app coming soon",
    "💎 Diamond hands rewarded: Long-term investors see 300%+ returns • New investment tiers available • Enhanced withdrawal system",
    "📈 Market update: Crypto markets bullish • USDT adoption growing • Platform performance exceeds expectations"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNews((prev) => (prev + 1) % newsItems.length);
    }, 10000); // Change news every 10 seconds

    return () => clearInterval(interval);
  }, [newsItems.length]);

  return (
    <div className="news-ticker">
      <div className="ticker-content">
        {newsItems[currentNews]}
      </div>
    </div>
  );
};

export default NewsTicker; 