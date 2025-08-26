/**
 * API服务模块
 * 统一管理网络请求和接口调用
 */

// API基础配置
const API_CONFIG = {
  baseUrl: 'https://a.starrysplendor.com', // 生产环境API地址
  devBaseUrl: 'http://localhost:8000', // 开发环境API地址
  timeout: 180000, // 请求超时时间
  apiKey: 'd73e1a33-2a92-4812-a5a8-195e307d44f2', // API密钥，需要替换为真实的密钥
  header: {
    'Content-Type': 'application/json'
  },
  isDev: false, // 开发模式标志，生产环境设为false
  useMockData: false
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

    // 根据环境选择API地址
    const currentBaseUrl = API_CONFIG.isDev ? API_CONFIG.devBaseUrl : API_CONFIG.baseUrl;

    wx.request({
      url: options.fullUrl || `${currentBaseUrl}${options.url}`,
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

        // 处理响应数据 - 根据API接口文档更新处理逻辑
        if (res.statusCode === 200) {
          // 根据新的API接口文档，成功响应直接返回数据对象
          resolve(res.data);
        } else if (res.statusCode === 400) {
          // 400错误：请求参数错误或业务逻辑错误
          const errorMsg = res.data?.detail || '请求参数错误';
          if (options.showError !== false) {
            wx.showToast({
              title: errorMsg,
              icon: 'none',
              duration: 2000
            });
          }
          reject(new Error(errorMsg));
        } else if (res.statusCode === 401) {
          // 401错误：密钥无效或配额用完
          const errorMsg = res.data?.detail || '密钥无效';
          let userFriendlyMsg = errorMsg;
          
          if (errorMsg === 'Invalid key') {
            userFriendlyMsg = 'API密钥无效，请检查配置';
          } else if (errorMsg === 'out') {
            userFriendlyMsg = '今日免费使用次数已用完';
          }
          
          if (options.showError !== false) {
            wx.showToast({
              title: userFriendlyMsg,
              icon: 'none',
              duration: 2000
            });
          }
          reject(new Error(userFriendlyMsg));
        } else if (res.statusCode === 500) {
          // 500错误：服务器内部错误
          const errorMsg = res.data?.detail || '服务器内部错误';
          if (options.showError !== false) {
            wx.showToast({
              title: errorMsg,
              icon: 'none',
              duration: 2000
            });
          }
          reject(new Error(errorMsg));
        } else {
          // 其他HTTP错误
          const errorMsg = res.data?.detail || `请求失败 (${res.statusCode})`;
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

        // 网络错误详细处理
        let errorMsg = '网络连接失败';
        
        // 详细的错误信息记录
        const errorDetails = {
          url: options.fullUrl || `${currentBaseUrl}${options.url}`,
          method: options.method || 'GET',
          data: options.data,
          error: err,
          errorType: err.errMsg || 'unknown',
          isDev: API_CONFIG.isDev,
          currentBaseUrl: currentBaseUrl
        };
        
        console.error('详细网络请求失败信息:', errorDetails);
        
        // 根据具体错误类型提供不同的解决方案
        if (err.errMsg) {
          if (err.errMsg.includes('timeout')) {
            errorMsg = '请求超时，请检查网络连接或服务器响应时间';
          } else if (err.errMsg.includes('fail')) {
            if (API_CONFIG.isDev && currentBaseUrl.startsWith('http://')) {
              errorMsg = 'HTTP请求被拦截：请确认已开启"不校验合法域名"选项';
            } else {
              errorMsg = '请求失败：请检查服务器地址和网络连接';
            }
          } else if (err.errMsg.includes('ssl')) {
            errorMsg = 'SSL证书错误：请检查HTTPS配置';
          } else {
            errorMsg = `网络错误：${err.errMsg}`;
          }
        } else if (API_CONFIG.isDev && currentBaseUrl.startsWith('http://')) {
          errorMsg = '开发环境网络错误：请检查本地服务器是否启动，或在微信开发者工具中开启"不校验合法域名"';
        } else {
          errorMsg = '网络连接失败，请检查网络设置或服务器状态';
        }
        
        if (options.showError !== false) {
          wx.showToast({
            title: errorMsg,
            icon: 'none',
            duration: 3000
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
    return post('/video2text', {
      key: API_CONFIG.apiKey,
      url: videoUrl
    }, {
      showLoading: false
    });
  },

  /**
   * 文案仿写接口
   * @param {String} originalText 原文案
   * @returns {Promise} 仿写结果
   */
  rewriteText: (originalText) => {
    return post('/imitatetext', {
      key: API_CONFIG.apiKey,
      text: originalText
    }, {
      showLoading: false
    });
  },

  /**
   * 视频去水印接口（获取真实视频URL）
   * @param {String} videoUrl 视频分享链接
   * @returns {Promise} 处理结果
   */
  removeWatermark: (videoUrl) => {
    return post('/share2realurl', {
      key: API_CONFIG.apiKey,
      share_text: videoUrl
    }, {
      showLoading: false
    });
  },

  /**
   * IP复刻接口
   * @param {String} inputText IP内容
   * @returns {Promise} 复刻结果
   */
  generateIP: (inputText) => {
    return post('/generateip', {
      key: API_CONFIG.apiKey,
      text: inputText
    }, {
      showLoading: false
    });
  }

  // 注意：以下接口在新的API文档中暂未提供，如需使用请联系API提供方
  // getVideoInfo, submitFeedback, checkUpdate
};

module.exports = {
  request,
  get,
  post,
  put,
  del,
  API
};