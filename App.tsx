import React, { useState, useEffect } from 'react';
import { 
  Mic2, ArrowRight, ChevronLeft, Hash, Database, Calendar, Filter, X, Check, Home
} from 'lucide-react';
import { NeoButton, NeoCard, NeoInput, NeoSelect, Badge, PostSkeleton } from './components/NeoComponents';
import { Post, Category, CATEGORY_COLORS, CATEGORY_LABELS } from './types';
// Import from the generated TS file
import { posts as postsData } from './posts';

export default function App() {
  const [view, setView] = useState<'home' | 'database' | 'post'>('home');
  const [activePost, setActivePost] = useState<Post | null>(null);
  
  // Initialize with imported data
  const [posts, setPosts] = useState<Post[]>(postsData);
  const [filter, setFilter] = useState<Category | 'ALL'>('ALL');
  
  // Loading State - no longer needed for posts, but kept for compatibility or future async ops
  const [isLoading, setIsLoading] = useState(false);

  // Database View State
  const [dbSearch, setDbSearch] = useState('');
  const [dbCategory, setDbCategory] = useState<Category | 'ALL'>('ALL');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const filteredPosts = posts.filter(p => {
    const matchesCategory = filter === 'ALL' || p.category === filter;
    return matchesCategory;
  });

  const getRelatedPosts = (current: Post) => {
    return posts
      .filter(p => p.id !== current.id)
      .map(p => {
        let score = 0;
        if (p.category === current.category) score += 2;
        const sharedTags = p.tags?.filter(t => current.tags?.includes(t)) || [];
        score += sharedTags.length;
        return { post: p, score };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(x => x.post);
  };

  // --- Views ---

  const renderHome = () => (
    <>
      {/* Featured Hero Section */}
      {!isLoading && filteredPosts.length > 0 && (
        <section className="mb-16">
          <div className="border-4 border-black shadow-neo bg-white flex flex-col md:flex-row overflow-hidden">
             {/* Image container */}
             <div className="w-full md:w-1/2 relative h-[350px] md:h-auto border-b-4 md:border-b-0 md:border-r-4 border-black group cursor-pointer" onClick={() => { setActivePost(filteredPosts[0]); setView('post'); }}>
                <img 
                  src={filteredPosts[0].imageUrl} 
                  alt="Hero" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                   <Badge text={filteredPosts[0].category} color={CATEGORY_COLORS[filteredPosts[0].category]} />
                   <Badge text="HOT DROP" color="bg-red-500" />
                </div>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
             </div>
             
             {/* Content container */}
             <div className="w-full md:w-1/2 p-6 md:p-10 lg:p-14 flex flex-col justify-center items-start">
               <h1 
                  className="font-display text-4xl md:text-5xl lg:text-6xl uppercase leading-[0.9] mb-6 cursor-pointer hover:text-rap-blue transition-colors"
                  onClick={() => { setActivePost(filteredPosts[0]); setView('post'); }}
               >
                 {filteredPosts[0].title}
               </h1>
               <div className="w-24 h-2 bg-rap-yellow mb-6"></div>
               <p className="font-sans text-base md:text-lg font-medium text-gray-700 mb-8 leading-relaxed line-clamp-4">
                 {filteredPosts[0].excerpt}
               </p>
               <NeoButton 
                 onClick={() => { setActivePost(filteredPosts[0]); setView('post'); }}
                 icon={ArrowRight}
                 className="self-start"
               >
                 Číst Článek
               </NeoButton>
             </div>
          </div>
        </section>
      )}

      {/* Filter Bar */}
      <section className="mb-12 sticky top-20 z-10">
        <div className="bg-rap-green border-4 border-black shadow-neo p-4 flex flex-wrap gap-4 items-center justify-between">
          <h2 className="font-display text-2xl uppercase text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] hidden md:block">
            Archiv
          </h2>
          <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <button 
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 font-bold uppercase border-2 border-black transition-all flex-shrink-0 ${filter === 'ALL' ? 'bg-white text-black shadow-neo-sm' : 'bg-black text-white hover:bg-gray-800'}`}
            >
              Vše
            </button>
            {Object.keys(CATEGORY_LABELS).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat as Category)}
                className={`px-4 py-2 font-bold uppercase border-2 border-black transition-all flex-shrink-0 ${filter === cat ? 'bg-white text-black shadow-neo-sm' : 'bg-black text-white hover:bg-gray-800'}`}
              >
                {CATEGORY_LABELS[cat as Category]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {isLoading ? (
          // Loading Skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <NeoCard key={post.id} className="h-full flex flex-col" noPadding>
               <div className={`h-48 border-b-4 border-black relative overflow-hidden group cursor-pointer`} onClick={() => { setActivePost(post); setView('post'); }}>
                  <img src={post.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={post.title} />
                  <div className="absolute top-2 left-2">
                    <Badge text={CATEGORY_LABELS[post.category]} color={CATEGORY_COLORS[post.category]} />
                  </div>
               </div>
               <div className="p-6 flex flex-col flex-grow bg-white">
                  <div className="flex justify-between items-center mb-3 text-xs font-bold text-gray-500 font-mono">
                     <span>{post.date}</span>
                     <span>{post.author}</span>
                  </div>
                  <h3 className="font-display text-2xl uppercase leading-tight mb-4 flex-grow hover:text-rap-blue cursor-pointer transition-colors" onClick={() => { setActivePost(post); setView('post'); }}>
                    {post.title}
                  </h3>
                  <div className="mt-auto pt-4 border-t-2 border-gray-100 flex justify-between items-center">
                     <div className="flex gap-1">
                        {post.tags?.slice(0,2).map(t => <span key={t} className="text-xs bg-gray-200 px-1 font-mono">#{t}</span>)}
                     </div>
                     <button onClick={() => { setActivePost(post); setView('post'); }} className="font-bold uppercase text-sm hover:underline flex items-center gap-1">
                       Číst <ArrowRight size={14} />
                     </button>
                  </div>
               </div>
            </NeoCard>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <h3 className="font-display text-3xl uppercase mb-4">Žádné výsledky</h3>
            <p className="font-mono text-lg">Zkus změnit filtry.</p>
          </div>
        )}
      </div>
    </>
  );

  const renderDatabase = () => {
    // Database specific filtering
    const dbFilteredPosts = posts.filter(p => {
        const matchesCategory = dbCategory === 'ALL' || p.category === dbCategory;
        const searchLower = dbSearch.toLowerCase();
        const matchesSearch = 
          p.title.toLowerCase().includes(searchLower) || 
          p.excerpt.toLowerCase().includes(searchLower) ||
          (p.tags && p.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
          p.author.toLowerCase().includes(searchLower);
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="max-w-7xl mx-auto">
             {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b-4 border-black pb-6 gap-4">
                <div>
                    <h1 className="font-display text-5xl uppercase mb-2">Databáze</h1>
                    <p className="font-mono text-gray-700">Centrální archiv všech článků a beatů.</p>
                </div>

                {/* Mobile Filter Toggle */}
                <div className="md:hidden w-full">
                    <NeoButton 
                        onClick={() => setIsMobileFilterOpen(true)} 
                        icon={Filter} 
                        fullWidth
                        variant="secondary"
                    >
                        Filtrovat & Hledat
                    </NeoButton>
                </div>
            </div>

            {/* Desktop Filter Bar (Hidden on Mobile) */}
            <div className="hidden md:block">
              <NeoCard className="mb-8 bg-gray-50" noPadding>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                      <div className="md:col-span-2">
                          <NeoInput 
                              placeholder="HLEDAT (NÁZEV, TAG, AUTOR)..." 
                              value={dbSearch} 
                              onChange={(e) => setDbSearch(e.target.value)}
                              className="w-full"
                          />
                      </div>
                      <div className="md:col-span-1">
                          <NeoSelect 
                              label="Kategorie"
                              options={[{value: 'ALL', label: 'VŠECHNY KATEGORIE'}, ...Object.keys(CATEGORY_LABELS).map(k => ({ value: k, label: CATEGORY_LABELS[k as Category]}))]}
                              value={dbCategory}
                              onChange={(e) => setDbCategory(e.target.value as Category | 'ALL')}
                              className="w-full"
                          />
                      </div>
                      <div className="md:col-span-1 flex items-center justify-center h-full pb-1">
                          <div className="font-mono text-sm font-bold text-gray-500 uppercase">
                              Nalezeno: {dbFilteredPosts.length}
                          </div>
                      </div>
                  </div>
              </NeoCard>
            </div>

            {/* Mobile Filter Modal */}
            {isMobileFilterOpen && (
                <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 md:hidden animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg border-4 border-black shadow-neo-lg animate-in slide-in-from-bottom-10 fade-in duration-300">
                        <div className="flex justify-between items-center p-4 border-b-4 border-black bg-rap-yellow">
                            <h3 className="font-display text-xl uppercase">Filtry</h3>
                            <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 hover:bg-black hover:text-white transition-colors border-2 border-transparent hover:border-black">
                                <X size={24} strokeWidth={3} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <NeoInput 
                                label="Hledat"
                                placeholder="Název, tag, autor..." 
                                value={dbSearch} 
                                onChange={(e) => setDbSearch(e.target.value)}
                                autoFocus
                            />
                            <NeoSelect 
                                label="Kategorie"
                                options={[{value: 'ALL', label: 'VŠECHNY KATEGORIE'}, ...Object.keys(CATEGORY_LABELS).map(k => ({ value: k, label: CATEGORY_LABELS[k as Category]}))]}
                                value={dbCategory}
                                onChange={(e) => setDbCategory(e.target.value as Category | 'ALL')}
                            />
                            <div className="pt-4">
                                <NeoButton onClick={() => setIsMobileFilterOpen(false)} fullWidth icon={Check} variant="primary">
                                    Zobrazit ({dbFilteredPosts.length})
                                </NeoButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Database List View */}
            <div className="space-y-4">
                {/* Header Row */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-6 pb-2 font-mono text-xs font-bold uppercase tracking-wider text-gray-500 border-b-2 border-black">
                    <div className="col-span-2">Datum</div>
                    <div className="col-span-2">Kategorie</div>
                    <div className="col-span-5">Název</div>
                    <div className="col-span-2">Autor</div>
                    <div className="col-span-1 text-right">Akce</div>
                </div>

                {dbFilteredPosts.map(post => (
                    <div 
                        key={post.id} 
                        className="bg-white border-2 border-black shadow-neo-sm hover:shadow-neo transition-all p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center group cursor-pointer"
                        onClick={() => { setActivePost(post); setView('post'); }}
                    >
                        <div className="md:col-span-2 font-mono text-sm flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            {post.date}
                        </div>
                        <div className="md:col-span-2">
                             <span className={`${CATEGORY_COLORS[post.category]} text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest border border-black inline-block`}>
                                {CATEGORY_LABELS[post.category]}
                             </span>
                        </div>
                        <div className="md:col-span-5 font-display text-lg uppercase leading-tight group-hover:text-rap-blue transition-colors">
                            {post.title}
                        </div>
                        <div className="md:col-span-2 font-mono text-sm font-bold text-gray-600">
                            {post.author}
                        </div>
                        <div className="md:col-span-1 text-right">
                             <button className="bg-black text-white p-2 hover:bg-rap-pink transition-colors">
                                <ArrowRight size={16} />
                             </button>
                        </div>
                    </div>
                ))}
                
                {dbFilteredPosts.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-gray-400 bg-gray-50">
                        <p className="font-mono text-gray-500">Žádné výsledky v databázi.</p>
                    </div>
                )}
            </div>
        </div>
    );
  };

  const renderPostDetail = () => {
    if (!activePost) return null;
    
    // Logic for related posts
    const relatedPosts = getRelatedPosts(activePost);

    return (
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => setView('home')}
          className="mb-6 flex items-center gap-2 font-bold uppercase hover:underline"
        >
          <ChevronLeft className="bg-black text-white p-1" size={24} /> Zpět na přehled
        </button>
        
        <NeoCard className="bg-white" noPadding>
          <div className="h-[400px] w-full relative border-b-4 border-black">
            <img src={activePost.imageUrl} className="w-full h-full object-cover" alt={activePost.title} />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-8 pt-32">
               <Badge text={CATEGORY_LABELS[activePost.category]} color={CATEGORY_COLORS[activePost.category]} />
               <h1 className="font-display text-4xl md:text-6xl text-white uppercase mt-4 drop-shadow-md">
                 {activePost.title}
               </h1>
            </div>
          </div>
          
          <div className="p-8 md:p-12">
            <div className="flex justify-between border-b-2 border-gray-200 pb-6 mb-8 font-mono text-sm uppercase tracking-wider">
               <div className="flex gap-4">
                 <span>Autor: <strong>{activePost.author}</strong></span>
                 <span>Datum: <strong>{activePost.date}</strong></span>
               </div>
               <div className="flex gap-2">
                 <Mic2 size={18} />
                 <span>3 min čtení</span>
               </div>
            </div>

            <div className="prose prose-xl prose-stone max-w-none font-sans">
              <p className="font-bold text-2xl mb-8 leading-relaxed">{activePost.excerpt}</p>
              {activePost.content.split('\n').map((line, i) => {
                     // Image parsing
                     if (line.trim().startsWith('![') && line.includes('](')) {
                       const imageMatch = line.match(/!\[(.*?)\]\((.*?)\)/);
                       if (imageMatch) {
                         const altText = imageMatch[1];
                         const url = imageMatch[2];
                         return (
                           <div key={i} className="my-8">
                             <img 
                               src={url} 
                               alt={altText} 
                               className="w-full h-auto border-4 border-black shadow-neo-sm" 
                             />
                             {altText && <p className="text-sm font-mono text-gray-500 mt-2 text-center uppercase tracking-widest">{altText}</p>}
                           </div>
                         );
                       }
                     }

                     if (line.startsWith('## ')) return <h2 key={i} className="font-display text-3xl uppercase font-black mt-12 mb-6 border-b-4 border-rap-yellow inline-block pr-8">{line.replace('## ', '')}</h2>;
                     if (line.startsWith('### ')) return <h3 key={i} className="font-display text-xl uppercase font-bold mt-8 mb-4">{line.replace('### ', '')}</h3>;
                     if (line.startsWith('* ')) return <li key={i} className="list-disc ml-6 mb-2 font-medium">{line.replace('* ', '')}</li>;
                     if (line.startsWith('1. ')) return <li key={i} className="list-decimal ml-6 mb-2 font-medium">{line.replace('1. ', '')}</li>;
                     if (line.startsWith('> ')) return <blockquote key={i} className="bg-rap-purple/10 p-6 border-l-8 border-rap-purple text-xl italic font-serif my-8">{line.replace('> ', '')}</blockquote>;
                     if (line.trim() === '') return <br key={i}/>;
                     return <p key={i} className="mb-4 text-gray-900 leading-relaxed">{line}</p>;
               })}
            </div>

            <div className="mt-12 pt-8 border-t-4 border-black flex flex-wrap gap-2">
              <Hash size={20} className="mt-1" />
              {activePost.tags?.map(tag => (
                <span key={tag} className="bg-gray-100 border-2 border-black px-3 py-1 font-mono text-sm hover:bg-black hover:text-white transition-colors cursor-pointer">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </NeoCard>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
            <div className="mt-16">
                 <h3 className="font-display text-2xl uppercase mb-6 border-b-4 border-black inline-block pr-8">Podobné články</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedPosts.map(p => (
                        <div 
                            key={p.id} 
                            onClick={() => { setActivePost(p); window.scrollTo(0,0); }}
                            className="border-2 border-black bg-white shadow-neo-sm hover:shadow-neo transition-all cursor-pointer grayscale opacity-80 hover:grayscale-0 hover:opacity-100 duration-300"
                        >
                            <div className="h-32 border-b-2 border-black relative overflow-hidden">
                                <img src={p.imageUrl} className="w-full h-full object-cover" alt={p.title} />
                            </div>
                            <div className="p-4">
                                <span className="text-[10px] font-bold uppercase text-gray-500 mb-1 block">{CATEGORY_LABELS[p.category]}</span>
                                <h4 className="font-display text-sm uppercase leading-tight line-clamp-2">{p.title}</h4>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-rap-yellow pb-24 md:pb-20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-black text-white border-b-4 border-white shadow-xl">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
            onClick={() => setView('home')}
          >
            <span className="font-display text-3xl tracking-tighter">4RAP<span className="text-rap-pink">.CZ</span></span>
          </div>

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
             <NeoButton 
                variant="accent" 
                className="py-2 px-4 text-sm text-white"
                onClick={() => setView('database')}
                icon={Database}
              >
                DATABASE
              </NeoButton>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {view === 'home' && renderHome()}
        {view === 'database' && renderDatabase()}
        {view === 'post' && renderPostDetail()}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-black border-t-4 border-black grid grid-cols-2">
        <button 
          onClick={() => { setView('home'); window.scrollTo(0,0); }}
          className={`flex flex-col items-center justify-center py-3 font-display uppercase tracking-widest text-sm transition-colors ${view === 'home' ? 'bg-rap-pink text-black' : 'bg-black text-white hover:bg-gray-900'}`}
        >
          <Home size={24} strokeWidth={2.5} className="mb-1" />
          Home
        </button>
        <button 
          onClick={() => { setView('database'); window.scrollTo(0,0); }}
          className={`flex flex-col items-center justify-center py-3 font-display uppercase tracking-widest text-sm transition-colors ${view === 'database' ? 'bg-rap-green text-black' : 'bg-black text-white hover:bg-gray-900'}`}
        >
          <Database size={24} strokeWidth={2.5} className="mb-1" />
          Databáze
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-rap-yellow text-black border-t-4 border-black mt-auto py-16 hidden md:block">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-xl mb-0 tracking-widest">4RAP.CZ</h2>
        </div>
      </footer>
    </div>
  );
}