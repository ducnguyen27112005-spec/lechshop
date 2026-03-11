"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

interface MobileSubMenuProps {
    title: React.ReactNode;
    children: React.ReactNode;
    onClose: () => void;
    href?: string;
}

export default function MobileSubMenu({ title, children, onClose, href }: MobileSubMenuProps) {
    const [isOpen, setIsOpen] = useState(false);

    if (href) {
        return (
            <div>
                <div className="w-full border-b border-gray-50 flex items-stretch">
                    <Link
                        href={href}
                        onClick={onClose}
                        className="flex-1 px-5 py-4 hover:text-red-600 hover:bg-gray-50 font-medium uppercase transition-colors flex items-center"
                    >
                        {title}
                    </Link>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="px-4 hover:bg-gray-50 transition-colors border-l border-gray-50 flex items-center justify-center group"
                        aria-label="Mở rộng menu"
                    >
                        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-red-600' : ''}`} />
                    </button>
                </div>
                <div className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${isOpen ? 'max-h-[800px]' : 'max-h-0'}`}>
                    {children}
                </div>
            </div>
        );
    }

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-5 py-4 border-b border-gray-50 hover:text-red-600 hover:bg-gray-50 flex items-center justify-between group"
            >
                <span className="font-medium uppercase">{title}</span>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-red-600' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${isOpen ? 'max-h-[800px]' : 'max-h-0'}`}>
                {children}
            </div>
        </div>
    );
}
