import React from 'react';
import { motion } from 'motion/react';

const experts = [
  {
    name: "Dr. Weber",
    title: "首席留学规划师",
    desc: "慕尼黑工业大学博士，10年德国留学咨询经验，擅长理工科高端申请。",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Sarah Li",
    title: "资深文书专家",
    desc: "海德堡大学日耳曼文学硕士，精通德语写作，帮助数百名学生润色文书。",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
  },
  {
    name: "Markus Zhang",
    title: "签证与职业顾问",
    desc: "前德国外管局实习经历，熟悉签证政策与德国就业市场。",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80"
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
              className="group bg-jicai-dark rounded-2xl overflow-hidden border border-white/5 hover:border-jicai-blue/50 transition-all"
            >
              <div className="h-64 overflow-hidden">
                <img 
                  src={expert.image} 
                  alt={expert.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">{expert.name}</h3>
                <p className="text-jicai-blue text-sm font-bold uppercase tracking-wider mb-3">{expert.title}</p>
                <p className="text-gray-400 text-sm">{expert.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
