// pages/ip/ip.js
const { API } = require('../../utils/api.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputText: '', // 输入的IP内容
    results: [], // 复刻结果列表
    loading: false, // 加载状态
    error: '', // 错误信息
    isButtonDisabled: true // 按钮是否禁用
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('IP复刻页面加载');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('IP复刻页面显示');
  },

  /**
   * 输入框内容变化处理
   * @param {Object} e 事件对象
   */
  onInputChange: function (e) {
    const value = e.detail.value;
    this.setData({
      inputText: value,
      error: '', // 清除错误信息
      isButtonDisabled: !value.trim() // 根据输入内容更新按钮状态
    });
  },

  /**
   * 开始IP复刻
   */
  generateIP: function () {
    const inputText = this.data.inputText.trim();
    if (!inputText) {
      this.setData({
        error: '请输入要复刻的IP内容'
      });
      return;
    }

    this.setData({
      loading: true,
      error: '',
      results: []
    });

    // 模拟API调用
    this.callIPAPI(inputText);
  },

  /**
   * 调用IP复刻API
   * @param {string} text 输入文本
   */
  callIPAPI: function (text) {
    console.log('开始调用IP复刻API:', text);
    
    API.generateIP(text)
      .then((res) => {
        console.log('API调用成功:', res);
        
        this.setData({
          loading: false,
          results: res.data.results || res.data.list || [],
          error: ''
        });
        
        wx.showToast({
          title: 'IP复刻完成',
          icon: 'success',
          duration: 1500
        });
      })
      .catch((err) => {
        console.error('IP复刻失败:', err);
        
        // 显示详细错误信息给开发者
        this.setData({
          loading: false,
          error: err.message || 'IP复刻失败'
        });
        
        // 显示开发提示
        wx.showModal({
          title: '调试信息',
          content: `API调用失败：${err.message}\n\n开发环境解决方案：\n1. 确保本地服务器已启动\n2. 在微信开发者工具中开启"不校验合法域名"\n3. 或使用模拟数据进行开发`,
          confirmText: '使用模拟数据',
          cancelText: '重试',
          success: (res) => {
            if (res.confirm) {
              // 使用模拟数据
              this.setData({
                results: this.generateMockResults(text),
                loading: false,
                error: ''
              });

              wx.showToast({
                title: '已切换到模拟数据',
                icon: 'success'
              });
            }
          }
        });
      });
  },

  /**
   * 生成模拟的IP复刻结果
   * @param {string} originalText 原始文本
   * @returns {Array} 复刻结果数组
   */
  generateMockResults: function (originalText) {
    const templates = [
      `基于"${originalText}"的核心特征，我们可以打造一个具有相似魅力但独特表达的IP形象。`,
      `借鉴"${originalText}"的成功元素，结合当下流行趋势，创造出更具时代感的IP内容。`,
      `以"${originalText}"为灵感源泉，通过创新的表现手法，塑造出既熟悉又新颖的IP角色。`,
      `参考"${originalText}"的精髓，融入个性化元素，打造专属的IP品牌形象。`,
      `从"${originalText}"中提取关键特质，运用现代化的设计理念，重新诠释IP的价值内涵。`
    ];

    // 随机选择3-4个模板
    const selectedTemplates = templates
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 2) + 3);

    return selectedTemplates;
  },

  /**
   * 复制结果到剪贴板
   * @param {Object} e 事件对象
   */
  copyResult: function (e) {
    const index = e.currentTarget.dataset.index;
    const result = this.data.results[index];
    
    wx.setClipboardData({
      data: result,
      success: () => {
        wx.showToast({
          title: '复制成功',
          icon: 'success'
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
      title: 'IP复刻工具 - 创意无限',
      path: '/pages/ip/ip'
    };
  }
});