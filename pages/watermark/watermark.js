/**
 * 视频去水印页面逻辑
 * 处理视频链接输入和去水印功能
 */
const { API } = require('../../utils/api.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoUrl: '', // 视频链接
    result: null, // 处理结果
    loading: false, // 加载状态
    error: '', // 错误信息
    isButtonDisabled: true, // 按钮是否禁用
    showResult: false, // 是否显示结果框
    resultUrl: '' // 结果URL
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('视频去水印页面加载');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('视频去水印页面显示');
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
      isButtonDisabled: !value.trim(), // 根据输入内容更新按钮状态
      showResult: false, // 隐藏结果框
      resultUrl: '' // 清空结果URL
    });
  },

  /**
   * 去水印功能
   */
  removeWatermark: function () {
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

    // 开始处理
    this.setData({
      loading: true,
      error: '',
      result: null
    });

    // 模拟API调用
    this.callWatermarkAPI(videoUrl);
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
   * 调用去水印API
   * @param {String} url 视频链接
   */
  callWatermarkAPI: function (url) {
    console.log('开始调用去水印API:', url);
    
    API.removeWatermark(url)
      .then((res) => {
        console.log('API调用成功:', res);
        
        // 根据API接口文档，成功响应格式为 { "text": "视频真实下载URL" }
        const realVideoUrl = res.text;
        
        if (!realVideoUrl) {
          throw new Error('未获取到有效的视频下载地址');
        }
        
        this.setData({
          loading: false,
          showResult: true,
          resultUrl: realVideoUrl,
          error: ''
        });
        
        wx.showToast({
          title: '处理完成',
          icon: 'success',
          duration: 1500
        });
      })
      .catch((err) => {
        console.error('视频去水印失败:', err);
        
        this.setData({
          loading: false,
          showResult: false,
          resultUrl: '',
          error: ''
        });
        
        // 显示失败toast
        wx.showToast({
          title: '提取失败，请稍后尝试！',
          icon: 'none',
          duration: 2000
        });
      });
  },

  /**
   * 生成模拟处理结果
   * @returns {Object} 模拟结果
   */
  generateMockResult: function () {
    const mockTitles = [
      '超实用的生活小技巧分享',
      '今天教大家一个神奇的方法',
      '这个技巧太好用了，必须分享',
      '学会这招，生活更轻松',
      '简单几步，效果惊人'
    ];
    
    const mockAuthors = [
      '生活小达人',
      '技巧分享师',
      '实用小贴士',
      '生活妙招王',
      '日常小窍门'
    ];
    
    return {
      title: mockTitles[Math.floor(Math.random() * mockTitles.length)],
      author: mockAuthors[Math.floor(Math.random() * mockAuthors.length)],
      duration: '00:' + (Math.floor(Math.random() * 50) + 10).toString().padStart(2, '0'),
      downloadUrl: 'https://mock-download-url.com/video.mp4',
      cover: 'https://via.placeholder.com/400x600/4FC3F7/ffffff?text=Video+Cover'
    };
  },

  /**
   * 下载视频
   */
  downloadVideo: function () {
    const { result } = this.data;
    
    if (!result || !result.downloadUrl) {
      wx.showToast({
        title: '没有可下载的视频',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '准备下载...'
    });

    // 模拟下载过程
    setTimeout(() => {
      wx.hideLoading();
      wx.showModal({
        title: '下载提示',
        content: '由于小程序限制，请复制链接到浏览器中下载视频',
        confirmText: '复制链接',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.copyDownloadUrl();
          }
        }
      });
    }, 1000);

    // 实际项目中的下载逻辑
    /*
    wx.downloadFile({
      url: result.downloadUrl,
      success: (res) => {
        if (res.statusCode === 200) {
          wx.saveVideoToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              wx.showToast({
                title: '保存成功',
                icon: 'success'
              });
            },
            fail: () => {
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              });
            }
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '下载失败',
          icon: 'none'
        });
      }
    });
    */
  },

  /**
   * 复制结果URL到剪贴板
   */
  copyResultUrl: function () {
    const { resultUrl } = this.data;
    
    if (!resultUrl) {
      wx.showToast({
        title: '没有可复制的链接',
        icon: 'none'
      });
      return;
    }

    wx.setClipboardData({
      data: resultUrl,
      success: () => {
        wx.showToast({
          title: '已复制',
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
   * 复制下载链接
   */
  copyDownloadUrl: function () {
    const { result } = this.data;
    
    if (!result || !result.downloadUrl) {
      wx.showToast({
        title: '没有可复制的链接',
        icon: 'none'
      });
      return;
    }

    wx.setClipboardData({
      data: result.downloadUrl,
      success: () => {
        wx.showToast({
          title: '链接已复制',
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
      title: '视频去水印工具 - doubox工具箱',
      desc: '快速去除抖音视频水印',
      path: '/pages/watermark/watermark'
    };
  }
});