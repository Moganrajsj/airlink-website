"use client";

import React, { useEffect } from 'react';

const BotpressChat: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v1/inject.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if ((window as any).botpressWebChat) {
        (window as any).botpressWebChat.init({
          "botId": "25127424-f9e6-41f3-9b7b-16dcb398b7dd",
          "hostUrl": "https://cdn.botpress.cloud/webchat/v1",
          "messagingUrl": "https://messaging.botpress.cloud",
          "clientId": "d5bd42d9-1cbc-4b4c-8d39-321fd7a82b4e",
          "botName": "Airlink Assistant",
          "showPoweredBy": false,
          "theme": "prism",
          "primaryColor": "#FBBF24",
          "showWidget": true,
          "showCloseButton": true,
          "layoutWidth": "360px",
          "layoutHeight": "550px",
          "extraStyles": `
            .bpw-layout {
              z-index: 2147483647 !important;
            }
            @media (max-width: 768px) {
              .bpw-layout {
                width: 100vw !important;
                height: 100vh !important;
                max-height: 100vh !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                border-radius: 0 !important;
              }
              .bpw-floating-button {
                left: 20px !important; /* Move to LEFT on mobile to avoid WhatsApp clash */
                right: auto !important;
              }
            }
          `
        });
      }
    };

    return () => {
      const scripts = document.querySelectorAll('script[src*="botpress"]');
      scripts.forEach(s => s.remove());
    };
  }, []);

  return (
    <style dangerouslySetInnerHTML={{ __html: `
      #bp-web-widget-container {
        z-index: 2147483647 !important;
      }
      
      iframe#bp-web-widget {
        z-index: 2147483647 !important;
      }

      /* Desktop: Bottom Right */
      @media (min-width: 769px) {
        iframe#bp-web-widget {
          max-width: 360px !important;
          max-height: 550px !important;
          bottom: 20px !important;
          right: 20px !important;
        }
      }

      /* Mobile: Move to LEFT and optimize for full screen when open */
      @media (max-width: 768px) {
        iframe#bp-web-widget {
          bottom: 20px !important;
          left: 20px !important; /* Position on the LEFT */
          right: auto !important;
          max-width: 90vw !important;
        }
        
        /* If the chat is open, make it full screen for better UX */
        #bp-web-widget-container[data-is-open="true"] iframe#bp-web-widget {
          width: 100vw !important;
          height: 100vh !important;
          top: 0 !important;
          left: 0 !important;
          margin: 0 !important;
        }
      }
    `}} />
  );
};

export default BotpressChat;
