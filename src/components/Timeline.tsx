import React from 'react';
import { motion } from 'motion/react';

export const Timeline: React.FC = () => {
  const steps = [
    {
      time: "准备期",
      title: "语言与APS",
      desc: "开始德语学习，准备APS审核材料。这是德国留学的敲门砖。"
    },
    {
      time: "申请期",
      title: "院校申请",
      desc: "根据自身背景筛选院校，准备动机信与简历，通过Uni-assist或学校官网递交。"
    },
    {
      time: "录取期",
      title: "办理签证",
      desc: "收到Zu（录取通知书），办理自保金，递签，安排住宿与行程。"
    },
    {
      time: "入学",
      title: "注册报到",
      desc: "抵达德国，完成大学注册，开启留学生涯。"
    }
  ];

  return (
    <section id="timeline" className="py-20 bg-jicai-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">留学申请时间轴</h2>
          <p className="text-gray-400">科学规划，步步为营</p>
        </div>

        <div className="relative">
          {/* Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-white/10 hidden md:block"></div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`flex flex-col md:flex-row items-center justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="w-full md:w-5/12"></div>
                
                <div className="z-10 flex items-center justify-center w-10 h-10 rounded-full bg-jicai-blue border-4 border-jicai-black shrink-0 my-4 md:my-0">
                  <span className="text-white font-bold text-xs">{index + 1}</span>
                </div>

                <div className="w-full md:w-5/12 bg-jicai-dark p-6 rounded-xl border border-white/5 hover:border-jicai-blue/50 transition-colors">
                  <span className="text-jicai-blue text-xs font-bold uppercase tracking-wider">{step.time}</span>
                  <h3 className="text-xl font-bold text-white mt-1 mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
