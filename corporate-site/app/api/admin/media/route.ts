import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, readdir, stat, unlink } from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// GET: list all uploaded images
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const files = await readdir(UPLOAD_DIR);
        const imageExts = [".png", ".jpg", ".jpeg", ".jfif", ".gif", ".webp", ".svg", ".mp4"];
        const imageFiles = files.filter((f) =>
            imageExts.some((ext) => f.toLowerCase().endsWith(ext))
        );

        const results = await Promise.all(
            imageFiles.map(async (filename) => {
                const filePath = path.join(UPLOAD_DIR, filename);
                const fileStat = await stat(filePath);
                return {
                    filename,
                    url: `/uploads/${filename}`,
                    size: fileStat.size,
                    uploadedAt: fileStat.mtime.toISOString(),
                };
            })
        );

        // Sort by newest first
        results.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

        return NextResponse.json(results);
    } catch (error) {
        return NextResponse.json([]);
    }
}

// POST: upload image
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = [
            "image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml",
            "video/mp4"
        ];
        // JFIF files are JPEG — also allow by extension if MIME doesn't match
        const fileExt = path.extname(file.name).toLowerCase();
        const allowedExts = [".png", ".jpg", ".jpeg", ".jfif", ".gif", ".webp", ".svg", ".mp4"];
        if (!allowedTypes.includes(file.type) && !allowedExts.includes(fileExt)) {
            return NextResponse.json(
                { error: "File type not supported. Use PNG, JPG, JFIF, GIF, WEBP, SVG, or MP4." },
                { status: 400 }
            );
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: "File too large. Maximum 10MB." },
                { status: 400 }
            );
        }

        // Generate unique filename
        const ext = path.extname(file.name);
        const baseName = path.basename(file.name, ext)
            .replace(/[^a-zA-Z0-9_-]/g, "_")
            .substring(0, 50);
        const timestamp = Date.now();
        const filename = `${baseName}_${timestamp}${ext}`;

        // Write file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(path.join(UPLOAD_DIR, filename), buffer);

        return NextResponse.json({
            filename,
            url: `/uploads/${filename}`,
            size: file.size,
            uploadedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}

// DELETE: delete an image
export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const filename = searchParams.get("filename");

        if (!filename) {
            return NextResponse.json({ error: "No filename" }, { status: 400 });
        }

        // Security: prevent path traversal
        const safeName = path.basename(filename);
        const filePath = path.join(UPLOAD_DIR, safeName);
        await unlink(filePath);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
}
