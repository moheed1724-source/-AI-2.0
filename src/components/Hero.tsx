import React from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ShieldCheck, TrendingUp, Award } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-jicai-dark">
      {/* 沉浸式背景与暗黑遮罩 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-jicai-black/95 via-jicai-black/80 to-jicai-dark z-10"></div>
        <img 
          src="/BG.jpg" 
          alt="German University Campus" 
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* 版本更新呼吸灯标签 */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-jicai-blue mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-jicai-blue animate-pulse"></span>
            济才留德 · AI 智能录取评估系统 2.0 震撼上线
          </div>
          
          {/* 极具冲击力的主标题 */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            拒做留学韭菜，<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-jicai-blue to-blue-400">
              用数据定义你的德国名校路
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            告别传统中介的经验主义。系统内置最新巴伐利亚算法、APS 审核红线及全德 50 所高校 NC 受限专业数据库。3分钟精准测算你的专属录取概率。
          </p>

          {/* 强引导 CTA 按钮组 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-jicai-blue hover:bg-blue-600 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(0,112,243,0.4)] flex items-center justify-center gap-2"
            >
              免费生成深度诊断报告 <ChevronRight size={20} />
            </button>
            <button 
              onClick={() => document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-lg backdrop-blur-sm transition-all flex items-center justify-center gap-2 border border-white/10"
            >
              体验留德通关沙盘
            </button>
          </div>

          {/* 信任背书角标 */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto border-t border-white/10 pt-8">
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <ShieldCheck className="text-jicai-blue" size={20} />
              <span className="text-sm">直击 APS 审核核心痛点</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <TrendingUp className="text-jicai-blue" size={20} />
              <span className="text-sm">ECTS 学分极度精准匹配</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-400">
              <Award className="text-jicai-blue" size={20} />
              <span className="text-sm">覆盖全德绝密高校数据</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
