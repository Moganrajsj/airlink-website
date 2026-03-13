"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendLeadNotification } from "@/lib/mailer";

// Using `any` for now since Prisma client types may be stale until next DB push + generate
// The runtime will use the correct SQLite columns

export async function createLead(formData: {
    name: string;
    mobile?: string;
    phone?: string;
    email?: string;
    company?: string;
    city: string;
    pincode?: string;
    interest?: string;
    source?: string;
    message?: string;
}) {
    // Determine the phone number, allowing for either mobile or phone field
    const rawMobile = formData.mobile || formData.phone || "";
    
    // Sanitize: Remove all non-digit characters
    const sanitizedMobile = rawMobile.replace(/\D/g, "");

    // Mobile validation: Indian numbers should ideally be 10 digits
    // Relaxed validation: Check if it has at least 10 digits
    if (sanitizedMobile.length < 10) {
        return { success: false, error: "Please enter a valid 10-digit mobile number." };
    }

    // Take the last 10 digits if it's longer (e.g. includes country code)
    const finalMobile = sanitizedMobile.slice(-10);

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lead = await (prisma.lead.create as any)({
            data: {
                name: formData.name,
                mobile: finalMobile,
                phone: finalMobile,
                email: formData.email,
                company: formData.company,
                city: formData.city,
                pincode: formData.pincode,
                interest: formData.interest || formData.message,
                source: formData.source || "contact_form",
                status: "new",
            },
        });

        // Send SMTP notification (non-blocking)
        try {
            await sendLeadNotification({
                name: formData.name,
                mobile: finalMobile,
                email: formData.email,
                city: formData.city,
                pincode: formData.pincode,
                interest: formData.interest || formData.message,
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
