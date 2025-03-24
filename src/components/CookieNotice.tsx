'use client';

import { useEffect, useState } from 'react';

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setVisible(true);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 w-full bg-gray-800 text-white text-sm p-4 flex items-center justify-between z-50 shadow-md">
      <span>
        This website uses cookies to improve your experience. By using Lucky Logic, you accept our use of cookies.
      </span>
      <button
        onClick={acceptCookies}
        className="ml-4 px-4 py-2 bg-green-500 rounded text-black font-semibold hover:bg-green-600"
      >
        Accept
      </button>
    </div>
  );
} 