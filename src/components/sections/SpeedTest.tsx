"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { Wifi, Download, Upload, Activity, Zap, Info, RefreshCw } from 'lucide-react';
import DynamicBackground from '@/components/animations/DynamicBackground';

type TestPhase = 'idle' | 'ping' | 'download' | 'upload' | 'done';

const TEST_FILE_URLS = [
    'https://speedtest.serverius.net/files/10mb.bin',
    'https://cachefly.cachefly.net/10mb.test',
    'https://speedtest.tele2.net/10MB.zip'
];
const UPLOAD_ENDPOINT = 'https://httpbin.org/post'; // Public POST endpoint for upload test

// --- Modular UI: SpeedMeterGauge ---
const SpeedMeterGauge = ({ value, max = 1000, phase }: { value: number; max?: number; phase: TestPhase }) => {
    const circumference = 2 * Math.PI * 90;
    const progress = Math.min(value / max, 1);
    const strokeOffset = circumference - progress * circumference;

    // Needle rotation: -90deg to 90deg (180deg total range)
    const needleRotation = (progress * 180) - 90;

    return (
        <div className="relative flex-shrink-0 group">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-[#FBBF24]/5 rounded-full blur-3xl group-hover:bg-[#FBBF24]/10 transition-colors duration-1000" />

            <svg viewBox="0 0 220 220" className="relative z-10 w-full max-w-[280px] sm:max-w-[320px] h-auto mx-auto">
                {/* Track */}
                <circle
                    cx="110" cy="110" r="90"
                    fill="none"
                    stroke="rgba(10,25,47,0.04)"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
                    strokeDashoffset={circumference * 0.375}
                    className="rotate-[135deg] origin-center"
                />

                {/* Progress Arc */}
                <motion.circle
                    cx="110" cy="110" r="90"
                    fill="none"
                    stroke="#FBBF24"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: circumference - (progress * (circumference * 0.75)) }}
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                    style={{
                        filter: `drop-shadow(0 0 12px rgba(251,191,36,0.4))`,
                    }}
                    className="rotate-[135deg] origin-center"
                />

                {/* Needle */}
                <motion.g
                    animate={{ rotate: (progress * 270) - 135 }}
                    transition={{ type: "spring", stiffness: 40, damping: 12 }}
                    style={{ originX: "110px", originY: "110px" }}
                >
                    <line
                        x1="110" y1="110"
                        x2="110" y2="40"
                        stroke="#0A192F"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    <circle cx="110" cy="110" r="6" fill="#0A192F" />
                    <circle cx="110" cy="110" r="3" fill="#FBBF24" />
                </motion.g>

                {/* Tic Marks */}
                {[...Array(11)].map((_, i) => {
                    const angle = (i * 27) - 135;
                    return (
                        <line
                            key={i}
                            x1="110" y1="25"
                            x2="110" y2="32"
                            stroke={value > (i * 100) ? "#FBBF24" : "rgba(10,25,47,0.1)"}
                            strokeWidth="2"
                            transform={`rotate(${angle} 110 110)`}
                        />
                    );
                })}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={phase}
                        initial={{ opacity: 0, scale: 0.85, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: -10 }}
                        className="text-center"
                    >
                        {phase === 'idle' ? (
                            <>
                                <Wifi size={56} className="mx-auto mb-4 text-[#FBBF24] opacity-50" />
                                <p className="text-[#0A192F]/40 text-[10px] font-black uppercase tracking-[0.4em]">START TEST</p>
                            </>
                        ) : (
                            <>
                                <motion.p
                                    className="text-5xl sm:text-7xl font-black text-[#0A192F] tabular-nums tracking-tighter"
                                >
                                    {Math.round(value)}
                                </motion.p>
                                <p className="text-[#0A192F]/40 text-xs sm:text-base font-black uppercase tracking-[0.2em] mt-2">Mbps</p>
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

const SpeedTest = () => {
    const [phase, setPhase] = useState<TestPhase>('idle');
    const [ping, setPing] = useState(0);
    const [jitter, setJitter] = useState(0);
    const [download, setDownload] = useState(0);
    const [upload, setUpload] = useState(0);
    const [activeValue, setActiveValue] = useState(0);
    const [statusText, setStatusText] = useState('Connection Ready');

    const abortController = useRef<AbortController | null>(null);

    const runPingTest = async () => {
        setPhase('ping');
        setStatusText('Measuring Latency...');
        const samples: number[] = [];
        for (let i = 0; i < 5; i++) {
            const start = performance.now();
            try {
                await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors', cache: 'no-cache' });
                samples.push(performance.now() - start);
                setPing(Math.round(samples.reduce((a, b) => a + b) / samples.length));
                await new Promise(r => setTimeout(r, 100));
            } catch (e) {
                samples.push(20); // Fallback
            }
        }

        // Calculate Jitter
        if (samples.length > 1) {
            let diffSum = 0;
            for (let i = 1; i < samples.length; i++) {
                diffSum += Math.abs(samples[i] - samples[i - 1]);
            }
            setJitter(Math.round(diffSum / (samples.length - 1)));
        }
    };

    const runDownloadTest = async (urls = TEST_FILE_URLS) => {
        setPhase('download');
        setStatusText('Testing Download Speed...');

        for (const url of urls) {
            abortController.current = new AbortController();
            const startTime = performance.now();
            let loaded = 0;

            try {
                const response = await fetch(`${url}?cb=${Math.random()}`, {
                    signal: abortController.current.signal
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                if (!response.body) throw new Error('No response body');

                const reader = response.body.getReader();

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    loaded += value.length;
                    const elapsed = (performance.now() - startTime) / 1000;
                    const mbps = (loaded * 8) / (elapsed * 1024 * 1024);
                    setDownload(mbps);
                    setActiveValue(mbps);
                }
                return; // Success, exit the loop
            } catch (e) {
                console.error(`Download failed for ${url}`, e);
                // Continue to next URL
            }
        }
        setStatusText('Download Failed (Check connection)');
    };

    const runUploadTest = async () => {
        setPhase('upload');
        setStatusText('Testing Upload Speed...');

        const size = 2 * 1024 * 1024; // 2MB is more stable for standard tests
        const data = new Uint8Array(size);

        // Fill data in 64KB chunks to avoid Crypto API entropy limit (QuotasExceededError)
        const chunkSize = 65536;
        for (let i = 0; i < size; i += chunkSize) {
            window.crypto.getRandomValues(data.subarray(i, Math.min(i + chunkSize, size)));
        }

        const startTime = performance.now();

        try {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', UPLOAD_ENDPOINT, true);

            const promise = new Promise((resolve) => {
                xhr.upload.onprogress = (e) => {
                    const elapsed = (performance.now() - startTime) / 1000;
                    if (elapsed > 0) {
                        const mbps = (e.loaded * 8) / (elapsed * 1024 * 1024);
                        setUpload(mbps);
                        setActiveValue(mbps);
                    }
                };
                xhr.onload = () => resolve(true);
                xhr.onerror = () => resolve(false);
            });

            xhr.send(data);
            await promise;
        } catch (e) {
            console.error('Upload failed', e);
        }
    };

    const runTest = async () => {
        if (phase !== 'idle' && phase !== 'done') return;

        setPing(0); setJitter(0); setDownload(0); setUpload(0); setActiveValue(0);

        await runPingTest();
        await runDownloadTest();
        await runUploadTest();

        setPhase('done');
        setStatusText('Test Complete');
        setActiveValue(download);
    };

    useEffect(() => {
        return () => abortController.current?.abort();
    }, []);

    return (
        <section id="speed-test" className="py-12 md:py-24 bg-white relative overflow-hidden">
            <DynamicBackground layers={["pulse", "particles"]} opacity={0.3} />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">

                        {/* LEFT: The Gauge */}
                        <div className="relative">
                            <SpeedMeterGauge value={activeValue} phase={phase} />

                            {/* Connection Meta */}
                            <div className="mt-8 flex justify-center gap-8">
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-[#0A192F]/30 uppercase tracking-widest mb-1">Server</p>
                                    <p className="text-sm font-bold text-[#0A192F]">Chennai, TN</p>
                                </div>
                                <div className="w-px h-8 bg-gray-100" />
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-[#0A192F]/30 uppercase tracking-widest mb-1">Provider</p>
                                    <p className="text-sm font-bold text-[#0A192F]">Airlink Fiber</p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: Stats & Control */}
                        <div className="flex-1 w-full space-y-8">
                            <div className="mb-6">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FBBF24]/10 text-[#FBBF24] text-[10px] font-black uppercase tracking-widest mb-4 border border-[#FBBF24]/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] animate-pulse" />
                                    {statusText}
                                </div>
                                <h2 className="text-3xl sm:text-4xl font-black text-[#0A192F] tracking-tight uppercase">
                                    Live <span className="text-[#FBBF24]">Network</span> Diagnostics
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Ping & Jitter */}
                                <div className={`p-6 rounded-[2rem] border transition-all duration-500 ${phase === 'ping' ? 'bg-[#FBBF24]/05 border-[#FBBF24]/30 shadow-lg' : 'bg-gray-50 border-transparent'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-[#0A192F] shadow-sm">
                                            <Activity size={18} />
                                        </div>
                                        {phase === 'ping' && <div className="w-2 h-2 rounded-full bg-[#FBBF24] animate-ping" />}
                                    </div>
                                    <p className="text-[10px] font-black text-[#0A192F]/40 uppercase tracking-widest mb-1">Ping / Jitter</p>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-3xl font-black text-[#0A192F] tabular-nums">{ping}</span>
                                        <span className="text-sm font-bold text-[#0A192F]/30 uppercase">ms</span>
                                        <span className="text-sm font-bold text-[#FBBF24]">/ {jitter}ms</span>
                                    </div>
                                </div>

                                {/* Download */}
                                <div className={`p-6 rounded-[2rem] border transition-all duration-500 ${phase === 'download' ? 'bg-[#FBBF24]/05 border-[#FBBF24]/30 shadow-lg' : 'bg-gray-50 border-transparent'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-[#0A192F] shadow-sm">
                                            <Download size={18} />
                                        </div>
                                        {phase === 'download' && <div className="w-2 h-2 rounded-full bg-[#FBBF24] animate-ping" />}
                                    </div>
                                    <p className="text-[10px] font-black text-[#0A192F]/40 uppercase tracking-widest mb-1">Download</p>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-3xl font-black text-[#0A192F] tabular-nums">{download.toFixed(1)}</span>
                                        <span className="text-sm font-bold text-[#0A192F]/30 uppercase">Mbps</span>
                                    </div>
                                </div>

                                {/* Upload */}
                                <div className={`p-6 rounded-[2rem] border transition-all duration-500 ${phase === 'upload' ? 'bg-[#FBBF24]/05 border-[#FBBF24]/30 shadow-lg' : 'bg-gray-50 border-transparent'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-[#0A192F] shadow-sm">
                                            <Upload size={18} />
                                        </div>
                                        {phase === 'upload' && <div className="w-2 h-2 rounded-full bg-[#FBBF24] animate-ping" />}
                                    </div>
                                    <p className="text-[10px] font-black text-[#0A192F]/40 uppercase tracking-widest mb-1">Upload</p>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-3xl font-black text-[#0A192F] tabular-nums">{upload.toFixed(1)}</span>
                                        <span className="text-sm font-bold text-[#0A192F]/30 uppercase">Mbps</span>
                                    </div>
                                </div>

                                {/* Start Button */}
                                <button
                                    onClick={runTest}
                                    disabled={phase !== 'idle' && phase !== 'done'}
                                    className={`cursor-target group relative overflow-hidden p-6 rounded-[2rem] border transition-all duration-500 ${phase === 'idle' || phase === 'done'
                                        ? 'bg-[#0A192F] text-white border-[#0A192F] hover:shadow-[0_20px_40px_rgba(10,25,47,0.2)]'
                                        : 'bg-gray-100 text-gray-400 border-transparent cursor-not-allowed'
                                        }`}
                                >
                                    <div className="relative z-10 flex flex-col items-center justify-center gap-2 h-full">
                                        {phase === 'done' ? <RefreshCw size={24} className="mb-1" /> : <Zap size={24} className="mb-1 text-[#FBBF24]" />}
                                        <span className="text-sm font-black uppercase tracking-widest">
                                            {phase === 'idle' ? 'Start Test' : phase === 'done' ? 'Retest' : 'Testing...'}
                                        </span>
                                    </div>
                                </button>
                            </div>

                            <div className="pt-6 flex items-center gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#FBBF24] shadow-sm shrink-0">
                                    <Info size={18} />
                                </div>
                                <p className="text-xs text-[#0A192F]/50 font-medium leading-relaxed">
                                    For the most accurate results, we recommend using a wired connection and closing background apps. This test uses real network resources.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SpeedTest;
