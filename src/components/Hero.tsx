import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check, Building2, GraduationCap } from 'lucide-react';

export const Hero: React.FC<{ scrollToAssessment: () => void }> = ({ scrollToAssessment }) => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center bg-jicai-black overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-10" 
           style={{ 
             backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }}>
      </div>
      
      {/* Abstract German Architecture / Tech Background */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 border border-white/10 rounded-full"></div>
        <div className="absolute top-40 right-40 w-64 h-64 border border-jicai-blue/30 rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-jicai-blue/10 to-transparent"></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-jicai-black/80 to-jicai-black z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-6">
               <span className="w-8 h-[1px] bg-jicai-blue"></span>
               <span className="text-jicai-blue text-sm font-bold tracking-[0.2em] uppercase">German Tech Minimalism</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              济才德国 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-jicai-blue to-blue-400">
                AI 智能评估系统
              </span>
            </h1>
            <p className="text-xl text-gray-400 mt-6 max-w-lg leading-relaxed">
              融合大数据算法与德国严谨教育体系。3分钟精准评估，为您匹配最适合的德国名校。纯粹、精准、高效。
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button 
              onClick={scrollToAssessment}
              className="px-8 py-4 bg-jicai-blue hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center gap-2 group"
            >
              立即 AI 评估
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all backdrop-blur-sm flex items-center justify-center gap-2">
              <Building2 size={18} />
              了解德国大学
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-6 text-sm text-gray-500 pt-4 border-t border-white/5"
          >
            <div className="flex items-center gap-2">
              <Check size={16} className="text-jicai-blue" />
              <span>数据实时更新</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-jicai-blue" />
              <span>TU9 深度解析</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-jicai-blue" />
              <span>100% 隐私保护</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="hidden lg:block relative"
        >
          {/* Abstract Tech Illustration */}
          <div className="relative w-full aspect-square max-w-lg mx-auto">
            <div className="absolute inset-0 bg-gradient-to-tr from-jicai-blue/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            
            {/* Main Image - Berlin / Tech */}
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-white/10 h-full">
               <img 
                 src="https://images.unsplash.com/photo-1599946347371-68eb71b16afc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                 alt="Berlin Architecture" 
                 className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                 referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-jicai-blue/10 mix-blend-overlay"></div>
            </div>
            
            {/* Floating Cards */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-jicai-dark/90 backdrop-blur-md p-4 pr-8 rounded-xl border border-white/10 shadow-xl z-20 flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-jicai-blue rounded-lg flex items-center justify-center text-white">
                <GraduationCap size={20} />
              </div>
              <div>
                <div className="text-white font-bold text-lg">98%</div>
                <div className="text-xs text-gray-400">申请成功率</div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -left-6 bg-jicai-dark/90 backdrop-blur-md p-4 pr-8 rounded-xl border border-white/10 shadow-xl z-20 flex items-center gap-4"
            >
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white">
                <Building2 size={20} />
              </div>
              <div>
                <div className="text-white font-bold text-lg">TU9</div>
                <div className="text-xs text-gray-400">精英大学联盟</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
