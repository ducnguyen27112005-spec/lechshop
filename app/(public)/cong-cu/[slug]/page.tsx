import { products } from "@/content/products";
import Container from "@/components/shared/Container";
import { routes } from "@/lib/routes";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// 3) Data definition (Rich Content)
const categoryData: Record<string, {
    title: string;
    description: string;
    productIds: string[];
}> = {
    "giai-tri": {
        title: "Giải trí cao cấp",
        description: "Nâng tầm trải nghiệm giải trí với các tài khoản Premium chất lượng cao, hình ảnh 4K, không quảng cáo.",
        productIds: ["netflix-premium", "youtube-premium"]
    },
    "cong-cu-ai": {
        title: "kho Công Cụ AI Thông Minh",
        description: "Tổng hợp các trợ lý trí tuệ nhân tạo (AI) hàng đầu thế giới, giúp bạn giải quyết công việc phức tạp chỉ trong vài giây. Từ viết lách, lập trình, phân tích dữ liệu đến sáng tạo nghệ thuật – đây là những giải pháp 'phải có' để bạn dẫn đầu trong kỷ nguyên số.",
        productIds: ["chatgpt-plus", "gemini-pro"]
    },
    "sang-tao": {
        title: "Thiết kế & Đồ họa",
        description: "Công cụ hỗ trợ thiết kế, biên tập video và sáng tạo nội dung chuyên nghiệp dành cho Designer và Content Creator.",
        productIds: ["capcut-pro", "canva-pro"]
    },
    "lam-viec": {
        title: "Làm việc & Văn phòng",
        description: "Tối ưu hóa hiệu suất làm việc với bộ công cụ văn phòng và quản lý dự án hàng đầu.",
        productIds: ["microsoft-365", "zoom-pro", "google-one"]
    },
    "hoc-tap": {
        title: "Học tập & Nghiên cứu",
        description: "Tiếp cận kho tri thức nhân loại và nâng cao kỹ năng ngoại ngữ với các tài khoản học tập uy tín.",
        productIds: ["duolingo", "coursera", "udemy"]
    },
    "marketing": {
        title: "Kinh doanh & Marketing",
        description: "Giải pháp hỗ trợ quảng cáo và tiếp thị kỹ thuật số hiệu quả cho doanh nghiệp.",
        productIds: ["facebook-ads", "google-ads"]
    },
    "mxh": {
        title: "Tăng tương tác MXH",
        description: "Dịch vụ tăng tương tác, follow và like cho các nền tảng mạng xã hội phổ biến.",
        productIds: ["sub-youtube", "follow-facebook", "follow-tiktok", "follow-instagram"]
    },
    "phan-mem": {
        title: "Phần mềm bản quyền",
        description: "Cung cấp key bản quyền phần mềm chính hãng, bảo mật và ổn định.",
        productIds: ["windows-11", "kaspersky"]
    },
    "ban-chay": {
        title: "Dịch vụ bán chạy",
        description: "Những sản phẩm và dịch vụ được khách hàng tin dùng và lựa chọn nhiều nhất.",
        productIds: ["netflix-premium", "chatgpt-plus", "youtube-premium", "canva-pro"]
    },
    "khac": {
        title: "Các sản phẩm khác",
        description: "Khám phá thêm các sản phẩm và dịch vụ tiện ích khác.",
        productIds: []
    }
};

export default async function CategoryPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const category = categoryData[params.slug];

    if (!category) {
        return notFound();
    }

    // Filter products
    const categoryProducts = products.filter(p => category.productIds.includes(p.id));

    return (
        <section className="py-16 bg-gray-50 min-h-screen">
            <Container>
                {/* Header Section */}
                <div className="mb-12 text-center max-w-3xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 capitalize">
                        {category.title}
                    </h1>
                    <div className="h-1 w-20 bg-red-600 mx-auto rounded-full mb-6"></div>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        {category.description}
                    </p>
                </div>

                {/* Product Grid */}
                {categoryProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {categoryProducts.map((product) => (
                            <Link
                                href={`${routes.products}/${product.slug}`}
                                key={product.id}
                                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group border border-gray-100 relative block"
                            >
                                {/* Image Section */}
                                <div className="aspect-video bg-gray-900 flex items-center justify-center relative overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {/* Content Section */}
                                <div className="p-3">
                                    {/* Title */}
                                    <h3 className="font-bold text-gray-900 text-sm mb-4 line-clamp-1">
                                        {product.name}
                                    </h3>

                                    {/* Price & Actions */}
                                    <div className="flex items-end justify-between">
                                        <div>
                                            {product.pricing && product.pricing[0] && (
                                                <p className="text-base font-bold text-red-700 leading-none mb-1">
                                                    {product.pricing[0].price}
                                                </p>
                                            )}
                                            <p className="text-[10px] text-gray-500">
                                                {Math.floor(Math.random() * 500) + 100} đã bán
                                            </p>
                                        </div>

                                        {/* Add to Cart Button Icon */}
                                        <div className="bg-red-700 hover:bg-red-800 text-white rounded-full p-2 shadow-md transition-colors">
                                            <ShoppingCart className="h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div className="inline-block p-4 rounded-full bg-gray-50 mb-4">
                            <ShoppingCart className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Đang cập nhật sản phẩm</h3>
                        <p className="text-gray-500 mb-6">Danh mục này hiện đang được chúng tôi bổ sung thêm sản phẩm mới.</p>
                        <Link href="/" className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-colors inline-block">
                            Quay lại trang chủ
                        </Link>
                    </div>
                )}
            </Container>
        </section>
    );
}
