import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Service {
    title: string;
    slug: string;
    shortDescription: string | null;
    coverImageUrl: string | null;
}

interface Category {
    name: string;
    slug: string;
    services: Service[];
}

export function SocialPlatformView({ category }: { category: Category }) {
    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
                <p className="opacity-90">Chọn dịch vụ bạn cần hỗ trợ dưới đây</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.services.map((service) => (
                    <Link
                        key={service.slug}
                        href={`/san-pham/${service.slug}`}
                        className="group bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all hover:border-blue-200"
                    >
                        <div className="flex items-start gap-4 mb-4">
                            {service.coverImageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={service.coverImageUrl}
                                    alt={service.title}
                                    className="w-12 h-12 rounded-full object-cover bg-gray-100"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl">
                                    {service.title.charAt(0)}
                                </div>
                            )}
                            <div>
                                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {service.title}
                                </h3>
                                {service.shortDescription && (
                                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                                        {service.shortDescription}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center text-sm font-medium text-blue-600 bg-blue-50 w-fit px-3 py-1.5 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all">
                            Chọn dịch vụ
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                    </Link>
                ))}

                {category.services.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
                        Chưa có dịch vụ nào trong danh mục này.
                    </div>
                )}
            </div>
        </div>
    );
}
