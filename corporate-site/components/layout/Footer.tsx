import { siteConfig } from "@/content/site";
import { routes } from "@/lib/routes";
import { Facebook, Linkedin, Youtube, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href={routes.home} className="mb-4">
                            <Image
                                src="/images/lechshop-logo-final.png"
                                alt="LECHSHOP Logo"
                                width={250}
                                height={75}
                                className="h-12 w-auto"
                            />
                        </Link>
                        {/* <p className="text-sm mb-4">{siteConfig.description}</p> */}
                        <div className="space-y-2 text-sm">
                            <p>
                                <strong>Địa chỉ:</strong> {siteConfig.address}
                            </p>
                            <p>
                                <strong>Hotline:</strong>{" "}
                                <a href={`tel:${siteConfig.phone}`} className="hover:text-blue-400">
                                    {siteConfig.phone}
                                </a>
                            </p>
                            <p>
                                <strong>Email:</strong>{" "}
                                <a href={`mailto:${siteConfig.email}`} className="hover:text-blue-400">
                                    {siteConfig.email}
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                            Liên kết nhanh
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href={routes.about} className="hover:text-blue-400">
                                    Giới thiệu
                                </Link>
                            </li>
                            <li>
                                <Link href={routes.products} className="hover:text-blue-400">
                                    Sản phẩm
                                </Link>
                            </li>
                            <li>
                                <Link href={routes.pricing} className="hover:text-blue-400">
                                    Bảng giá
                                </Link>
                            </li>
                            <li>
                                <Link href={routes.guides} className="hover:text-blue-400">
                                    Hướng dẫn
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Policies */}
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">
                            Chính sách
                        </h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="hover:text-blue-400">
                                    Điều khoản sử dụng
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-400">
                                    Chính sách bảo mật
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-blue-400">
                                    Chính sách hoàn tiền
                                </Link>
                            </li>
                            <li>
                                <Link href={routes.contact} className="hover:text-blue-400">
                                    Liên hệ
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Social Links */}
                <div className="mt-8 pt-8 border-t border-gray-800">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm">
                            © 2026 {siteConfig.name}. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href={siteConfig.social.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                                className="hover:text-blue-400 transition-colors"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href={siteConfig.social.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="hover:text-blue-400 transition-colors"
                            >
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a
                                href={siteConfig.social.youtube}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="YouTube"
                                className="hover:text-blue-400 transition-colors"
                            >
                                <Youtube className="h-5 w-5" />
                            </a>
                            <a
                                href={`mailto:${siteConfig.email}`}
                                aria-label="Email"
                                className="hover:text-blue-400 transition-colors"
                            >
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
