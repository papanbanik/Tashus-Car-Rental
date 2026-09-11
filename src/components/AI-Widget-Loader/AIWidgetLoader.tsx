'use client'; // Client component — required for useEffect

import { useEffect } from 'react';

interface AIWidgetLoaderProps {
  /**
   * Backend URL where widget.js is hosted
   * Examples:
   * - Local: http://localhost:3000
   * - Production: https://your-ai-backend.com
   */
  backendUrl?: string;

  /**
   * Optional: Pass user context to the widget
   * The widget will have access to these values
   */
  userId?: string;
  userToken?: string;

  /**
   * Optional: Custom CSS class for the widget container
   */
  containerClassName?: string;
}

/**
 * AIWidgetLoader — Embeds Tashus AI chat widget into any Next.js page
 *
 * Usage:
 * ```tsx
 * import AIWidgetLoader from '@/components/AI-Widget-Loader/AIWidgetLoader';
 *
 * export default function MyPage() {
 *   return (
 *     <>
 *       <div>Your page content...</div>
 *       <AIWidgetLoader
 *         backendUrl="http://localhost:3000"
 *         userId="user_123"
 *       />
 *     </>
 *   );
 * }
 * ```
 */
export default function AIWidgetLoader({
  backendUrl = process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://localhost:3001',
  userId,
  userToken,
  containerClassName = '',
}: AIWidgetLoaderProps) {
  useEffect(() => {
    // Step 1: Create or extend config object (before script loads)
    window.tashusAiConfig = {
      ...window.tashusAiConfig,
      backendUrl,
      ...(userId && { userId }),
      ...(userToken && { userToken }),
    };

    // Step 2: Check if widget script is already loaded
    if (window.tashusAiWidget) {
      console.log('[AI Widget] Already loaded on this page');
      return;
    }

    // Step 3: Create and append the script tag
    const script = document.createElement('script');
    script.src = `${backendUrl}/widget.js`;
    script.async = true;
    script.defer = true;

    // Log for debugging
    script.onload = () => {
      console.log('[AI Widget] ✅ Loaded successfully from:', script.src);
    };

    script.onerror = () => {
      console.error('[AI Widget] ❌ Failed to load from:', script.src);
      console.error('[AI Widget] Check that your backend is running and serving widget.js');
    };

    // Step 4: Append script to body
    document.body.appendChild(script);

    // Cleanup: remove script if component unmounts
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [backendUrl, userId, userToken]);

  return (
    <>
      {/* Container div where the widget will mount */}
      <div id="tashus-ai-widget" className={containerClassName} />
    </>
  );
}

// Optional: Add TypeScript definitions for window object
declare global {
  interface Window {
    tashusAiConfig?: {
      backendUrl?: string;
      userId?: string;
      userToken?: string;
    };
    tashusAiWidget?: any;
  }
}
