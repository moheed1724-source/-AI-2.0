import React from 'react';
import { motion } from 'motion/react';
import { Award, BookOpen, Star, Shield } from 'lucide-react';

export const Experts: React.FC = () => {
  const experts = [
    {
      name: "Emma",
      title: "济才留德高级规划师 / 欧洲部负责人",
      image: "/teacher2.jpg", 
      desc: "深耕德国与法国留学申请指导。擅长从数据模型视角出发，为双非院校及跨专业申请者制定逆袭方案。极度熟悉留德学分匹配逻辑，精准把控 APS 审核命脉与名校 NC 受限专业录取规则。",
      tags: ["德法双申专家", "APS 面谈辅导", "低均分逆袭"]
    },
    {
      name: "Markus 老师",
      title: "资深文书与网申专家",
      image: "/teacher.jpg", 
      desc: "德国慕尼黑工业大学 (TUM) 荣誉校友。精通全德大学网申系统 (Uni-assist) 潜规则，尤其擅长处理最令学生头疼的 ECTS 课程描述 (Modulhandbuch) 翻译与工科动机信精修。",
      tags: ["TUM 校友", "课程描述精修", "工科大牛"]
    },
    {
      name: "Julia 老师",
      title: "疑难签证与境外法务督导",
      image: "/teacher3.jpg", 
      desc: "拥有多年德国本土生活与法务对接经验。专注解决大龄留学、二审递签等疑难杂症。为学生提供从接机落户、保险开通到大学注册的保姆式行前与境外指导。",
      tags: ["疑难签证", "境外落户", "生活指南"]
    }
  ];

  return (
    <section id="experts" className="py-24 bg-jicai-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">比系统更懂你的，是我们的智囊团</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            AI 评估提供宏观概率，而我们的专家团队将深入您的每一份成绩单，为您手工校准学分缺口，护航 APS 审核。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experts.map((expert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-jicai-blue/50 transition-all group"
            >
              <div className="h-64 overflow-hidden relative">
                {/* 如果本地图片丢失，这里会有优雅的占位背景 */}
                <div className="absolute inset-0 bg-gradient-to-t from-jicai-black to-transparent z-10"></div>
                <img 
                  src={expert.image} 
                  alt={expert.name} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                <div className="absolute bottom-4 left-4 z-20">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    {expert.name}
                    {index === 0 && <Star size={16} className="text-yellow-400 fill-current" />}
                  </h3>
                  <p className="text-jicai-blue font-medium">{expert.title}</p>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-400 text-sm mb-6 leading-relaxed min-h-[80px]">
                  {expert.desc}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {expert.tags.map((tag, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 text-gray-300 text-xs rounded-full border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <button 
                  onClick={() => document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full py-3 bg-white/5 hover:bg-jicai-blue text-white rounded-xl transition-colors font-medium flex items-center justify-center gap-2 group-hover:shadow-[0_0_15px_rgba(0,112,243,0.3)]"
                >
                  <Shield size={16} /> 预约专家进行学分查漏
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
