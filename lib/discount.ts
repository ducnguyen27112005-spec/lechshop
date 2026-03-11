/**
 * Generate a student discount code in the format: SV-XXXXXX
 * where X is a random uppercase letter or digit.
 */
export function generateStudentCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "SV-";
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
