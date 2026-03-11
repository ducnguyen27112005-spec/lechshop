"use client";

import { useState, useEffect, useRef } from "react";
import Container from "@/components/shared/Container";
import {
    MousePointerClick,
    UserPlus,
    Percent,
    Wallet,
    BookOpen,
    BarChart3,
    History,
    Landmark,
    Copy,
    Facebook,
    Linkedin,
    Instagram,
    Inbox,
    Search,
    ChevronDown,
    Check
} from "lucide-react";

export default function AffiliateDashboardPage() {
    const [activeTab, setActiveTab] = useState("chinh-sach");
    const [copied, setCopied] = useState(false);
    const [referralLink, setReferralLink] = useState("https://lechshop.com/ref/39568");

    // Bank Dropdown State
    const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
    const [searchBankTerm, setSearchBankTerm] = useState("");
    const [selectedBank, setSelectedBank] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const BANKS = [
        { value: "VietinBank", label: "Ngân hàng CTG - VietinBank" },
        { value: "Vietcombank", label: "Ngân hàng VCB - Vietcombank" },
        { value: "BIDV", label: "Ngân hàng BIDV - BIDV" },
        { value: "Agribank", label: "Ngân hàng VBA - Agribank" },
        { value: "OCB", label: "Ngân hàng OCB - OCB" },
        { value: "MBBank", label: "Ngân hàng MB - MBBank" },
        { value: "Techcombank", label: "Ngân hàng TCB - Techcombank" },
        { value: "ACB", label: "Ngân hàng ACB - ACB" },
        { value: "VPBank", label: "Ngân hàng VPB - VPBank" },
        { value: "TPBank", label: "Ngân hàng TPB - TPBank" },
        { value: "Sacombank", label: "Ngân hàng STB - Sacombank" },
        { value: "HDBank", label: "Ngân hàng HDB - HDBank" },
        { value: "VietCapitalBank", label: "Ngân hàng VCCB - VietCapitalBank" },
        { value: "SCB", label: "Ngân hàng SCB - SCB" },
        { value: "VIB", label: "Ngân hàng VIB - VIB" },
        { value: "SHB", label: "Ngân hàng SHB - SHB" },
        { value: "Eximbank", label: "Ngân hàng EIB - Eximbank" },
        { value: "MSB", label: "Ngân hàng MSB - MSB" },
        { value: "CAKE", label: "Ngân hàng CAKE - CAKE" },
        { value: "KienLongBank", label: "Ngân hàng KLB - KienLongBank" },
        { value: "KBank", label: "Ngân hàng KBank - KBank" },
        { value: "VRB", label: "Ngân hàng VRB - VRB" },
        { value: "StandardChartered", label: "Ngân hàng SCVN - StandardChartered" },
        { value: "Nonghyup", label: "Ngân hàng NHB HN - Nonghyup" },
        { value: "IndovinaBank", label: "Ngân hàng IVB - IndovinaBank" },
        { value: "IBKHCM", label: "Ngân hàng IBK - HCM - IBKHCM" },
        { value: "KookminHCM", label: "Ngân hàng KBHCM - KookminHCM" },
        { value: "KookminHN", label: "Ngân hàng KBHN - KookminHN" },
        { value: "Woori", label: "Ngân hàng WVN - Woori" },
        { value: "HSBC", label: "Ngân hàng HSBC - HSBC" },
        { value: "CBBank", label: "Ngân hàng CBB - CBBank" },
        { value: "IBKHN", label: "Ngân hàng IBK - HN - IBKHN" },
        { value: "CIMB", label: "Ngân hàng CIMB - CIMB" },
        { value: "DBSBank", label: "Ngân hàng DBS - DBSBank" },
        { value: "DongABank", label: "Ngân hàng DOB - DongABank" },
        { value: "GPBank", label: "Ngân hàng GPB - GPBank" },
        { value: "PublicBank", label: "Ngân hàng PBVN - PublicBank" },
        { value: "UnitedOverseas", label: "Ngân hàng UOB - UnitedOverseas" },
        { value: "HongLeong", label: "Ngân hàng HLBVN - HongLeong" },
    ];

    const filteredBanks = BANKS.filter(bank =>
        bank.label.toLowerCase().includes(searchBankTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsBankDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setReferralLink(`${window.location.origin}/ref/39568`);
        }
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="py-12 bg-gray-50/50 min-h-screen">
            <Container>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center h-28 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-2">
                            <MousePointerClick className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="text-gray-500 text-sm font-medium">Tổng lượt Click</div>
                        <div className="text-2xl font-bold text-gray-900 mt-1">0</div>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center h-28 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-2">
                            <UserPlus className="w-5 h-5 text-green-500" />
                            <span className="text-xl font-bold text-gray-900">0</span>
                        </div>
                        <div className="text-gray-500 text-sm font-medium">Lượt đăng ký</div>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center h-28 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-2">
                            <Percent className="w-5 h-5 text-amber-500" />
                            <span className="text-xl font-bold text-gray-900">10%</span>
                        </div>
                        <div className="text-gray-500 text-sm font-medium">Phần trăm thưởng</div>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center h-28 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-2">
                            <Wallet className="w-5 h-5 text-red-500" />
                            <span className="text-xl font-bold text-gray-900">0đ</span>
                        </div>
                        <div className="text-gray-500 text-sm font-medium">Số dư hoa hồng</div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Tabs */}
                    <div className="flex flex-wrap border-b border-gray-100">
                        <button
                            onClick={() => setActiveTab("chinh-sach")}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'chinh-sach' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                        >
                            <BookOpen className="w-4 h-4" />
                            Chính sách
                        </button>
                        <button
                            onClick={() => setActiveTab("thong-ke")}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'thong-ke' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                        >
                            <BarChart3 className="w-4 h-4" />
                            Thống kê
                        </button>
                        <button
                            onClick={() => setActiveTab("lich-su")}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'lich-su' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                        >
                            <History className="w-4 h-4" />
                            Lịch sử giới thiệu
                        </button>
                        <button
                            onClick={() => setActiveTab("rut-tien")}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'rut-tien' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
                        >
                            <Landmark className="w-4 h-4" />
                            Rút tiền
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6 md:p-8">
                        {/* TAB 1: CHÍNH SÁCH */}
                        {activeTab === 'chinh-sach' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
                                    <p className="font-medium text-gray-900">Giới thiệu Chương Trình Tiếp Thị Liên Kết của LECHSHOP – cơ hội kiếm thu nhập thụ động đơn giản!</p>
                                    <p>Chỉ cần đăng ký, nhận liên kết giới thiệu cá nhân và chia sẻ tới bạn bè, cộng đồng hoặc khách hàng của bạn.</p>
                                    <p>Mỗi khi người bạn giới thiệu phát sinh giao dịch trên hệ thống, bạn nhận hoa hồng <span className="font-bold text-red-600">10%</span></p>
                                    <p>Không yêu cầu vốn, không ràng buộc phức tạp – phù hợp cho mọi đối tượng sáng tạo nội dung và chủ cửa hàng</p>
                                    <p>Bảng điều khiển minh bạch giúp theo dõi số lượt click, đơn hàng và tổng hoa hồng theo thời gian thực</p>
                                    <p>Thanh toán hoa hồng theo chính sách hiện hành của LECHSHOP với rút tối thiểu 50.000 VNĐ</p>
                                    <p>Tham gia ngay hôm nay để biến mạng lưới của bạn thành nguồn doanh thu bền vững!</p>
                                    <p>Đăng ký liên kết tại LECHSHOP và bắt đầu nhận ưu đãi cho mỗi giao dịch từ người được bạn giới thiệu</p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-4">Liên kết giới thiệu của bạn</h3>
                                    <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                        Sao chép liên kết của bạn và bắt đầu kiếm phần thưởng! Hãy chia sẻ để nhận hoa hồng khi người khác đăng ký và sử dụng dịch vụ tại LECHSHOP - Top 1 Dịch Vụ Số Việt Nam! Để hiểu đầy đủ các điều khoản và chính sách Affiliate.
                                    </p>
                                    <div className="flex border border-gray-200 rounded-md overflow-hidden bg-gray-50 w-full max-w-md mb-6 shadow-sm">
                                        <input type="text" readOnly value={referralLink} className="px-4 py-3 bg-transparent text-gray-700 text-sm flex-1 outline-none min-w-0" />
                                        <button onClick={copyToClipboard} className="px-5 py-3 bg-[#5bc0de] hover:bg-[#46b8da] text-white transition-colors flex items-center justify-center min-w-[3rem]" title="Sao chép">
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors border border-blue-100"><Facebook className="w-5 h-5" /></button>
                                        <button className="w-10 h-10 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center hover:bg-sky-600 hover:text-white transition-colors border border-sky-100"><Linkedin className="w-5 h-5" /></button>
                                        <button className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-colors border border-pink-100"><Instagram className="w-5 h-5" /></button>
                                    </div>
                                    {copied && <p className="text-sm text-green-600 mt-4 font-medium animate-pulse">Đã sao chép liên kết thành công!</p>}
                                </div>
                            </div>
                        )}

                        {/* TAB 2: THỐNG KÊ */}
                        {activeTab === 'thong-ke' && (
                            <div className="w-full overflow-x-auto pb-4">
                                <div className="min-w-[700px]">
                                    {/* Chart Y-Axis / Grid */}
                                    <div className="relative h-64 border-l border-b border-gray-200 ml-4 mb-6 pt-4 text-xs">
                                        {[5, 4, 3, 2, 1].map((val) => (
                                            <div key={val} className="absolute w-full border-t border-gray-100" style={{ bottom: `${(val / 5) * 100}%` }}>
                                                <span className="absolute -left-6 -top-2.5 text-gray-400 font-medium w-4 text-right">{val}</span>
                                            </div>
                                        ))}
                                        {/* Baseline 0 */}
                                        <div className="absolute w-full border-t-2 border-[#5cb85c]" style={{ bottom: '0%' }}>
                                            <span className="absolute -left-6 -top-2.5 text-gray-400 font-medium w-4 text-right">0</span>
                                        </div>

                                        {/* Chart Interaction Columns */}
                                        <div className="absolute inset-x-0 top-0 bottom-0 flex">
                                            {['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11'].map((month, index) => (
                                                <div key={month} className="flex-1 h-full relative group cursor-pointer z-10">
                                                    {/* Hover highlight line */}
                                                    <div className="absolute hidden group-hover:block left-1/2 -ml-[1px] top-0 bottom-0 border-l border-dashed border-gray-300 pointer-events-none"></div>

                                                    {/* Dot at 0 */}
                                                    <div className="absolute hidden group-hover:block left-1/2 -ml-[5px] w-2.5 h-2.5 bg-[#5cb85c] rounded-full border border-white z-20 pointer-events-none" style={{ bottom: '-5px' }}></div>

                                                    {/* Tooltip Popup */}
                                                    <div
                                                        className={`absolute hidden group-hover:block bottom-4 w-[160px] bg-white border border-gray-200 shadow-md rounded-md overflow-hidden z-30 pointer-events-none transition-opacity duration-200
                                                        ${index > 8 ? 'right-1/2 mr-2' : 'left-1/2 ml-2'}`}
                                                    >
                                                        <div className="bg-gray-100 px-3 py-1.5 text-[13px] font-medium text-gray-700 border-b border-gray-100">
                                                            {month}
                                                        </div>
                                                        <div className="px-3 py-2 text-[13px] text-gray-600 flex items-center gap-2">
                                                            <div className="w-2.5 h-2.5 rounded-full bg-[#5cb85c]"></div>
                                                            Số người dùng: 0
                                                        </div>
                                                    </div>

                                                    {/* X-Axis Label Highlightable Box */}
                                                    <div className="absolute top-[100%] left-0 right-0 pt-[10px] text-center text-xs text-gray-500 font-medium">
                                                        <div className="inline-block px-3 py-1.5 rounded-sm border border-transparent group-hover:bg-slate-200 group-hover:border-slate-300 group-hover:text-gray-800 transition-colors">
                                                            {month}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: LỊCH SỬ GIỚI THIỆU */}
                        {activeTab === 'lich-su' && (
                            <div className="w-full">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th scope="col" className="px-6 py-4 font-semibold">STT</th>
                                                <th scope="col" className="px-6 py-4 font-semibold text-center">Khách hàng</th>
                                                <th scope="col" className="px-6 py-4 font-semibold text-right">Ngày đăng ký</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>

                                {/* Empty State */}
                                <div className="py-20 flex flex-col items-center justify-center text-gray-300 gap-4">
                                    <div className="relative">
                                        <Inbox className="w-20 h-20 opacity-40 text-slate-400" />
                                        <div className="absolute -top-1 -right-2 bg-slate-200 rounded-full w-6 h-6 flex items-center justify-center opacity-80">
                                            <span className="block w-3 h-0.5 bg-slate-400 rounded-full"></span>
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-sm font-medium">Chưa có dữ liệu</p>
                                </div>
                            </div>
                        )}

                        {/* TAB 4: RÚT TIỀN */}
                        {activeTab === 'rut-tien' && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                {/* Withdraw Form */}
                                <div className="lg:col-span-4 space-y-6">
                                    <h3 className="font-bold text-gray-800 uppercase tracking-wide">RÚT TIỀN</h3>

                                    <div className="space-y-1 text-sm italic font-medium">
                                        <p className="text-red-500">Số tiền có thể rút: từ 100,000 đ đến 1,000,000 đ</p>
                                        <p className="text-amber-500">Số dư có thể rút của bạn là: 0đ</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Số Tiền Rút</label>
                                            <input type="text" placeholder="Nhập số tiền muốn rút..." className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                                        </div>
                                        <div className="relative" ref={dropdownRef}>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ngân Hàng</label>
                                            <div
                                                onClick={() => setIsBankDropdownOpen(!isBankDropdownOpen)}
                                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm cursor-pointer flex items-center justify-between hover:border-gray-400 transition-all"
                                            >
                                                <span className={selectedBank ? "text-gray-900" : "text-gray-500"}>
                                                    {selectedBank ? BANKS.find(b => b.value === selectedBank)?.label : "Chọn Ngân Hàng Rút"}
                                                </span>
                                                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isBankDropdownOpen ? 'rotate-180' : ''}`} />
                                            </div>

                                            {isBankDropdownOpen && (
                                                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                                                    <div className="p-2 border-b border-gray-100 flex items-center gap-2">
                                                        <Search className="w-4 h-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            placeholder="Tìm kiếm ngân hàng..."
                                                            className="w-full text-sm outline-none bg-transparent"
                                                            value={searchBankTerm}
                                                            onChange={(e) => setSearchBankTerm(e.target.value)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            autoFocus
                                                        />
                                                    </div>
                                                    <div className="max-h-60 overflow-y-auto p-1">
                                                        {filteredBanks.length > 0 ? (
                                                            filteredBanks.map((bank) => (
                                                                <div
                                                                    key={bank.value}
                                                                    onClick={() => {
                                                                        setSelectedBank(bank.value);
                                                                        setIsBankDropdownOpen(false);
                                                                        setSearchBankTerm("");
                                                                    }}
                                                                    className={`px-3 py-2.5 text-sm rounded-sm cursor-pointer flex items-center justify-between hover:bg-gray-50 transition-colors ${selectedBank === bank.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
                                                                >
                                                                    {bank.label}
                                                                    {selectedBank === bank.value && <Check className="w-4 h-4" />}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="px-3 py-4 text-sm text-center text-gray-500">
                                                                Không tìm thấy ngân hàng
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Số Tài Khoản</label>
                                                <input type="text" placeholder="Nhập số tài khoản" className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Chủ Tài Khoản</label>
                                                <input type="text" placeholder="Nhập tên chủ tài khoản" className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                                            </div>
                                        </div>
                                        <button className="w-full py-3 mt-2 bg-[#5bc0de] hover:bg-[#46b8da] text-white font-medium rounded-md transition-colors">
                                            Rút Tiền Ngay
                                        </button>
                                    </div>
                                </div>

                                {/* Withdraw History */}
                                <div className="lg:col-span-8 space-y-6">
                                    <h3 className="font-bold text-gray-800 uppercase tracking-wide">LỊCH SỬ RÚT TIỀN</h3>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-center border-collapse">
                                            <thead className="text-xs text-gray-700 bg-white border-b border-gray-200">
                                                <tr>
                                                    <th className="px-4 py-3 font-semibold w-16">ID</th>
                                                    <th className="px-4 py-3 font-semibold">Số Tiền</th>
                                                    <th className="px-4 py-3 font-semibold">Ngân Hàng</th>
                                                    <th className="px-4 py-3 font-semibold">Tài Khoản</th>
                                                    <th className="px-4 py-3 font-semibold">Chủ Tài Khoản</th>
                                                    <th className="px-4 py-3 font-semibold">Trạng Thái</th>
                                                    <th className="px-4 py-3 font-semibold">Ghi chú (Lý do)</th>
                                                    <th className="px-4 py-3 font-semibold">Ngày tạo</th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>

                                    {/* Empty State */}
                                    <div className="py-16 flex flex-col items-center justify-center text-gray-300 gap-4 border-t border-gray-50">
                                        <div className="relative">
                                            <Inbox className="w-16 h-16 opacity-30 text-slate-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </Container>
        </div>
    );
}
