/**
 * API服务模块
 * 统一管理网络请求和接口调用
 */

// API基础配置
const API_CONFIG = {
  baseUrl: 'http://localhost:8002/api', // API服务地址
  timeout: 10000, // 请求超时时间
  header: {
    'Content-Type': 'application/json'
  }
};

/**
 * 通用请求方法
 * @param {Object} options 请求配置
 * @returns {Promise} 请求结果
 */
const request = (options) => {
  return new Promise((resolve, reject) => {
    // 显示加载提示
    if (options.showLoading !== false) {
      wx.showLoading({
        title: options.loadingText || '请求中...',
        mask: true
      });
    }

    wx.request({
      url: `${API_CONFIG.baseUrl}${options.url}`,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        ...API_CONFIG.header,
        ...options.header
      },
      timeout: options.timeout || API_CONFIG.timeout,
      success: (res) => {
        // 隐藏加载提示
        if (options.showLoading !== false) {
          wx.hideLoading();
        }

        // 处理响应数据
        if (res.statusCode === 200) {
          if (res.data.code === 0 || res.data.success) {
            resolve(res.data);
          } else {
            // 业务错误
            const errorMsg = res.data.message || res.data.msg || '请求失败';
            if (options.showError !== false) {
              wx.showToast({
                title: errorMsg,
                icon: 'none',
                duration: 2000
              });
            }
            reject(new Error(errorMsg));
          }
        } else {
          // HTTP错误
          const errorMsg = `请求失败 (${res.statusCode})`;
          if (options.showError !== false) {
            wx.showToast({
              title: errorMsg,
              icon: 'none',
              duration: 2000
            });
          }
          reject(new Error(errorMsg));
        }
      },
      fail: (err) => {
        // 隐藏加载提示
        if (options.showLoading !== false) {
          wx.hideLoading();
        }

        // 网络错误
        const errorMsg = '网络连接失败，请检查网络设置';
        if (options.showError !== false) {
          wx.showToast({
            title: errorMsg,
            icon: 'none',
            duration: 2000
          });
        }
        reject(new Error(errorMsg));
      }
    });
  });
};

/**
 * GET请求
 * @param {String} url 请求地址
 * @param {Object} data 请求参数
 * @param {Object} options 其他配置
 * @returns {Promise} 请求结果
 */
const get = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'GET',
    data,
    ...options
  });
};

/**
 * POST请求
 * @param {String} url 请求地址
 * @param {Object} data 请求数据
 * @param {Object} options 其他配置
 * @returns {Promise} 请求结果
 */
const post = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'POST',
    data,
    ...options
  });
};

/**
 * PUT请求
 * @param {String} url 请求地址
 * @param {Object} data 请求数据
 * @param {Object} options 其他配置
 * @returns {Promise} 请求结果
 */
const put = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'PUT',
    data,
    ...options
  });
};

/**
 * DELETE请求
 * @param {String} url 请求地址
 * @param {Object} data 请求参数
 * @param {Object} options 其他配置
 * @returns {Promise} 请求结果
 */
const del = (url, data = {}, options = {}) => {
  return request({
    url,
    method: 'DELETE',
    data,
    ...options
  });
};

// 具体的API接口
const API = {
  /**
   * 文案提取接口
   * @param {String} videoUrl 视频链接
   * @returns {Promise} 提取结果
   */
  extractText: (videoUrl) => {
    return post('/extract/text', {
      url: videoUrl
    }, {
      loadingText: '提取中...',
      showLoading: true
    });
  },

  /**
   * 文案仿写接口
   * @param {String} originalText 原文案
   * @returns {Promise} 仿写结果
   */
  rewriteText: (originalText) => {
    return post('/rewrite/text', {
      text: originalText
    }, {
      loadingText: '仿写中...',
      showLoading: true
    });
  },

  /**
   * 视频去水印接口
   * @param {String} videoUrl 视频链接
   * @returns {Promise} 处理结果
   */
  removeWatermark: (videoUrl) => {
    return post('/watermark/remove', {
      url: videoUrl
    }, {
      loadingText: '处理中...',
      showLoading: true
    });
  },

  /**
   * 获取视频信息接口
   * @param {String} videoUrl 视频链接
   * @returns {Promise} 视频信息
   */
  getVideoInfo: (videoUrl) => {
    return post('/video/info', {
      url: videoUrl
    }, {
      loadingText: '获取信息中...',
      showLoading: true
    });
  },

  /**
   * 用户反馈接口
   * @param {Object} feedback 反馈内容
   * @returns {Promise} 提交结果
   */
  submitFeedback: (feedback) => {
    return post('/feedback/submit', feedback, {
      loadingText: '提交中...',
      showLoading: true
    });
  },

  /**
   * IP复刻接口
   * @param {String} inputText 输入的IP内容
   * @returns {Promise} 复刻结果
   */
  generateIP: (inputText) => {
    return post('/ip/generate', {
      text: inputText
    }, {
      loadingText: '生成中...',
      showLoading: true
    });
  },

  /**
   * 检查更新接口
   * @returns {Promise} 更新信息
   */
  checkUpdate: () => {
    return get('/app/check-update', {}, {
      showLoading: false,
      showError: false
    });
  }
};

module.exports = {
  request,
  get,
  post,
  put,
  del,
  API
};