import nodemailer from 'nodemailer';

// Configure the SMTP transporter
// The environment variables should ideally be set in your .env.local file
// Example:
// SMTP_HOST=smtp.gmail.com
// SMTP_PORT=465
// SMTP_USER=your-email@gmail.com
// SMTP_PASS=your-app-password
// SMTP_FROM=LechShop <no-reply@lechshop.vn>

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'false' ? false : true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
    },
});

interface SendMailOptions {
    to: string;
    subject: string;
    html: string;
}

/**
 * Sends an email using the configured SMTP transporter.
 * If SMTP credentials are not properly set, it mocks the email sending in the console.
 */
export const sendEmail = async ({ to, subject, html }: SendMailOptions) => {
    // If no transport credentials are provided, just mock it out so the app doesn't crash during dev/demo
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn('⚠️ SMTP_USER or SMTP_PASS is not configured. Email will be mocked.');
        console.log('=================================');
        console.log(`[MOCK EMAIL TO]: ${to}`);
        console.log(`[SUBJECT]: ${subject}`);
        console.log(`[BODY]\n${html}`);
        console.log('=================================');
        return { success: true, mocked: true };
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || `"LechShop Admin" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });

        console.log('Message sent: %s', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
};

/**
 * Pre-defined template for sending Student Discount Code email
 */
export const sendStudentDiscountEmail = async (
    toEmail: string,
    fullName: string,
    couponCode: string,
    discountPercent: number,
    expiredAtStr: string
) => {
    const subject = `Mã quà tặng ${discountPercent}% học phí sinh viên tại LechShop`;

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
        <div style="background-color: #2563eb; padding: 24px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Xác Nhận Ưu Đãi Sinh Viên</h1>
        </div>
        
        <div style="padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <p>Chào bạn <strong>${fullName}</strong>,</p>
            <p>Đơn yêu cầu xác thực thẻ sinh viên của bạn đã được duyệt thành công!</p>
            
            <div style="background-color: #f3f4f6; border-left: 4px solid #2563eb; padding: 16px; margin: 24px 0; border-radius: 4px;">
                <p style="margin-top: 0;">Mã giảm giá dành riêng cho bạn:</p>
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 2px; color: #1e40af; text-align: center; margin: 16px 0; padding: 12px; background: white; border: 2px dashed #93c5fd; border-radius: 8px;">
                    ${couponCode}
                </div>
                <ul style="margin-bottom: 0; padding-left: 20px; color: #4b5563; font-size: 14px;">
                    <li>Mức giảm: <strong>${discountPercent}%</strong></li>
                    <li>Hạn sử dụng: <strong>${expiredAtStr}</strong></li>
                    <li>Chỉ áp dụng cho email đăng ký hợp lệ.</li>
                </ul>
            </div>
            
            <h3 style="color: #1f2937; margin-bottom: 12px;">Hướng dẫn sử dụng:</h3>
            <ol style="padding-left: 20px; margin-bottom: 24px; color: #4b5563;">
                <li>Chọn sản phẩm dịch vụ hoặc gói cước mong muốn.</li>
                <li>Đang ở trang Thanh Toán, nhập mã <strong>${couponCode}</strong> vào ô Mã ưu đãi.</li>
                <li>Hệ thống sẽ tự xác nhận email của bạn và trừ tiền vào giỏ hàng.</li>
            </ol>
            
            <p style="font-size: 13px; color: #6b7280; font-style: italic; border-top: 1px solid #e5e7eb; padding-top: 16px;">
                *Lưu ý: Mã này chỉ áp dụng 1 lượt và được cấp phát dựa trên trạng thái xác thực. Với các đăng ký dịch vụ đăng ký theo tháng/năm, mỗi thời kỳ gói cước bạn chỉ dùng ưu đãi 1 lần để chống tình trạng đầu cơ gói.
            </p>
        </div>
        
        <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #9ca3af;">
            <p>© ${new Date().getFullYear()} LechShop. All rights reserved.</p>
        </div>
    </div>
    `;

    return sendEmail({ to: toEmail, subject, html });
};
