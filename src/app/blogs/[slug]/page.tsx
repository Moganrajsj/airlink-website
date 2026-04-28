import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blogPosts } from '@/data/blogData';
import { ArrowLeft, Calendar, Clock, ChevronRight, Phone, Globe, ExternalLink } from 'lucide-react';
import { LightSectionBg } from '@/components/ui/AnimatedBackground';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) return {};

  return {
    title: `${post.title} | Airlink Broadband`,
    description: post.metaDescription,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Basic Markdown-to-JSX converter for the provided content structure
  const renderContent = (content: string) => {
    return content.split('\n\n').map((block, i) => {
      if (block.startsWith('## ')) {
        return <h2 key={i} className="text-2xl md:text-3xl font-black text-[#0A192F] mt-12 mb-6 tracking-tight">{block.replace('## ', '')}</h2>;
      }
      if (block.startsWith('### ')) {
        return <h3 key={i} className="text-xl md:text-2xl font-black text-[#0A192F] mt-8 mb-4 tracking-tight">{block.replace('### ', '')}</h3>;
      }
      if (block.startsWith('- ')) {
        return (
          <ul key={i} className="space-y-3 mb-6">
            {block.split('\n').map((item, j) => (
              <li key={j} className="flex items-start gap-3 text-[#0A192F]/70 font-medium leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] mt-2.5 flex-shrink-0" />
                <span>{item.replace('- ', '')}</span>
              </li>
            ))}
          </ul>
        );
      }
      if (block.includes('|')) {
        const rows = block.split('\n').filter(r => r.trim() && !r.includes(':---'));
        return (
          <div key={i} className="overflow-x-auto mb-8 my-6">
            <table className="w-full border-collapse rounded-2xl overflow-hidden border border-[#0A192F]/05">
              <thead>
                <tr className="bg-[#0A192F] text-white">
                  {rows[0].split('|').filter(c => c.trim()).map((cell, j) => (
                    <th key={j} className="p-4 text-left text-xs font-black uppercase tracking-widest">{cell.trim()}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {rows.slice(1).map((row, j) => (
                  <tr key={j} className="border-t border-[#0A192F]/05">
                    {row.split('|').filter(c => c.trim()).map((cell, k) => (
                      <td key={k} className="p-4 text-sm font-semibold text-[#0A192F]/60">{cell.trim()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      return <p key={i} className="text-[#0A192F]/70 text-lg leading-relaxed mb-6 font-medium whitespace-pre-wrap">{block}</p>;
    });
  };

  return (
    <main className="min-h-screen pt-32 pb-20 bg-white relative overflow-hidden">
      <LightSectionBg variant="grid" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-black text-[#0A192F]/40 uppercase tracking-widest mb-12">
          <Link href="/" className="hover:text-[#FBBF24] transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link href="/blogs" className="hover:text-[#FBBF24] transition-colors">Blogs</Link>
          <ChevronRight size={10} />
          <span className="text-[#0A192F]/80">Post Details</span>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Post Header */}
          <header className="mb-12">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-[#0A192F] mb-8 tracking-tight leading-[1.1]">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 py-6 border-y border-[#0A192F]/05">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FBBF24] flex items-center justify-center text-[#0A192F] font-black text-lg">
                  A
                </div>
                <div>
                  <p className="text-xs font-black text-[#0A192F] uppercase tracking-widest">Airlink Editorial</p>
                  <p className="text-[10px] font-bold text-[#0A192F]/40 uppercase tracking-tight">Broadband Experts</p>
                </div>
              </div>
              
              <div className="h-8 w-px bg-[#0A192F]/05 hidden md:block" />

              <div className="flex items-center gap-4 text-[10px] font-black text-[#0A192F]/40 uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-[#FBBF24]" /> {post.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-[#FBBF24]" /> 5 min read
                </span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden mb-16 shadow-2xl">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-20">
            {renderContent(post.content)}
          </div>

          {/* Post Footer / CTA */}
          <div className="bg-[#0A192F] rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden mb-20 shadow-2xl group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#FBBF24]/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-150" />
             
             <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-black mb-6 tracking-tight">Need a Connection Today?</h3>
                <div className="flex flex-col md:flex-row gap-6 mb-10">
                    <a href="tel:+919344584000" className="flex items-center gap-4 group/item">
                        <div className="w-12 h-12 rounded-2xl bg-[#FBBF24] flex items-center justify-center text-[#0A192F] transition-transform group-hover/item:scale-110">
                            <Phone size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Call Us Now</p>
                            <p className="text-lg font-black text-[#FBBF24] tracking-tight">+91 93445 84000</p>
                        </div>
                    </a>
                    <a href="https://www.srirambroadband.com" className="flex items-center gap-4 group/item">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white transition-transform group-hover/item:scale-110">
                            <Globe size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Visit Website</p>
                            <p className="text-lg font-black text-white tracking-tight">srirambroadband.com</p>
                        </div>
                    </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 border-t border-white/10">
                    <Link href="/" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-[#FBBF24] transition-colors">
                        Home <ExternalLink size={12} />
                    </Link>
                    <Link href="/plans" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-[#FBBF24] transition-colors">
                        View Plans <ExternalLink size={12} />
                    </Link>
                    <Link href="/contact" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-[#FBBF24] transition-colors">
                        Contact <ExternalLink size={12} />
                    </Link>
                </div>
             </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-start">
            <Link 
              href="/blogs"
              className="inline-flex items-center gap-3 text-sm font-black text-[#0A192F] uppercase tracking-[0.2em] group"
            >
              <div className="w-10 h-10 rounded-full border border-[#0A192F]/10 flex items-center justify-center transition-all duration-300 group-hover:bg-[#0A192F] group-hover:text-white">
                <ArrowLeft size={18} />
              </div>
              Back to all blogs
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
