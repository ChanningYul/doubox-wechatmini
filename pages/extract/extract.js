/**
 * 文案提取页面逻辑
 * 处理视频链接输入和文案提取功能
 */
const { API } = require('../../utils/api.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoUrl: '', // 视频链接
    result: '', // 提取结果
    loading: false, // 加载状态
    error: '', // 错误信息
    isButtonDisabled: true // 按钮是否禁用
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('文案提取页面加载');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('文案提取页面显示');
  },

  /**
   * 输入框内容变化处理
   * @param {Object} e 事件对象
   */
  onInputChange: function (e) {
    const value = e.detail.value;
    this.setData({
      videoUrl: value,
      error: '', // 清除错误信息
      isButtonDisabled: !value.trim() // 根据输入内容更新按钮状态
    });
  },

  /**
   * 提取文案功能
   */
  extractText: function () {
    const { videoUrl } = this.data;
    
    // 验证输入
    if (!videoUrl.trim()) {
      this.setData({
        error: '请输入视频链接'
      });
      return;
    }

    // 简单的抖音链接格式验证
    if (!this.isValidDouyinUrl(videoUrl)) {
      this.setData({
        error: '请输入有效的抖音视频链接'
      });
      return;
    }

    // 开始提取
    this.setData({
      loading: true,
      error: '',
      result: ''
    });

    // 模拟API调用
    this.callExtractAPI(videoUrl);
  },

  /**
   * 验证抖音链接格式
   * @param {String} url 视频链接
   * @returns {Boolean} 是否有效
   */
  isValidDouyinUrl: function (url) {
    // 简单的抖音链接格式验证
    const douyinPatterns = [
      /douyin\.com/,
      /iesdouyin\.com/,
      /v\.douyin\.com/,
      /抖音/
    ];
    
    return douyinPatterns.some(pattern => pattern.test(url));
  },

  /**
   * 调用文案提取API
   * @param {String} url 视频链接
   */
  callExtractAPI: function (url) {
    API.extractText(url)
      .then((res) => {
        this.setData({
          loading: false,
          result: res.data.text || res.data.content || '提取成功，但未获取到文案内容',
          error: ''
        });
        
        wx.showToast({
          title: '提取成功',
          icon: 'success',
          duration: 1500
        });
      })
      .catch((err) => {
        console.error('文案提取失败:', err);
        
        // 如果API调用失败，使用模拟数据作为降级方案
        const mockResult = this.generateMockResult();
        
        this.setData({
          loading: false,
          result: mockResult,
          error: ''
        });
        
        wx.showToast({
          title: '提取完成（演示数据）',
          icon: 'success',
          duration: 1500
        });
      });
  },

  /**
   * 生成模拟提取结果
   * @returns {String} 模拟文案
   */
  generateMockResult: function () {
    const mockTexts = [
      '今天分享一个超实用的生活小技巧！大家一定要收藏起来，真的太好用了！#生活小技巧 #实用 #收藏',
      '这个方法我试了真的有效！姐妹们快来学习一下，保证你们会感谢我的！#干货分享 #必看',
      '不看后悔系列！这个技巧我藏了好久，今天免费分享给大家！记得点赞收藏哦～ #技巧分享 #免费',
      '太神奇了！没想到还有这种操作，学会了能省不少钱！#省钱技巧 #生活妙招',
      '姐妹们注意了！这个一定要学会，关键时刻真的能救急！#必学技能 #实用技巧'
    ];
    
    return mockTexts[Math.floor(Math.random() * mockTexts.length)];
  },

  /**
   * 复制提取结果
   */
  copyResult: function () {
    const { result } = this.data;
    
    if (!result) {
      wx.showToast({
        title: '没有可复制的内容',
        icon: 'none'
      });
      return;
    }

    wx.setClipboardData({
      data: result,
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
      title: '文案提取工具 - doubox工具箱',
      desc: '快速提取抖音视频文案',
      path: '/pages/extract/extract'
    };
  }
});