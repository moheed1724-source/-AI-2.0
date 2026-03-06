import React from 'react';

// 21 所德国著名院校：已全部替换为真实的无版权、无防盗链限制的高清风景图！
const universities = [
  { name: "慕尼黑工业大学", en: "TU Munich", desc: "德国顶尖理工大学，诺贝尔奖得主摇篮，TU9联盟成员。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/TUM_Hauptgeb%C3%A4ude.jpg/800px-TUM_Hauptgeb%C3%A4ude.jpg", link: "https://baike.baidu.com/item/慕尼黑工业大学" },
  { name: "亚琛工业大学", en: "RWTH Aachen", desc: "欧洲顶尖理工大学，机械工程专业世界闻名。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Hauptgeb%C3%A4ude_RWTH_Aachen_-_Panorama.jpg/800px-Hauptgeb%C3%A4ude_RWTH_Aachen_-_Panorama.jpg", link: "https://baike.baidu.com/item/亚琛工业大学" },
  { name: "海德堡大学", en: "Heidelberg University", desc: "德国最古老的大学，医学与生命科学领域的权威。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Heidelberg_Alte_Universit%C3%A4t.jpg/800px-Heidelberg_Alte_Universit%C3%A4t.jpg", link: "https://baike.baidu.com/item/海德堡大学" },
  { name: "柏林工业大学", en: "TU Berlin", desc: "德国最大的工业大学之一，坐落于首都柏林。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/TU_Berlin_Hauptgeb%C3%A4ude.jpg/800px-TU_Berlin_Hauptgeb%C3%A4ude.jpg", link: "https://baike.baidu.com/item/柏林工业大学" },
  { name: "卡尔斯鲁厄理工学院", en: "KIT", desc: "德国的MIT，计算机与工程的顶级殿堂。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Campus_S%C3%BCd_KIT.jpg/800px-Campus_S%C3%BCd_KIT.jpg", link: "https://baike.baidu.com/item/卡尔斯鲁厄理工学院" },
  { name: "慕尼黑大学", en: "LMU Munich", desc: "精英大学联盟成员，商科与文科全德顶尖。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/LMU_M%C3%BCnchen_Hauptgeb%C3%A4ude.jpg/800px-LMU_M%C3%BCnchen_Hauptgeb%C3%A4ude.jpg", link: "https://baike.baidu.com/item/慕尼黑大学" },
  { name: "柏林洪堡大学", en: "Humboldt University", desc: "被誉为“现代大学之母”，爱因斯坦曾在此任教。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Humboldt-Universit%C3%A4t_zu_Berlin_Hauptgeb%C3%A4ude.jpg/800px-Humboldt-Universit%C3%A4t_zu_Berlin_Hauptgeb%C3%A4ude.jpg", link: "https://baike.baidu.com/item/柏林洪堡大学" },
  { name: "柏林自由大学", en: "Free University of Berlin", desc: "德国精英大学，政治学与人文学科实力强劲。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Rost-_und_Silberlaube_FU_Berlin.jpg/800px-Rost-_und_Silberlaube_FU_Berlin.jpg", link: "https://baike.baidu.com/item/柏林自由大学" },
  { name: "斯图加特大学", en: "University of Stuttgart", desc: "位于德国汽车工业中心，汽车与航空工程顶尖。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Universit%C3%A4t_Stuttgart_Kollegiengeb%C3%A4ude_I.jpg/800px-Universit%C3%A4t_Stuttgart_Kollegiengeb%C3%A4ude_I.jpg", link: "https://baike.baidu.com/item/斯图加特大学" },
  { name: "达姆施塔特工业大学", en: "TU Darmstadt", desc: "TU9成员，计算机与人工智能领域领先。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Schloss_Darmstadt_2011.jpg/800px-Schloss_Darmstadt_2011.jpg", link: "https://baike.baidu.com/item/达姆施塔特工业大学" },
  { name: "德累斯顿工业大学", en: "TU Dresden", desc: "TU9中唯一包含医科和文科的综合性理工大学。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/TU_Dresden_-_Beyer-Bau.jpg/800px-TU_Dresden_-_Beyer-Bau.jpg", link: "https://baike.baidu.com/item/德累斯顿工业大学" },
  { name: "汉诺威大学", en: "Leibniz University", desc: "以莱布尼茨命名，机械与电气工程实力雄厚。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Welfenschloss_Hannover_2011.jpg/800px-Welfenschloss_Hannover_2011.jpg", link: "https://baike.baidu.com/item/汉诺威大学" },
  { name: "布伦瑞克工业大学", en: "TU Braunschweig", desc: "德国历史最悠久的理工大学，车辆工程强校。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/TU_Braunschweig_Altgeb%C3%A4ude.jpg/800px-TU_Braunschweig_Altgeb%C3%A4ude.jpg", link: "https://baike.baidu.com/item/布伦瑞克工业大学" },
  { name: "弗赖堡大学", en: "University of Freiburg", desc: "德国历史第五悠久的大学，微系统工程闻名。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Kollegiengeb%C3%A4ude_I_der_Universit%C3%A4t_Freiburg.jpg/800px-Kollegiengeb%C3%A4ude_I_der_Universit%C3%A4t_Freiburg.jpg", link: "https://baike.baidu.com/item/弗赖堡大学" },
  { name: "哥廷根大学", en: "University of Göttingen", desc: "走出过40多位诺贝尔奖得主的学术重镇。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Aula_der_Universit%C3%A4t_G%C3%B6ttingen.jpg/800px-Aula_der_Universit%C3%A4t_G%C3%B6ttingen.jpg", link: "https://baike.baidu.com/item/哥廷根大学" },
  { name: "图宾根大学", en: "University of Tübingen", desc: "医学与自然科学顶尖，欧洲最古老大学之一。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Neue_Aula_T%C3%BCbingen_2014.jpg/800px-Neue_Aula_T%C3%BCbingen_2014.jpg", link: "https://baike.baidu.com/item/图宾根大学" },
  { name: "波恩大学", en: "University of Bonn", desc: "数学与经济学顶尖，马克思的母校。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Kurf%C3%BCrstliches_Schloss_Bonn.jpg/800px-Kurf%C3%BCrstliches_Schloss_Bonn.jpg", link: "https://baike.baidu.com/item/波恩大学" },
  { name: "法兰克福大学", en: "Goethe University", desc: "坐落于欧洲金融中心，金融与商科优势明显。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/IG_Farben_Building%2C_Goethe_University_Frankfurt.jpg/800px-IG_Farben_Building%2C_Goethe_University_Frankfurt.jpg", link: "https://baike.baidu.com/item/法兰克福大学" },
  { name: "汉堡大学", en: "University of Hamburg", desc: "德国北部最大的大学，气象与海洋科学顶尖。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Universit%C3%A4t_Hamburg_Hauptgeb%C3%A4ude_2.jpg/800px-Universit%C3%A4t_Hamburg_Hauptgeb%C3%A4ude_2.jpg", link: "https://baike.baidu.com/item/汉堡大学" },
  { name: "科隆大学", en: "University of Cologne", desc: "德国第二大大学，经济系规模全德第一。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Universit%C3%A4t_zu_K%C3%B6ln_Hauptgeb%C3%A4ude.jpg/800px-Universit%C3%A4t_zu_K%C3%B6ln_Hauptgeb%C3%A4ude.jpg", link: "https://baike.baidu.com/item/科隆大学" },
  { name: "曼海姆大学", en: "University of Mannheim", desc: "被誉为“德国的哈佛”，商学院排名全德第一。", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Schloss_Mannheim_2011.jpg/800px-Schloss_Mannheim_2011.jpg", link: "https://baike.baidu.com/item/曼海姆大学" }
];

// 复制一份数组拼在后面，实现无缝首尾相连
const duplicatedUniversities = [...universities, ...universities];

export const UniversitySystem: React.FC = () => {
  // 获取项目的正确路径
  const basePath = import.meta.env.BASE_URL;

  return (
    <section id="system" className="py-20 bg-jicai-black overflow-hidden relative">
      
      {/* CSS 魔法：控制滚动速度和悬停暂停 */}
      <style>
        {`
          @keyframes custom-marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-custom-marquee {
            animation: custom-marquee 100s linear infinite;
          }
          .animate-custom-marquee:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 relative z-20">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">德国大学体系</h2>
          <p className="text-gray-400">严谨的学术传统与现代科技的完美结合 <span className="text-jicai-blue text-sm ml-2">(点击卡片查看百科)</span></p>
        </div>
      </div>

      <div className="relative w-full flex overflow-hidden">
        {/* 左右两侧的渐变黑影遮罩 */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-jicai-black to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-jicai-black to-transparent z-10 pointer-events-none"></div>

        <div className="flex gap-8 w-max px-4 animate-custom-marquee">
          {duplicatedUniversities.map((uni, index) => (
            <a
              key={index}
              href={uni.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[350px] shrink-0 group relative overflow-hidden rounded-2xl bg-jicai-dark border border-white/5 hover:border-jicai-blue/50 transition-colors block cursor-pointer"
            >
              <div className="h-48 overflow-hidden bg-gray-800">
                {/* 🌟 智能判断：如果是 http 开头的外部链接，就直接使用；否则才拼接本地路径 */}
                <img 
                  src={uni.image.startsWith('http') ? uni.image : `${basePath}${uni.image}`} 
                  alt={uni.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  loading="lazy" /* 添加懒加载，提升网页打开速度 */
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-jicai-blue transition-colors">{uni.name}</h3>
                <p className="text-sm text-jicai-blue mb-3">{uni.en}</p>
                <p className="text-gray-400 text-sm line-clamp-2">{uni.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
