import Navbar from "../nav/NavBar";
import HeroSlideshow from "./HeroSlideshow";

export default function HeroSection() {
  return (
    <section className="h-screen flex flex-col bg-gray-900 ">
      <Navbar />
      <HeroSlideshow />
    </section>
  );
}
