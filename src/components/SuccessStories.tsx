import React from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const cases = [
  {
    name: "张同学",
    bg: "双非一本 GPA 83",
    offer: "慕尼黑工业大学",
    major: "机械工程",
    comment: "济才的规划非常精准，帮助我挖掘了科研经历的亮点，成功逆袭TUM。"
  },
  {
    name: "李同学",
    bg: "211院校 GPA 88",
    offer: "亚琛工业大学",
    major: "电气工程",
    comment: "文书老师非常专业，针对亚琛的课程匹配度做了详细的分析和解释。"
  },
  {
    name: "王同学",
    bg: "985院校 GPA 85",
    offer: "海德堡大学",
    major: "物理学",
    comment: "从APS审核到签证办理，全程都很顺利，感谢老师们的耐心指导。"
  }
];

export const SuccessStories: React.FC = () => {
  return (
    <section id="success" className="py-20 bg-jicai-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">成功案例</h2>
          <p className="text-gray-400">用结果说话，见证每一个梦想的实现</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white/5 p-8 rounded-2xl border border-white/5 relative"
            >
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-jicai-blue rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                “
              </div>
              <div className="mb-6 mt-2">
                <div className="flex gap-1 text-yellow-500 mb-4">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-gray-300 italic mb-6">"{item.comment}"</p>
              </div>
              <div className="border-t border-white/10 pt-6">
                <div className="flex justify-between items-end">
                  <div>
                    <h4 className="text-white font-bold text-lg">{item.name}</h4>
                    <p className="text-gray-500 text-sm">{item.bg}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 uppercase">Offer</p>
                    <p className="text-jicai-blue font-bold">{item.offer}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
