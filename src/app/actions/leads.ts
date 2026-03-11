"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendLeadNotification } from "@/lib/mailer";

// Using `any` for now since Prisma client types may be stale until next DB push + generate
// The runtime will use the correct SQLite columns

export async function createLead(formData: {
    name: string;
    mobile: string;
    email?: string;
    city: string;
    pincode?: string;
    interest?: string;
    source?: string;
    phone?: string;
}) {
    // Mobile validation: Indian numbers starting with 6-9, exactly 10 digits
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobile)) {
        return { success: false, error: "Please enter a valid 10-digit Indian mobile number." };
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lead = await (prisma.lead.create as any)({
            data: {
                name: formData.name,
                mobile: formData.mobile,
                phone: formData.mobile,
                email: formData.email,
                city: formData.city,
                pincode: formData.pincode,
                interest: formData.interest,
                source: formData.source || "contact_form",
                status: "new",
            },
        });

        // Send SMTP notification (non-blocking)
        try {
            await sendLeadNotification({
                name: formData.name,
                mobile: formData.mobile,
                email: formData.email,
                city: formData.city,
                pincode: formData.pincode,
                interest: formData.interest,
                source: formData.source,
            });
        } catch (emailError) {
            console.error("Email notification failed:", emailError);
        }

        revalidatePath("/admin");
        revalidatePath("/admin/leads");

        return { success: true, leadId: lead.id };
    } catch (error) {
        console.error("Failed to create lead:", error);
        return { success: false, error: "Something went wrong. Please try again later." };
    }
}

export async function updateLeadStatus(leadId: string, status: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (prisma.lead.update as any)({
        where: { id: leadId },
        data: { status },
    });
    revalidatePath("/admin/leads");
    return { success: true };
}

export async function getRecentLeads(limit = 10) {
    return prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
    });
}

export async function getAllLeads(search?: string, interest?: string, status?: string, city?: string) {
    // Fetch all and filter in JS to avoid stale type errors
    const all = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });
    return all.filter((l: Record<string, unknown>) => {
        const q = (search || '').toLowerCase();
        const matchSearch = !q ||
            String(l.name).toLowerCase().includes(q) ||
            String(l.email || '').toLowerCase().includes(q) ||
            String(l.mobile || l.phone || '').includes(q);
        const matchInterest = !interest || l.interest === interest;
        const matchStatus = !status || l.status === status;
        const matchCity = !city || String(l.city).toLowerCase().includes(city.toLowerCase());
        return matchSearch && matchInterest && matchStatus && matchCity;
    });
}
