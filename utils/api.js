/**
 * API服务模块
 * 统一管理网络请求和接口调用
 */

// API基础配置
const API_CONFIG = {
  baseUrl: 'https://a.starrysplendor.com', // doubox服务器API地址
  timeout: 10000, // 请求超时时间
  apiKey: 'your_api_key_here', // API密钥，需要替换为真实的密钥
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
      url: options.fullUrl || `${API_CONFIG.baseUrl}${options.url}`,
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
    return post('', {}, {
      loadingText: '提取中...',
      showLoading: true,
      fullUrl: `${API_CONFIG.baseUrl}/video2text?key=${API_CONFIG.apiKey}&url=${encodeURIComponent(videoUrl)}`
    });
  },

  /**
   * 文案仿写接口
   * @param {String} originalText 原文案
   * @returns {Promise} 仿写结果
   */
  rewriteText: (originalText) => {
    return post('', {}, {
      loadingText: '仿写中...',
      showLoading: true,
      fullUrl: `${API_CONFIG.baseUrl}/imitatetext?key=${API_CONFIG.apiKey}&text=${encodeURIComponent(originalText)}`
    });
  },

  /**
   * 视频去水印接口（获取真实视频URL）
   * @param {String} videoUrl 视频分享链接
   * @returns {Promise} 处理结果
   */
  removeWatermark: (videoUrl) => {
    return post('', {}, {
      loadingText: '处理中...',
      showLoading: true,
      fullUrl: `${API_CONFIG.baseUrl}/share2realurl?key=${API_CONFIG.apiKey}&share_text=${encodeURIComponent(videoUrl)}`
    });
  },

  /**
   * 查询剩余使用次数
   * @returns {Promise} 剩余次数信息
   */
  getRemainder: () => {
    return get('', {
      loadingText: '查询中...',
      showLoading: false,
      fullUrl: `${API_CONFIG.baseUrl}/getremainder?key=${API_CONFIG.apiKey}`
    });
  },

  /**
   * 从真实视频URL提取文案
   * @param {String} realVideoUrl 真实视频下载URL
   * @returns {Promise} 提取结果
   */
  extractTextFromRealVideo: (realVideoUrl) => {
    return post('', {}, {
      loadingText: '提取中...',
      showLoading: true,
      fullUrl: `${API_CONFIG.baseUrl}/realvideo2text?key=${API_CONFIG.apiKey}&url=${encodeURIComponent(realVideoUrl)}`
    });
  },

  // 注意：以下接口在新的API文档中暂未提供，如需使用请联系API提供方
  // getVideoInfo, submitFeedback, generateIP, checkUpdate
};

module.exports = {
  request,
  get,
  post,
  put,
  del,
  API
};