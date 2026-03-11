// Wrapper server component to fetch plans from DB and inject into client plans page
import React from 'react';
import { getPlans } from '@/app/actions/cms';
import PlansPageClient from './PlansPageClient';

export const dynamic = 'force-dynamic';

export default async function PlansPage() {
    const plans = await getPlans(false); // residential plans
    const businessPlans = await getPlans(true); // business plans
    return <PlansPageClient plans={plans} businessPlans={businessPlans} />;
}
