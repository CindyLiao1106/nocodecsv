"use client";

import { useEffect, useRef } from "react";
import { PAYPAL } from "@/lib/payment";

interface Props { buttonId: string; }

let sdkPromise: Promise<void> | null = null;

function loadSDK(): Promise<void> {
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve) => {
    if ((window as any).paypal?.HostedButtons) { resolve(); return; }
    const s = document.createElement("script");
    s.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL.clientId}&components=hosted-buttons&disable-funding=card,credit,paylater,venmo&currency=USD`;
    s.onload = () => resolve();
    document.head.appendChild(s);
  });
  return sdkPromise;
}

export function PayPalButton({ buttonId }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    loadSDK().then(() => {
      try {
        (window as any).paypal.HostedButtons({ hostedButtonId: buttonId }).render(ref.current!);
      } catch {}
    });
  }, [buttonId]);

  return <div ref={ref} />;
}
