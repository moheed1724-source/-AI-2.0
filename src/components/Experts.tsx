import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Award, X, BookOpen, GraduationCap, CheckCircle2 } from 'lucide-react';

const experts = [
  {
    name: "Emma",
    title: "留学团队负责人",
    exp: "15年",
    cases: "1200+",
    desc: "累计规划上万名学子。",
    image: "/teacher.jpg",
    // 👇 新增的详细背景数据
    fullDesc: "拥有15年德国留学规划经验，曾亲访德国TU9及多所精英大学。擅长挖掘学生背景亮点，为低GPA、跨专业申请者提供逆袭方案。已帮助过千名学子斩获慕尼黑工业大学、亚琛工业大学等世界顶尖名校Offer。",
    specialties: ["TU9高端申请", "疑难案例扭转", "跨专业申请规划"],
    motto: "留学不仅是一纸Offer，更是人生轨迹的跨越。"
  },
  {
    name: "蒋老师",
    title: "资深欧亚专家",
    exp: "13年",
    cases: "800+",
    desc: "90年代公派留学家庭，专注小语种领域13年",
    image: "/teacher2.jpg",
    fullDesc: "出身90年代公派留学家庭，深谙欧洲教育体系与中国留学生的痛点。13年小语种国家留学申请经验，精通德国各州教育政策、APS审核技巧及拒签信申诉。不仅关注申请成功率，更关注学生在德的长期职业发展。",
    specialties: ["APS审核辅导", "文商科名校申请", "签证疑难杂症"],
    motto: "用最严谨的态度，做最温暖的教育。"
  },
  {
    name: "Thomas",
    title: "资深德语老师",
    exp: "11年",
    cases: "500+",
    desc: "多年德英双语教学经验。",
    image: "/teacher3.jpg",
    fullDesc: "拥有11年德英双语教学经验，TestDaF（德福）及 DSH 考试辅导专家。独创“沉浸式逻辑德语学习法”，帮助数百名零基础学生在一年内突破德语瓶颈，顺利取得德国大学直接入学语言资格。",
    specialties: ["德福考前冲刺", "DSH保过规划", "学术德语写作辅导"],
    motto: "语言不仅是工具，更是融入德国思维的钥匙。"
  }
];

export const Experts: React.FC = () => {
  const [selectedExpert, setSelectedExpert] = useState<typeof experts[0] | null>(null);

  // 解决图片路径问题
  const basePath = import.meta.env.BASE_URL;

  return (
    <section id="experts" className="py-20 bg-jicai-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">专家团队</h2>
          <p className="text-gray-400">最专业的导师，为您保驾护航 <span className="text-jicai-blue text-sm ml-2">(点击查看导师详情)</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experts.map((expert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              onClick={() => setSelectedExpert(expert)}
              className="group bg-jicai-dark rounded-2xl overflow-hidden border border-white/5 hover:border-jicai-blue/50 transition-all shadow-lg hover:shadow-jicai-blue/10 cursor-pointer"
            >
              <div className="h-64 overflow-hidden relative bg-gray-800">
                <img 
                  src={`${basePath}${expert.image.replace(/^\//, '')}`} 
                  alt={expert.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-jicai-dark to-transparent h-20"></div>
              </div>
              <div className="p-6 relative -mt-6">
                <div className="bg-jicai-blue text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-3 shadow-lg">
                  {expert.title}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-jicai-blue transition-colors">{expert.name}</h3>
                
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

      {/* 🌟 导师详情弹窗 */}
      <AnimatePresence>
        {selectedExpert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setSelectedExpert(null)} 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} 
              className="relative bg-jicai-dark border border-white/10 rounded-2xl overflow-hidden max-w-2xl w-full shadow-2xl z-10 flex flex-col md:flex-row"
            >
              <button onClick={() => setSelectedExpert(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white z-20 bg-black/50 rounded-full p-1"><X size={20} /></button>
              
              <div className="md:w-2/5 h-64 md:h-auto bg-gray-800 relative">
                <img src={`${basePath}${selectedExpert.image.replace(/^\//, '')}`} alt={selectedExpert.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-jicai-dark to-transparent md:hidden"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-jicai-dark hidden md:block"></div>
              </div>

              <div className="p-8 md:w-3/5 relative">
                <div className="bg-jicai-blue/20 text-jicai-blue border border-jicai-blue/30 text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">
                  {selectedExpert.title}
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{selectedExpert.name}</h3>
                <p className="text-gray-400 text-xs italic mb-6">"{selectedExpert.motto}"</p>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2"><BookOpen size={16} className="text-jicai-blue"/> 导师简介</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{selectedExpert.fullDesc}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2"><GraduationCap size={16} className="text-jicai-blue"/> 擅长领域</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedExpert.specialties.map((spec, i) => (
                        <span key={i} className="text-xs bg-white/5 border border-white/10 text-gray-300 px-2 py-1 rounded flex items-center gap-1">
                          <CheckCircle2 size={12} className="text-jicai-blue" /> {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                  <div className="text-sm text-gray-400">想要获取专属规划？</div>
                  <button onClick={() => document.getElementById('assessment')?.scrollIntoView({ behavior: 'smooth' })} className="bg-jicai-blue hover:bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors">
                    立即预约
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
