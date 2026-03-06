import React from 'react';
import { motion } from 'motion/react';

// 我帮你扩充了院校数量
const universities = [
  { name: "慕尼黑工业大学", en: "TU Munich", desc: "德国最顶尖的理工大学之一，诺贝尔奖得主摇篮。", image: "/tum.jpg" },
  { name: "亚琛工业大学", en: "RWTH Aachen", desc: "欧洲顶尖理工大学，机械工程专业世界闻名。", image: "/RWTH.jpg" },
  { name: "海德堡大学", en: "Heidelberg University", desc: "德国最古老的大学，医学与生命科学领域的权威。", image: "/Heidelberg.jpg" },
  { name: "柏林工业大学", en: "TU Berlin", desc: "德国最大的工业大学之一，坐落于首都。", image: "/TU Berlin.jpg" },
  { name: "卡尔斯鲁厄理工", en: "KIT", desc: "德国的MIT，计算机与工程的顶级殿堂。", image: "/KIT.jpg" },
  { name: "慕尼黑大学", en: "LMU", desc: "精英大学联盟成员，商科与文科全德顶尖。", image: "/LMU.jpg" }
];

// 为了实现无限滚动，我们把数组复制一份拼在一起
const duplicatedUniversities = [...universities, ...universities];

export const UniversitySystem: React.FC = () => {
  return (
    <section id="system" className="py-20 bg-jicai-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">德国大学体系</h2>
          <p className="text-gray-400">严谨的学术传统与现代科技的完美结合</p>
        </div>
      </div>

      {/* 无限滚动容器 */}
      <div className="relative w-full flex overflow-hidden">
        {/* 左右边缘的渐变遮罩，让滚动显得更自然 */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-jicai-black to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-jicai-black to-transparent z-10"></div>

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 30, repeat: Infinity }}
          className="flex gap-8 w-max px-4"
        >
          {duplicatedUniversities.map((uni, index) => (
            <div
              key={index}
              className="w-[350px] shrink-0 group relative overflow-hidden rounded-2xl bg-jicai-dark border border-white/5 hover:border-jicai-blue/50 transition-colors"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={uni.image} 
                  alt={uni.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">{uni.name}</h3>
                <p className="text-sm text-jicai-blue mb-3">{uni.en}</p>
                <p className="text-gray-400 text-sm line-clamp-2">{uni.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
