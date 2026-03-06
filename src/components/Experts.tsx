import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, Award } from 'lucide-react';

const experts = [
  {
    name: "Dr. Weber",
    title: "首席留学规划师",
    exp: "12年",
    cases: "1200+",
    desc: "慕尼黑工业大学博士，10年德国留学咨询经验，擅长理工科高端申请。",
    image: "teacher.jpg"
  },
  {
    name: "Sarah Li",
    title: "资深文书专家",
    exp: "8年",
    cases: "800+",
    desc: "海德堡大学日耳曼文学硕士，精通德语写作，帮助数百名学生润色文书。",
    image: "teacher2.jpg"
  },
  {
    name: "Markus Zhang",
    title: "签证与职业顾问",
    exp: "6年",
    cases: "500+",
    desc: "前德国外管局实习经历，熟悉签证政策与德国就业市场。",
    image: "teacher3.jpg"
  }
];

export const Experts: React.FC = () => {
  return (
    <section id="experts" className="py-20 bg-jicai-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">专家团队</h2>
          <p className="text-gray-400">最专业的导师，为您保驾护航</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experts.map((expert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="group bg-jicai-dark rounded-2xl overflow-hidden border border-white/5 hover:border-jicai-blue/50 transition-all shadow-lg hover:shadow-jicai-blue/10"
            >
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={expert.image} 
                  alt={expert.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-jicai-dark to-transparent h-20"></div>
              </div>
              <div className="p-6 relative -mt-6">
                <div className="bg-jicai-blue text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3 shadow-lg">
                  {expert.title}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{expert.name}</h3>
                
                <div className="flex gap-4 mb-4 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-gray-500" />
                    <div>
                      <div className="text-white font-bold">{expert.exp}</div>
                      <div className="text-[10px] text-gray-500 uppercase">经验</div>
                    </div>
                  </div>
                  <div className="w-[1px] bg-white/10"></div>
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-gray-500" />
                    <div>
                      <div className="text-white font-bold">{expert.cases}</div>
                      <div className="text-[10px] text-gray-500 uppercase">成功案例</div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed">{expert.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
