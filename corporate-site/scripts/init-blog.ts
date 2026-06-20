import { PrismaClient } from "../generated/client";

async function main() {
    const prisma = new PrismaClient();

    try {
        // 1. Ensure default category exists
        let category = await prisma.category.findFirst({
            where: { slug: "tin-tuc" }
        });

        if (!category) {
            category = await prisma.category.create({
                data: {
                    name: "Tin tức",
                    slug: "tin-tuc",
                    status: "active"
                }
            });
            console.log("Created default category: Tin tức");
        }

        // 2. Ensure default tag exists (optional)
        let tag = await prisma.tag.findFirst({
            where: { slug: "tin-moi" }
        });
        if (!tag) {
            tag = await prisma.tag.create({
                data: { name: "Tin mới", slug: "tin-moi" }
            });
            console.log("Created default tag: Tin mới");
        }

        // 3. Update all posts missing categoryId
        // Note: Since we made categoryId mandatory in the schema, 
        // we should have at least one category to link them to.
        const posts = await prisma.post.findMany();
        for (const post of posts) {
            await prisma.post.update({
                where: { id: post.id },
                data: {
                    categoryId: category.id,
                    status: post.status || "PUBLISHED",
                    viewCount: post.viewCount || 0,
                    isFeatured: post.isFeatured || false
                }
            });
        }
        console.log(`Updated ${posts.length} posts with default category and fields.`);

    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
