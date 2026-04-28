import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { blogPosts } from '@/data/blogData';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { LightSectionBg } from '@/components/ui/AnimatedBackground';

export const metadata = {
  title: "Airlink Blogs | Insights on High-Speed Internet & Business Solutions",
  description: "Stay updated with the latest trends in fiber broadband, leased lines, and digital connectivity in Tamil Nadu. Expert guides and tips from Airlink Broadband.",
};

export default function BlogsPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 bg-[#F7F8FA] relative overflow-hidden">
      <LightSectionBg variant="grid" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-[#0A192F] mb-6 tracking-tight">
            Airlink <span className="text-[#FBBF24]">Blogs</span>
          </h1>
          <p className="text-[#0A192F]/60 text-lg md:text-xl font-medium leading-relaxed">
            Expert guides, industry insights, and everything you need to know about the future of connectivity in Tamil Nadu.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <article 
              key={post.slug}
              className="group bg-white rounded-[2rem] border border-[#0A192F]/05 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="relative h-60 w-full overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-[10px] font-black text-[#0A192F]/40 uppercase tracking-widest mb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-[#FBBF24]" /> {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} className="text-[#FBBF24]" /> 5 min read
                  </span>
                </div>

                <h2 className="text-xl font-black text-[#0A192F] mb-4 line-clamp-2 group-hover:text-[#FBBF24] transition-colors duration-300">
                  {post.title}
                </h2>
                
                <p className="text-[#0A192F]/50 text-sm font-medium leading-relaxed mb-8 line-clamp-3">
                  {post.metaDescription}
                </p>

                <div className="mt-auto">
                  <Link 
                    href={`/blogs/${post.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-black text-[#0A192F] uppercase tracking-widest group/btn"
                  >
                    Read Full Story
                    <div className="w-8 h-8 rounded-full bg-[#FBBF24]/10 flex items-center justify-center transition-all duration-300 group-hover/btn:bg-[#FBBF24] group-hover/btn:translate-x-1">
                      <ArrowRight size={14} />
                    </div>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
