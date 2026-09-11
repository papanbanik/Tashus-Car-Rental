'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Handles mobile app (Flutter WebView) integration.
 *
 * Detection strategy (any one of these marks the page as running inside Flutter):
 *  1. `window.FlutterChannel` is present  — injected by the Flutter WebView
 *  2. `?flutter=true` URL param           — explicitly set by the app
 *  3. User-agent contains "Flutter"       — Flutter WebView user-agent string
 *
 * `isApp` is set when `?from=redirection` is present (app-originated navigation).
 *
 * `sendToFlutter(action, data)` posts a JSON message back to the Flutter host
 * via `window.FlutterChannel.postMessage` so Flutter can act on the result.
 *
 * Flow:
 *   Flutter App
 *     ↓  Open Next.js page in WebView
 *   User performs action
 *     ↓  Next.js API call
 *   API success
 *     ↓  Next.js calls sendToFlutter()
 *   Flutter WebView receives message
 *     ↓  Flutter performs the required action
 */
export const useHandleApp = () => {
  const searchParams = useSearchParams();

  // True when the URL carries ?from=redirection (app-originated navigation)
  const [isApp, setIsApp] = useState<boolean>(false);

  // True when any Flutter WebView signal is detected
  const [isFlutterWebView, setIsFlutterWebView] = useState<boolean>(false);

  // ─── Detect ?from=redirection ──────────────────────────────────────────────
  useEffect(() => {
    setIsApp(searchParams.get('from') === 'redirection');
  }, [searchParams]);

  // ─── Auto-detect Flutter WebView environment ───────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkFlutterEnvironment = (): boolean => {
      // 1. Check for injected Flutter channel
      const hasFlutterChannel = !!(window as any).FlutterChannel;
      // 2. Check for explicit URL parameter
      const urlParams = new URLSearchParams(window.location.search);
      const isFlutterParam = urlParams.get('flutter') === 'true';
      // 3. Check user-agent string
      const isFlutterUserAgent = navigator.userAgent.includes('Flutter');

      return hasFlutterChannel || isFlutterParam || isFlutterUserAgent;
    };

    setIsFlutterWebView(checkFlutterEnvironment());
  }, []);

  // ─── Send message to Flutter ───────────────────────────────────────────────
  /**
   * Posts a structured message to the Flutter host WebView.
   * Safe to call from web — no-ops when not inside a Flutter WebView.
   *
   * @param action  Identifier Flutter uses to route the message (e.g. 'paymentSuccess')
   * @param data    Arbitrary payload attached to the message
   */
  const sendToFlutter = (action: string, data: Record<string, any>): void => {
    if (isFlutterWebView && typeof window !== 'undefined') {
      if ((window as any).FlutterChannel) {
        (window as any).FlutterChannel.postMessage(
          JSON.stringify({ action, data }),
        );
      }
    }
  };

  return {
    /** True when the page was opened from the mobile app (?from=redirection) */
    isApp,
    /** True when a Flutter WebView environment is detected */
    isFlutterWebView,
    /** Post a message back to the Flutter host after an API action completes */
    sendToFlutter,
  };
};
