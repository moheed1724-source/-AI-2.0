import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Check } from 'lucide-react';

export const Hero: React.FC<{ scrollToAssessment: () => void }> = ({ scrollToAssessment }) => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center bg-jicai-black overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }}>
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-jicai-black/50 to-jicai-black z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-jicai-blue/20 text-jicai-blue text-sm font-bold tracking-wider mb-4 border border-jicai-blue/30">
              GERMAN TECH MINIMALISM
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              济才德国 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-jicai-blue to-blue-400">
                AI 智能评估系统
              </span>
            </h1>
            <p className="text-xl text-gray-400 mt-6 max-w-lg">
              3分钟精准评估，基于大数据算法，为您匹配最适合的德国名校。纯粹、精准、高效。
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
            <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all backdrop-blur-sm">
              了解德国大学
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-6 text-sm text-gray-500"
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
          <div className="relative w-full aspect-square">
            <div className="absolute inset-0 bg-gradient-to-tr from-jicai-blue/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <img 
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="German Technology" 
              className="relative z-10 rounded-2xl shadow-2xl border border-white/10 object-cover w-full h-full opacity-80 grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            
            {/* Floating Cards */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 bg-jicai-dark/90 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-xl z-20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 font-bold">
                  A+
                </div>
                <div>
                  <div className="text-white font-bold">录取概率极高</div>
                  <div className="text-xs text-gray-400">慕尼黑工业大学</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-10 -left-10 bg-jicai-dark/90 backdrop-blur-md p-6 rounded-xl border border-white/10 shadow-xl z-20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-500 font-bold">
                  TU9
                </div>
                <div>
                  <div className="text-white font-bold">精英大学联盟</div>
                  <div className="text-xs text-gray-400">德国理工大学基石</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
