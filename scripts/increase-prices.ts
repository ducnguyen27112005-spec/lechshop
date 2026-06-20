import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "products-config.json");

function increasePrices() {
    if (!fs.existsSync(DATA_FILE)) {
        console.log("No products config found at", DATA_FILE);
        return;
    }
    
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    
    if (!parsed.products) return;
    
    parsed.products = parsed.products.map((p: any) => {
        if (p.plans) {
            p.plans = p.plans.map((plan: any) => {
                const increaseMultiplier = 1.2;
                plan.price = Math.round(plan.price * increaseMultiplier);
                if (plan.originalPrice) {
                    plan.originalPrice = Math.round(plan.originalPrice * increaseMultiplier);
                }
                return plan;
            });
        }
        return p;
    });
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2), "utf-8");
    console.log("Successfully increased prices in products-config.json by 20%");
}

increasePrices();
