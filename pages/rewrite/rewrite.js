/**
 * 文案仿写页面逻辑
 * 处理原文案输入和仿写功能
 */
const { API } = require('../../utils/api.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    originalText: '', // 原文案
    results: [], // 仿写结果列表
    loading: false, // 加载状态
    error: '', // 错误信息
    isButtonDisabled: true // 按钮是否禁用
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('文案仿写页面加载');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('文案仿写页面显示');
  },



  /**
   * 输入框内容变化处理
   * @param {Object} e 事件对象
   */
  onInputChange: function (e) {
    const value = e.detail.value;
    this.setData({
      originalText: value,
      error: '', // 清除错误信息
      isButtonDisabled: !value.trim() // 根据输入内容更新按钮状态
    });
  },

  /**
   * 文案仿写功能
   */
  rewriteText: function () {
    const { originalText } = this.data;
    
    // 验证输入
    if (!originalText.trim()) {
      this.setData({
        error: '请输入需要仿写的原文案'
      });
      return;
    }

    if (originalText.trim().length < 10) {
      this.setData({
        error: '文案内容太短，请输入至少10个字符'
      });
      return;
    }

    // 开始仿写
    this.setData({
      loading: true,
      error: '',
      results: []
    });

    // 模拟API调用
    this.callRewriteAPI(originalText);
  },

  /**
   * 调用文案仿写API
   * @param {String} text 原文案
   */
  callRewriteAPI: function (text) {
    console.log('开始调用文案仿写API:', text);
    
    API.rewriteText(text)
      .then((res) => {
        console.log('API调用成功:', res);
        
        // 根据API接口文档，成功响应格式为 { "text": "仿写文案内容" }
        const rewrittenText = res.text || '仿写完成，但未获取到内容';
        
        // 将单个仿写结果转换为数组格式以保持界面一致性
        // 如果需要多个版本，可以多次调用API或在后端实现批量生成
        const results = [rewrittenText];
        
        this.setData({
          loading: false,
          results: results,
          error: ''
        });
        
        wx.showToast({
          title: '仿写完成',
          icon: 'success',
          duration: 1500
        });
      })
      .catch((err) => {
        console.error('文案仿写失败:', err);
        
        // 根据错误类型提供更具体的错误信息
        let errorMessage = err.message || '仿写失败';
        let developmentTips = '';
        
        if (errorMessage.includes('密钥无效')) {
          developmentTips = '请检查 utils/api.js 中的 apiKey 配置';
        } else if (errorMessage.includes('今日免费使用次数已用完')) {
          developmentTips = '可以申请新的API密钥或等待明日重置';
        } else if (errorMessage.includes('网络')) {
          developmentTips = '请检查网络连接和AI服务状态';
        } else {
          developmentTips = '请检查输入文案格式或稍后重试';
        }
        
        this.setData({
          loading: false,
          error: errorMessage
        });
        
        // 显示开发提示
        wx.showModal({
          title: '仿写失败',
          content: `错误原因：${errorMessage}\n\n解决建议：${developmentTips}\n\n开发环境提示：\n1. 确保本地服务器已启动\n2. 在微信开发者工具中开启"不校验合法域名"\n3. 或使用模拟数据进行开发`,
          confirmText: '使用模拟数据',
          cancelText: '重试',
          success: (res) => {
            if (res.confirm) {
              // 如果API调用失败，使用模拟数据作为降级方案
              const mockResults = this.generateMockResults(text);
              
              this.setData({
                loading: false,
                results: mockResults,
                error: ''
              });
              
              wx.showToast({
                title: '已切换到模拟数据',
                icon: 'success',
                duration: 1500
              });
            }
          }
        });
      });
  },

  /**
   * 生成模拟仿写结果
   * @param {String} originalText 原文案
   * @returns {Array} 仿写结果数组
   */
  generateMockResults: function (originalText) {
    // 基于原文案生成不同风格的仿写版本
    const styles = [
      {
        prefix: '🔥热门推荐：',
        suffix: ' #热门 #推荐 #必看',
        transform: (text) => text.replace(/！/g, '！！！')
      },
      {
        prefix: '💡实用技巧：',
        suffix: ' #实用 #技巧 #干货分享',
        transform: (text) => text.replace(/。/g, '～')
      },
      {
        prefix: '✨精选内容：',
        suffix: ' #精选 #优质内容 #值得收藏',
        transform: (text) => text + '，你学会了吗？'
      },
      {
        prefix: '🎯重点关注：',
        suffix: ' #重点 #关注 #不容错过',
        transform: (text) => '姐妹们注意了！' + text
      },
      {
        prefix: '📢重要提醒：',
        suffix: ' #提醒 #重要 #必知',
        transform: (text) => text + '，记得点赞收藏哦！'
      }
    ];

    return styles.map(style => {
      let rewrittenText = style.transform(originalText);
      return style.prefix + rewrittenText + style.suffix;
    });
  },

  /**
   * 复制仿写结果
   * @param {Object} e 事件对象
   */
  copyResult: function (e) {
    const text = e.currentTarget.dataset.text;
    
    if (!text) {
      wx.showToast({
        title: '没有可复制的内容',
        icon: 'none'
      });
      return;
    }

    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 1500
        });
      },
      fail: () => {
        wx.showToast({
          title: '复制失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '文案仿写工具 - doubox工具箱',
      desc: '智能文案仿写，多种风格任你选择',
      path: '/pages/rewrite/rewrite'
    };
  }
});