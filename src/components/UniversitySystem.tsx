import React from 'react';
import { motion } from 'motion/react';

const universities = [
  {
    name: "慕尼黑工业大学",
    en: "TU Munich",
    desc: "德国最顶尖的理工大学之一，诺贝尔奖得主摇篮。",
    image: "tum.jpg"
  },
  {
    name: "亚琛工业大学",
    en: "RWTH Aachen",
    desc: "欧洲顶尖理工大学，机械工程专业世界闻名。",
    image: "RWTH.jpg"
  },
  {
    name: "海德堡大学",
    en: "Heidelberg University",
    desc: "德国最古老的大学，医学与生命科学领域的权威。",
    image: "Heidelberg.jpg"
  }
];

export const UniversitySystem: React.FC = () => {
  return (
    <section id="system" className="py-20 bg-jicai-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">德国大学体系</h2>
          <p className="text-gray-400">严谨的学术传统与现代科技的完美结合</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {universities.map((uni, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="group relative overflow-hidden rounded-2xl bg-jicai-dark border border-white/5"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={uni.image} 
                  alt={uni.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">{uni.name}</h3>
                <p className="text-sm text-jicai-blue mb-3">{uni.en}</p>
                <p className="text-gray-400 text-sm">{uni.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
