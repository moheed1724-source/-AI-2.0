import React from 'react';
import { motion } from 'motion/react';
import { Code, Settings, TrendingUp, Cpu } from 'lucide-react';

const majors = [
  {
    icon: <Settings size={32} />,
    name: "机械工程",
    unis: ["亚琛工业大学", "斯图加特大学", "慕尼黑工业大学"]
  },
  {
    icon: <Code size={32} />,
    name: "计算机科学",
    unis: ["慕尼黑工业大学", "卡尔斯鲁厄理工", "柏林工业大学"]
  },
  {
    icon: <Cpu size={32} />,
    name: "电气工程",
    unis: ["达姆施塔特工大", "德累斯顿工大", "汉诺威大学"]
  },
  {
    icon: <TrendingUp size={32} />,
    name: "商科/经济",
    unis: ["曼海姆大学", "慕尼黑大学", "科隆大学"]
  }
];

export const Majors: React.FC = () => {
  return (
    <section id="majors" className="py-20 bg-jicai-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">热门专业推荐</h2>
          <p className="text-gray-400">德国最具竞争力的优势学科</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {majors.map((major, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl p-6 transition-colors"
            >
              <div className="w-14 h-14 bg-jicai-blue/20 text-jicai-blue rounded-xl flex items-center justify-center mb-6">
                {major.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{major.name}</h3>
              <div className="space-y-2">
                <p className="text-xs text-gray-500 uppercase tracking-wider">推荐院校</p>
                {major.unis.map((uni, i) => (
                  <div key={i} className="text-sm text-gray-300 flex items-center gap-2">
                    <div className="w-1 h-1 bg-jicai-blue rounded-full"></div>
                    {uni}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
