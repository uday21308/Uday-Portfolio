import { Nav } from "@/components/ui/Nav";
import { Grain } from "@/components/ui/Grain";
import { Footer } from "@/components/ui/Footer";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { AnimatedDivider } from "@/components/sections/AnimatedDivider";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Credentials } from "@/components/sections/Credentials";
import { Contact } from "@/components/sections/Contact";
import { PixelSprite } from "@/components/ui/PixelSprite";

export default function Page() {
  return (
    <>
      <Grain />
      <Nav />
      <main>
        <Hero />
        <About />
        <AnimatedDivider number="01" label="Selected Work" titleLine1="Built in" titleLine2="*production.*" />
        <Experience />
        <AnimatedDivider number="02" label="Projects" titleLine1="Things" titleLine2="I *built.*" />
        <Projects />
        <AnimatedDivider number="03" label="Stack" titleLine1="Tools of" titleLine2="the *trade.*" />
        <Skills />
        <Credentials />
        <Contact />
      </main>
      <Footer />
      <PixelSprite />
    </>
  );
}
