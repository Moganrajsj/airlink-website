import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ success: false, error: 'Missing required fields.' }, { status: 400 });
        }
        if (password.length < 8) {
            return NextResponse.json({ success: false, error: 'Password must be at least 8 characters.' }, { status: 400 });
        }

        // Hash the incoming token to compare against stored hash
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await prisma.user.findFirst({
            where: {
                resetToken: hashedToken,
                resetTokenExpiry: { gt: new Date() }, // token must not be expired
            },
        });

        if (!user) {
            return NextResponse.json({ success: false, error: 'Invalid or expired reset token. Please request a new one.' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ success: false, error: 'Something went wrong.' }, { status: 500 });
    }
}
