const handleSubmit = async () => {
    if (!formData.contact) {
      alert("请填写您的微信号或手机号，以便为您发送详细报告！");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          // 🌟 我已经把你截图里的专属 Key 填进来了！
          access_key: "a531da67-7614-4c7b-992d-e87c02d63ac2", 
          '联系方式': formData.contact,
          '申请学位': formData.degree,
          'GPA': formData.gpa,
          '院校背景': formData.background,
          '目标专业': formData.major,
          '语言水平': formData.language,
          '意向城市': formData.city
        })
      });

      if (response.ok) {
        // 🌟 提交成功后的友好提示
        alert("🎉 提交成功！我们的顾问已收到您的信息，将尽快与您联系。");
      }
    } catch (error) {
      console.error("提交表单失败", error);
    }

    // 继续执行原有的动画和报告显示逻辑
    setTimeout(() => {
      const scoreResult = calculateScore(formData as UserInput);
      setResult(scoreResult);
      setLoading(false);
      setStep('result');
      setTimeout(() => setShowFullReport(true), 2000);
    }, 800); 
  };
