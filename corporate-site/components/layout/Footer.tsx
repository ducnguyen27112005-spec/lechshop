import { siteConfig } from "@/content/site";
import { routes } from "@/lib/routes";
import { Facebook, Linkedin, Youtube, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SiteInfo from "@/components/common/SiteInfo";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href={routes.home} className="mb-4 block">
                            <Image
                                src="/images/lechshop-logo-footer-v3.png"
                                alt="LECHSHOP Logo"
                                width={250}
                                height={75}
                                className="h-12 w-auto -ml-1"
                            />
                        </Link>
                        {/* <p className="text-sm mb-4">{siteConfig.description}</p> */}
                        <div className="space-y-2 text-sm">
                            <p>
                                <strong>Địa chỉ:</strong> <SiteInfo type="address" fallback={siteConfig.address} />
                            </p>
                            <p>
                                <strong>Hotline:</strong>{" "}
                                <SiteInfo
                                    type="phone"
                                    asLink
                                    fallback={siteConfig.phone}
                                    className="hover:text-blue-400"
                                />
                            </p>
                            <p>
                                <strong>Email:</strong>{" "}
                                <SiteInfo
                                    type="email"
                                    asLink
                                    fallback={siteConfig.email}
                                    className="hover:text-blue-400"
                                />
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
                                <Link href="/chinh-sach-ho-tro" className="hover:text-blue-400">
                                    Chính sách hỗ trợ
                                </Link>
                            </li>
                            <li>
                                <Link href="/chinh-sach-bao-mat" className="hover:text-blue-400">
                                    Chính sách bảo mật
                                </Link>
                            </li>

                            <li>
                                <Link href={routes.contact} className="hover:text-blue-400">
                                    Hợp tác
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Social Links */}
                <div className="mt-8 pt-8 border-t border-gray-800">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm">
                            © 2026 <SiteInfo type="name" fallback={siteConfig.name} />. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <SiteInfo type="facebook" asLink className="hover:text-blue-400 transition-colors" aria-label="Facebook">
                                <Facebook className="h-5 w-5" />
                            </SiteInfo>
                            {/* <SiteInfo type="linkedin" asLink className="hover:text-blue-400 transition-colors" aria-label="LinkedIn">
                                <Linkedin className="h-5 w-5" />
                            </SiteInfo>
                            <SiteInfo type="youtube" asLink className="hover:text-blue-400 transition-colors" aria-label="YouTube">
                                <Youtube className="h-5 w-5" />
                            </SiteInfo> */}
                            <SiteInfo type="email" asLink className="hover:text-blue-400 transition-colors" aria-label="Email">
                                <Mail className="h-5 w-5" />
                            </SiteInfo>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
