"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Bot, CheckCircle2, Loader2, MessageCircle, Phone, Send, Sparkles, X } from "lucide-react";
import { createLead } from "@/app/actions/leads";
import { getLeadFormToken } from "@/app/actions/lead-token";
import styles from "./AiAssistant.module.css";

type Role = "user" | "assistant";

type ChatItem = {
    id: string;
    role: Role;
    content: string;
};

const WHATSAPP_URL =
    "https://wa.me/919345217979?text=Hi%2C%20I%20want%20to%20know%20more%20about%20Airlink%20Broadband%20plans";
const PHONE = "+919344584000";

const GREETING =
    "Hi! I'm Airlink AI 👋 I can help you choose a plan, compare OTT benefits, or check availability in your area. What's your pincode or locality?";

const SUGGESTIONS = [
    "Which plan is best for a family of 4?",
    "Do you have OTT plans?",
    "Best plan for gaming",
    "Is my area covered?",
];

const TOPICS = ["New connection", "Plan upgrade", "Business leased line", "Coverage check", "Something else"];

function newId(): string {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Renders **bold** segments without pulling in a markdown dependency. */
function renderText(content: string): React.ReactNode {
    return content.split("**").map((part, index) =>
        index % 2 === 1 ? <strong key={index}>{part}</strong> : <React.Fragment key={index}>{part}</React.Fragment>
    );
}

function TypingDots() {
    return (
        <span className={styles.typing} aria-label="Assistant is typing">
            <span />
            <span />
            <span />
        </span>
    );
}

function LeadForm({
    transcript,
    onBack,
}: {
    transcript: string;
    onBack: () => void;
}) {
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [city, setCity] = useState("");
    const [topic, setTopic] = useState(TOPICS[0]);
    const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [honeypot, setHoneypot] = useState("");
    const [formToken, setFormToken] = useState("");

    useEffect(() => {
        getLeadFormToken().then(setFormToken).catch(() => {});
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (status === "saving") return;
        setStatus("saving");
        setErrorMessage("");

        const result = await createLead({
            name: name.trim(),
            mobile,
            city: city.trim(),
            interest: `AI Assistant: ${topic}`,
            source: "ai_assistant",
            message: transcript,
            honeypot,
            formToken,
        });

        if (result.success) {
            setStatus("done");
        } else {
            setStatus("error");
            setErrorMessage(result.error || "Something went wrong. Please try again.");
        }
    };

    if (status === "done") {
        return (
            <div className={styles.success}>
                <div className={styles.successIcon}>
                    <CheckCircle2 size={34} />
                </div>
                <h3>Request received!</h3>
                <p>Our team will call you on {mobile} shortly. For anything urgent, message us on WhatsApp.</p>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={styles.whatsappBtn}>
                    <MessageCircle size={16} /> Chat on WhatsApp
                </a>
                <button type="button" className={styles.backLink} onClick={onBack}>
                    Back to chat
                </button>
            </div>
        );
    }

    return (
        <div className={styles.leadFormWrap}>
            <button type="button" className={styles.backLink} onClick={onBack}>
                ← Back to chat
            </button>
            <h3 className={styles.leadTitle}>Talk to an expert</h3>
            <p className={styles.leadSubtitle}>
                Share your details and our team will call you back about your {topic.toLowerCase()}.
            </p>

            <form className={styles.leadForm} onSubmit={handleSubmit}>
                <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
                    <label htmlFor="assistant-company-website">Company website</label>
                    <input
                        id="assistant-company-website"
                        type="text"
                        name="company_website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(event) => setHoneypot(event.target.value)}
                    />
                </div>
                <label className={styles.field}>
                    <span>Name</span>
                    <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Your name"
                        required
                        maxLength={80}
                        autoComplete="name"
                    />
                </label>

                <label className={styles.field}>
                    <span>Mobile number</span>
                    <input
                        type="tel"
                        value={mobile}
                        onChange={(event) => setMobile(event.target.value)}
                        placeholder="10-digit mobile number"
                        required
                        minLength={10}
                        maxLength={15}
                        inputMode="tel"
                        autoComplete="tel"
                    />
                </label>

                <label className={styles.field}>
                    <span>City / area</span>
                    <input
                        type="text"
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                        placeholder="e.g. Dharmapuri, Anna Nagar"
                        required
                        maxLength={80}
                        autoComplete="address-level2"
                    />
                </label>

                <label className={styles.field}>
                    <span>I&apos;m interested in</span>
                    <select value={topic} onChange={(event) => setTopic(event.target.value)}>
                        {TOPICS.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </label>

                {status === "error" && <p className={styles.formError}>{errorMessage}</p>}

                <button type="submit" className={styles.submitBtn} disabled={status === "saving"}>
                    {status === "saving" ? <Loader2 size={16} className={styles.spin} /> : <Phone size={16} />}
                    {status === "saving" ? "Sending..." : "Request a callback"}
                </button>
                <p className={styles.consent}>By submitting, you agree to be contacted about Airlink services.</p>
            </form>
        </div>
    );
}

export default function AiAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatItem[]>([{ id: "welcome", role: "assistant", content: GREETING }]);
    const [input, setInput] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<{ message: string; code?: string } | null>(null);
    const [showLeadForm, setShowLeadForm] = useState(false);

    const listRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                abortRef.current?.abort();
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen || showLeadForm) return;
        const timer = window.setTimeout(() => inputRef.current?.focus(), 120);
        return () => window.clearTimeout(timer);
    }, [isOpen, showLeadForm]);

    useEffect(() => {
        const node = listRef.current;
        if (node) node.scrollTop = node.scrollHeight;
    }, [messages, error, isStreaming]);

    const updateMessage = useCallback((id: string, content: string) => {
        setMessages((current) => current.map((message) => (message.id === id ? { ...message, content } : message)));
    }, []);

    const send = useCallback(
        async (rawText: string) => {
            const text = rawText.trim();
            if (!text || isStreaming) return;

            const userMessage: ChatItem = { id: newId(), role: "user", content: text };
            const assistantId = newId();
            const history = [...messages.filter((message) => message.id !== "welcome"), userMessage]
                .filter((message) => message.content.trim())
                .slice(-10)
                .map((message) => ({ role: message.role, content: message.content }));

            setMessages((current) => [...current, userMessage, { id: assistantId, role: "assistant", content: "" }]);
            setInput("");
            setError(null);
            setIsStreaming(true);
            setShowLeadForm(false);

            const controller = new AbortController();
            abortRef.current = controller;

            try {
                const response = await fetch("/api/ai/assistant", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ messages: history }),
                    signal: controller.signal,
                });

                if (!response.ok) {
                    const data = await response.json().catch(() => ({}));
                    const failure = new Error(data.error || "Something went wrong. Please try again.");
                    (failure as Error & { code?: string }).code = data.code;
                    throw failure;
                }

                if (!response.body) {
                    throw new Error("The assistant could not answer that. Please try again.");
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = "";
                let accumulated = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    buffer = lines.pop() ?? "";

                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (!trimmed.startsWith("data:")) continue;
                        const payload = trimmed.slice(5).trim();
                        if (!payload || payload === "[DONE]") continue;

                        try {
                            const json = JSON.parse(payload);
                            if (json?.error) {
                                throw new Error("The assistant is unavailable right now. Please try again.");
                            }
                            const delta: string = json?.choices?.[0]?.delta?.content ?? "";
                            if (delta) {
                                accumulated += delta;
                                updateMessage(assistantId, accumulated);
                            }
                        } catch (parseError) {
                            if (parseError instanceof SyntaxError) continue;
                            throw parseError;
                        }
                    }
                }

                if (!accumulated.trim()) {
                    updateMessage(
                        assistantId,
                        "Sorry, I couldn't put an answer together. Please try rephrasing, or WhatsApp us and our team will help."
                    );
                }
            } catch (requestError) {
                const typedError = requestError as Error & { code?: string };
                if (typedError.name === "AbortError") {
                    setMessages((current) => current.filter((message) => message.id !== assistantId || message.content.trim()));
                    return;
                }

                setMessages((current) => current.filter((message) => message.id !== assistantId || message.content.trim()));
                setError({
                    message:
                        typedError.code === "not_configured"
                            ? "The AI assistant is being set up right now. Please reach our team on WhatsApp or call us — we reply instantly."
                            : typedError.message || "Something went wrong. Please try again.",
                    code: typedError.code,
                });
            } finally {
                setIsStreaming(false);
                if (abortRef.current === controller) abortRef.current = null;
            }
        },
        [isStreaming, messages, updateMessage]
    );

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        void send(input);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            void send(input);
        }
    };

    const close = () => {
        abortRef.current?.abort();
        setIsOpen(false);
    };

    const transcript = (() => {
        const lines = messages
            .filter((message) => message.id !== "welcome" && message.content.trim())
            .slice(-6)
            .map((message) => `${message.role === "user" ? "Customer" : "Airlink AI"}: ${message.content.trim()}`);
        return (lines.length ? lines.join("\n") : "Customer opened the AI assistant and asked for a callback.").slice(0, 1500);
    })();

    return (
        <>
            <button
                type="button"
                className={styles.launcher}
                onClick={() => setIsOpen(true)}
                aria-expanded={isOpen}
                aria-label="Open Airlink AI assistant"
            >
                <span className={styles.launcherIcon}>
                    <Sparkles size={18} />
                </span>
                <span className={styles.launcherText}>Ask Airlink AI</span>
            </button>

            {isOpen && (
                <>
                    <div className={styles.backdrop} onClick={close} aria-hidden="true" />
                    <section className={styles.panel} role="dialog" aria-modal="true" aria-label="Airlink AI assistant">
                        <header className={styles.header}>
                            <div className={styles.brand}>
                                <div className={styles.avatar}>
                                    <Bot size={20} />
                                </div>
                                <div>
                                    <p className={styles.title}>
                                        Airlink AI <span className={styles.liveDot} aria-hidden="true" />
                                    </p>
                                    <p className={styles.subtitle}>Plans · Coverage · OTT</p>
                                </div>
                            </div>
                            <div className={styles.headerActions}>
                                <a href={`tel:${PHONE}`} className={styles.iconButton} aria-label="Call Airlink">
                                    <Phone size={16} />
                                </a>
                                <button type="button" className={styles.iconButton} onClick={close} aria-label="Close chat">
                                    <X size={18} />
                                </button>
                            </div>
                        </header>

                        {showLeadForm ? (
                            <div className={styles.formArea}>
                                <LeadForm transcript={transcript} onBack={() => setShowLeadForm(false)} />
                            </div>
                        ) : (
                            <>
                                <div className={styles.messages} ref={listRef} aria-live="polite">
                                    {messages.map((message, index) => {
                                        const isLast = index === messages.length - 1;
                                        return (
                                            <div
                                                key={message.id}
                                                className={message.role === "user" ? styles.rowUser : styles.rowAssistant}
                                            >
                                                {message.role === "assistant" && (
                                                    <div className={styles.miniAvatar} aria-hidden="true">
                                                        <Bot size={14} />
                                                    </div>
                                                )}
                                                <div
                                                    className={
                                                        message.role === "user" ? styles.bubbleUser : styles.bubbleAssistant
                                                    }
                                                >
                                                    {message.content ? (
                                                        <div className={styles.bubbleText}>
                                                            {renderText(message.content)}
                                                            {isStreaming && isLast && <span className={styles.cursor} />}
                                                        </div>
                                                    ) : (
                                                        <TypingDots />
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {error && (
                                        <div className={styles.errorBubble}>
                                            <p>{error.message}</p>
                                            <div className={styles.errorActions}>
                                                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                                                    <MessageCircle size={14} /> WhatsApp
                                                </a>
                                                <a href={`tel:${PHONE}`}>
                                                    <Phone size={14} /> Call
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {messages.length === 1 && !error && (
                                        <div className={styles.chips}>
                                            {SUGGESTIONS.map((suggestion) => (
                                                <button
                                                    key={suggestion}
                                                    type="button"
                                                    className={styles.chip}
                                                    onClick={() => void send(suggestion)}
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <form className={styles.composer} onSubmit={handleSubmit}>
                                    <textarea
                                        ref={inputRef}
                                        rows={1}
                                        value={input}
                                        onChange={(event) => setInput(event.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Ask about plans, prices or coverage..."
                                        maxLength={2000}
                                        aria-label="Your message"
                                    />
                                    <button
                                        type="submit"
                                        className={styles.sendButton}
                                        disabled={!input.trim() || isStreaming}
                                        aria-label="Send message"
                                    >
                                        {isStreaming ? <Loader2 size={18} className={styles.spin} /> : <Send size={18} />}
                                    </button>
                                </form>

                                <div className={styles.footer}>
                                    <button
                                        type="button"
                                        className={styles.expertButton}
                                        onClick={() => setShowLeadForm(true)}
                                    >
                                        <Phone size={14} /> Talk to an expert
                                    </button>
                                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
                                        <MessageCircle size={14} /> WhatsApp
                                    </a>
                                </div>
                                <p className={styles.disclaimer}>
                                    AI replies may be inaccurate. Final prices and availability are confirmed by our team.
                                </p>
                            </>
                        )}
                    </section>
                </>
            )}
        </>
    );
}
