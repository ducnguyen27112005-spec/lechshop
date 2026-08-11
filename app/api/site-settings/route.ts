import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { defaultSiteConfig } from "@/lib/site-config";

export async function GET() {
    try {
        const setting = await prisma.setting.findUnique({
            where: { id: "site-settings" }
        });
        
        if (!setting) {
            return NextResponse.json(defaultSiteConfig);
        }
        
        const socialLinks = (typeof setting.socialLinks === 'object' && setting.socialLinks !== null) 
            ? setting.socialLinks as any 
            : {};
        
        return NextResponse.json({
            ...defaultSiteConfig,
            phone: setting.hotline || defaultSiteConfig.phone,
            email: setting.email || defaultSiteConfig.email,
            address: setting.address || defaultSiteConfig.address,
            copyright: setting.footerText || defaultSiteConfig.copyright,
            workingHours: socialLinks.workingHours || defaultSiteConfig.workingHours,
            social: {
                ...defaultSiteConfig.social,
                ...(socialLinks.social || {})
            },
            bankAccount: {
                ...defaultSiteConfig.bankAccount,
                ...(socialLinks.bankAccount || {})
            }
        });
    } catch (error) {
        return NextResponse.json(defaultSiteConfig);
    }
}
