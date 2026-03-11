import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
    return (
        <a
            href="https://wa.me/919345217979?text=Hi%2C%20I%20want%20to%20know%20more%20about%20Airlink%20Broadband%20plans"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-[72px] right-5 z-[150] md:hidden bg-[#25D366] text-white p-4 rounded-full shadow-[0_8px_24px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform duration-300"
            aria-label="Chat on WhatsApp"
        >
            <MessageCircle size={26} />
        </a>
    );
}
