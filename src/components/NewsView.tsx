import React from 'react';
import { NewsPost } from '../types';
import { Newspaper, Calendar, AlertCircle, PlayCircle, Image, MessageSquare } from 'lucide-react';

interface NewsViewProps {
  news: NewsPost[];
}

export default function NewsView({ news }: NewsViewProps) {
  const activeNews = news.filter(n => n.active);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle className="h-4 w-4 text-amber-400" />;
      case 'image': return <Image className="h-4 w-4 text-blue-400" />;
      default: return <MessageSquare className="h-4 w-4 text-green-400" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in py-4">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="font-display text-3xl font-black text-white tracking-wide">
          ACTUALITÉS & <span className="text-yellow-400">ANNONCES</span>
        </h2>
        <p className="text-sm text-gray-400">
          Suivez en temps réel les dernières nouveautés de PUBG MOBILE, les lancements de nouveaux pass, ainsi que les communiqués officiels de l'administration de GB STORES UC.
        </p>
      </div>

      {activeNews.length === 0 ? (
        <div className="bg-gray-950/60 rounded-2xl p-8 border border-gray-900 text-center space-y-3">
          <AlertCircle className="h-10 w-10 text-gray-600 mx-auto" />
          <h4 className="font-bold text-white">Aucune actualité</h4>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Il n'y a pas d'actualité publiée actuellement. N'hésitez pas à revenir plus tard pour rester informé de toutes nos activités.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeNews.map((item) => (
            <div 
              key={item.id}
              className="bg-gray-950/65 border border-gray-850 hover:border-yellow-400/20 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 flex flex-col md:flex-row gap-6"
              id={`news-item-${item.id}`}
            >
              {/* Image / Video thumbnail or direct embedded player */}
              {item.type === 'video' && item.videoUrl ? (
                <div className="w-full md:w-80 aspect-video rounded-xl bg-black border border-gray-900 overflow-hidden flex-shrink-0 shadow-[0_4px_25px_rgba(234,179,8,0.08)] relative hover:border-yellow-400/20 transition-all duration-300">
                  <iframe
                    src={item.videoUrl}
                    title={item.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="w-full md:w-48 h-32 rounded-xl bg-black border border-gray-900 flex flex-col items-center justify-center relative overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/5 to-transparent"></div>
                  <Newspaper className="h-8 w-8 text-yellow-400/20 mb-2 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-[10px] font-bold font-mono text-gray-500 uppercase tracking-widest bg-gray-950 px-2 py-0.5 rounded border border-gray-850">
                    GB NEWS
                  </span>
                </div>
              )}

              {/* Text content */}
              <div className="flex-1 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center space-x-1.5 bg-gray-900 border border-gray-800 text-[10px] font-bold px-2 py-1 rounded-md text-gray-300 font-mono">
                      {getTypeIcon(item.type)}
                      <span className="uppercase">{item.type}</span>
                    </span>
                    <span className="inline-flex items-center space-x-1.5 text-gray-500 text-[10px] font-mono">
                      <Calendar className="h-3 w-3" />
                      <span>{item.date}</span>
                    </span>
                  </div>

                  <h3 className="font-display font-black text-white text-lg mt-2 group-hover:text-yellow-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Direct Action Badge / Play Info */}
                {item.videoUrl && (
                  <div className="text-[10px] text-yellow-400/70 font-mono flex items-center space-x-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
                    <span>Lecteur vidéo intégré disponible</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
