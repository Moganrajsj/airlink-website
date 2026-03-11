import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Best Broadband Plans in Dharmapuri & Chennai | Airlink Fiber ISP',
    description: 'Get high-speed unlimited fiber broadband plans with OTT apps in Dharmapuri and Chennai. Dedicated leased line, free router, 24/7 support. Book now.',
};

export default function PlansLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
