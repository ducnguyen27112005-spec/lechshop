import HeroSlider from "@/components/home/HeroSlider";
import ProductSections from "@/components/home/ProductSections";
import CategoryMenu from "@/components/home/CategoryMenu";
import RightBanners from "@/components/home/RightBanners";

export default function Home() {
  return (
    <>
      {/* Visual Separator */}
      <div className="border-t border-gray-200"></div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Categories */}
          <div className="hidden lg:block lg:col-span-2">
            <CategoryMenu />
          </div>

          {/* Center Column: Main Slider */}
          <div className="lg:col-span-8">
            <HeroSlider />
          </div>

          {/* Right Column: Promotional Banners */}
          <div className="hidden lg:block lg:col-span-2">
            <RightBanners />
          </div>
        </div>
      </div>

      <ProductSections />
    </>
  );
}
