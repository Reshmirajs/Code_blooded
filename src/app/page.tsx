"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Music, Users, Palette, BookOpen, Layers, Zap } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/journal/demo');
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbf7] overflow-x-hidden selection:bg-purple-100 selection:text-purple-900 bg-grain">

      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-200/50 bg-[#fdfbf7]/80 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white font-serif italic font-bold text-lg shadow-md group-hover:scale-110 transition-transform duration-300">L</div>
            <span className="self-center text-xl font-serif font-semibold whitespace-nowrap text-gray-900 tracking-tight">Lumin</span>
          </Link>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <Link href="/journal/demo">
              <Button className="rounded-full px-6 bg-gray-900 hover:bg-gray-800 text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="px-4 mx-auto max-w-7xl text-center relative z-10">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/80 border border-blue-100 text-blue-600 text-xs font-medium mb-8 animate-fade-in-up shadow-sm hover:bg-blue-100 hover:scale-105 transition-all cursor-default backdrop-blur-sm">
            <Sparkles size={12} className="animate-pulse text-blue-500" />
            <span className="tracking-wide uppercase">Reimagining Digital Journaling</span>
          </div>

          <h1 className="text-5xl font-serif font-medium tracking-tight text-gray-900 md:text-7xl lg:text-8xl mb-8 animate-fade-in-up [animation-delay:200ms] opacity-0">

            Capture your <br />
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 italic pb-2">
              creative soul.
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-300/50 to-purple-300/50 -rotate-1 rounded-full blur-[1px]"></span>
            </span>
          </h1>

          <p className="mb-10 text-lg font-light text-gray-600 lg:text-xl sm:px-16 lg:px-48 max-w-4xl mx-auto leading-relaxed animate-fade-in-up [animation-delay:400ms] opacity-0">
            Lumin is a collaborative digital journal that blends the nostalgia of physical notebooks with the power of modern technology. Sketch, write, and dream together in an infinite, shared space.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up [animation-delay:600ms] opacity-0">
            <Link href="/journal/demo" className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-gray-900 rounded-full overflow-hidden transition-all hover:bg-gray-800 shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 active:shadow-md min-w-[200px]">
              <span className="relative flex items-center gap-2">
                Start Creating <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </Link>
            <Link href="#features" className="px-8 py-4 text-base font-medium text-gray-600 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full hover:bg-white hover:border-gray-300 transition-all shadow-sm hover:shadow-md hover:-translate-y-1 active:translate-y-0 active:shadow-sm">
              Explore Features
            </Link>
          </div>

        </div>

        {/* Decorative Background Elements */}
        {/* Main Blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-200/40 to-purple-200/40 rounded-full filter blur-3xl -z-10 animate-blob mix-blend-multiply"></div>
        {/* Secondary Blob */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-yellow-200/30 to-orange-100/30 rounded-full filter blur-3xl -z-10 animate-blob animation-delay-2000 mix-blend-multiply"></div>
        {/* Tertiary Blob */}
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-bl from-pink-200/30 to-rose-100/30 rounded-full filter blur-3xl -z-10 animate-blob animation-delay-4000 mix-blend-multiply"></div>

        {/* Grid Overlay for Texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] -z-20 pointer-events-none"></div>
      </section>

      {/* Marquee Section */}
      <div className="w-full bg-gray-900 border-y border-gray-800 overflow-hidden py-3">
        <div className="animate-marquee whitespace-nowrap text-white/80 font-mono text-sm uppercase tracking-widest gap-8">
          <span>Collaboration ✦</span>
          <span>Creativity ✦</span>
          <span>Real-time Sync ✦</span>
          <span>Infinite Canvas ✦</span>
          <span>Music Player ✦</span>
          <span>Stickers ✦</span>
          <span>Export to PDF ✦</span>
          <span>Collaboration ✦</span>
          <span>Creativity ✦</span>
          <span>Real-time Sync ✦</span>
          <span>Infinite Canvas ✦</span>
          <span>Music Player ✦</span>
          <span>Stickers ✦</span>
          <span>Export to PDF ✦</span>
          <span>Collaboration ✦</span>
          <span>Creativity ✦</span>
          <span>Real-time Sync ✦</span>
          <span>Infinite Canvas ✦</span>
          <span>Music Player ✦</span>
          <span>Stickers ✦</span>
          <span>Export to PDF ✦</span>
        </div>
      </div>


      {/* Feature Section with Cards */}
      <section id="features" className="py-24 bg-white/40 backdrop-blur-sm border-t border-gray-100 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up opacity-0 [animation-delay:800ms]">
            <h2 className="text-3xl font-serif font-medium text-gray-900 mb-4 tracking-tight">Crafted for creativity</h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-light text-lg">Everything you need to express yourself, alone or with friends.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Palette size={24} className="text-orange-600" />}
              title="Infinite Canvas"
              description="Draw, paint, and design without limits. Your pages are your playground, supporting rich media and complex sketches."
              color="bg-orange-50"
              delay="0ms"
            />
            <FeatureCard
              icon={<Users size={24} className="text-blue-600" />}
              title="Real-time Collaboration"
              description="Invite friends to your journal. See their cursors and edits live as you create together in perfect sync."
              color="bg-blue-50"
              delay="100ms"
            />
            <FeatureCard
              icon={<Music size={24} className="text-purple-600" />}
              title="Ambient Atmosphere"
              description="Built-in lo-fi music player sets the perfect mood for your writing sessions, syncing across all collaborators."
              color="bg-purple-50"
              delay="200ms"
            />
            <FeatureCard
              icon={<BookOpen size={24} className="text-emerald-600" />}
              title="Tactile Experience"
              description="Enjoy the satisfying feeling of flipping pages in a digital book, bringing the physical joy of reading online."
              color="bg-emerald-50"
              delay="300ms"
            />
            <FeatureCard
              icon={<Layers size={24} className="text-rose-600" />}
              title="Rich Media Support"
              description="Drag and drop stickers, images, and shapes. Customize your journal with a vast library of aesthetic assets."
              color="bg-rose-50"
              delay="400ms"
            />
            <FeatureCard
              icon={<Zap size={24} className="text-amber-600" />}
              title="Instant Sharing"
              description="Export your journal as a PDF or share a read-only link with the world. Your creativity deserves to be seen."
              color="bg-amber-50"
              delay="500ms"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <div className="bg-gray-900 rounded-3xl p-12 md:p-20 shadow-2xl relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800 to-black z-0"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-colors duration-500"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-colors duration-500"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-serif font-medium text-white mb-6 tracking-tight">Ready to verify your ideas?</h2>
              <p className="text-gray-300 mb-10 max-w-xl mx-auto text-lg font-light">Join thousands of creators who use Lumin to document their journey. It's free and open source.</p>

              <Link href="/journal/demo">
                <Button className="rounded-full px-8 py-6 bg-white text-gray-900 hover:bg-gray-100 hover:text-black text-lg font-medium transition-all shadow-lg hover:shadow-white/20 hover:-translate-y-1">
                  Start Journaling Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#fdfbf7] border-t border-gray-200/60 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white font-serif italic text-sm">L</div>
                <span className="text-xl font-serif font-semibold text-gray-900">Lumin Journal</span>
              </div>
              <p className="text-gray-500 font-light leading-relaxed max-w-xs">
                A digital sanctuary for your thoughts. Built with ❤️ for the Hackathon.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-gray-500 font-light text-sm">
                <li><a href="#" className="hover:text-gray-900 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Templates</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-gray-500 font-light text-sm">
                <li><a href="#" className="hover:text-gray-900 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-gray-900 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200/60 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400 font-light">
              © 2024 Lumin Journal. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors"><span className="sr-only">Twitter</span><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path></svg></a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors"><span className="sr-only">GitHub</span><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color, delay }: { icon: any, title: string, description: string, color: string, delay: string }) {
  return (
    <div className={`group p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up opacity-0`} style={{ animationDelay: delay }}>
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ease-in-out`}>
        {icon}
      </div>
      <h3 className="text-xl font-serif font-medium text-gray-900 mb-3 group-hover:text-[#1e1b4b] transition-colors">{title}</h3>
      <p className="text-gray-500 leading-relaxed font-light text-sm">{description}</p>
    </div>
  )
}
