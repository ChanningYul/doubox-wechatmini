/**
 * 首页逻辑文件
 * 处理首页的交互和页面跳转
 */
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tools: [
      {
        name: '视频去水印',
        icon: '🎬',
        path: '/pages/watermark/watermark'
      },
      {
        name: '文案提取',
        icon: '📄',
        path: '/pages/extract/extract'
      },
      {
        name: '文案仿写',
        icon: '📝',
        path: '/pages/rewrite/rewrite'
      },
      {
        name: 'IP复刻',
        icon: '📋',
        path: '/pages/ip/ip'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('首页加载');
    this.checkUpdate();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('首页显示');
  },

  /**
   * 跳转到视频去水印页面
   */
  goToWatermark: function () {
    wx.navigateTo({
      url: '/pages/watermark/watermark',
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 跳转到文案提取页面
   */
  goToExtract: function () {
    wx.navigateTo({
      url: '/pages/extract/extract',
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 跳转到文案仿写页面
   */
  goToRewrite: function () {
    wx.navigateTo({
      url: '/pages/rewrite/rewrite',
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 跳转到IP复刻页面
   */
  goToIP: function () {
    wx.showToast({
      title: 'IP复刻功能开发中',
      icon: 'none',
      duration: 2000
    });
  },

  /**
   * 检查小程序更新
   */
  checkUpdate: function () {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          console.log('发现新版本');
        }
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: 'doubox-抖音工具箱',
      desc: '视频去水印、文案提取、文案仿写等实用工具',
      path: '/pages/index/index'
    };
  },

  /**
   * 用户点击右上角分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: 'doubox-抖音工具箱',
      query: '',
      imageUrl: ''
    };
  }
});