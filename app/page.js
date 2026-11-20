import BannerSlider from "@/components/BannerSlider";
import Marquee from "@/components/Marquee";
import Categories from "@/components/Categories";
import ProductRow from "@/components/ProductRow";
import DeliverySection from "@/components/DeliverySection";

export default function Home() {
  return (
    <>
      <BannerSlider />
      <Marquee />
      <Categories />
      <ProductRow title="Trending in Bangladesh" subtitle="Hand-picked by our team" query="trending=1" href="/all-products" />
      <ProductRow title="New Arrivals" subtitle="Fresh styles just landed" query="isNew=1" href="/all-products?isNew=1" />
      <DeliverySection />
    </>
  );
}
