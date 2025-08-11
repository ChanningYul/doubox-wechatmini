/**
 * 通用工具函数库
 * 提供项目中常用的工具方法
 */

/**
 * 格式化时间
 * @param {Date} date 日期对象
 * @param {String} format 格式化字符串
 * @returns {String} 格式化后的时间字符串
 */
const formatTime = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return format
    .replace('YYYY', year)
    .replace('MM', month.toString().padStart(2, '0'))
    .replace('DD', day.toString().padStart(2, '0'))
    .replace('HH', hour.toString().padStart(2, '0'))
    .replace('mm', minute.toString().padStart(2, '0'))
    .replace('ss', second.toString().padStart(2, '0'));
};

/**
 * 防抖函数
 * @param {Function} func 要防抖的函数
 * @param {Number} wait 等待时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * 节流函数
 * @param {Function} func 要节流的函数
 * @param {Number} limit 时间间隔（毫秒）
 * @returns {Function} 节流后的函数
 */
const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * 验证URL格式
 * @param {String} url 要验证的URL
 * @returns {Boolean} 是否为有效URL
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 验证抖音链接
 * @param {String} url 要验证的链接
 * @returns {Boolean} 是否为有效的抖音链接
 */
const isDouyinUrl = (url) => {
  const douyinPatterns = [
    /douyin\.com/,
    /iesdouyin\.com/,
    /v\.douyin\.com/,
    /抖音/
  ];
  
  return douyinPatterns.some(pattern => pattern.test(url));
};

/**
 * 复制文本到剪贴板
 * @param {String} text 要复制的文本
 * @returns {Promise} 复制结果
 */
const copyToClipboard = (text) => {
  return new Promise((resolve, reject) => {
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 1500
        });
        resolve();
      },
      fail: (err) => {
        wx.showToast({
          title: '复制失败',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
};

/**
 * 显示加载提示
 * @param {String} title 提示文字
 */
const showLoading = (title = '加载中...') => {
  wx.showLoading({
    title: title,
    mask: true
  });
};

/**
 * 隐藏加载提示
 */
const hideLoading = () => {
  wx.hideLoading();
};

/**
 * 显示成功提示
 * @param {String} title 提示文字
 * @param {Number} duration 显示时长
 */
const showSuccess = (title, duration = 1500) => {
  wx.showToast({
    title: title,
    icon: 'success',
    duration: duration
  });
};

/**
 * 显示错误提示
 * @param {String} title 提示文字
 * @param {Number} duration 显示时长
 */
const showError = (title, duration = 2000) => {
  wx.showToast({
    title: title,
    icon: 'none',
    duration: duration
  });
};

/**
 * 显示确认对话框
 * @param {String} title 标题
 * @param {String} content 内容
 * @returns {Promise} 用户选择结果
 */
const showConfirm = (title, content) => {
  return new Promise((resolve) => {
    wx.showModal({
      title: title,
      content: content,
      success: (res) => {
        resolve(res.confirm);
      }
    });
  });
};

/**
 * 获取系统信息
 * @returns {Object} 系统信息
 */
const getSystemInfo = () => {
  return wx.getSystemInfoSync();
};

/**
 * 检查网络状态
 * @returns {Promise} 网络状态
 */
const checkNetworkStatus = () => {
  return new Promise((resolve, reject) => {
    wx.getNetworkType({
      success: (res) => {
        resolve(res.networkType);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
};

/**
 * 存储数据到本地
 * @param {String} key 键名
 * @param {*} data 数据
 * @returns {Promise} 存储结果
 */
const setStorage = (key, data) => {
  return new Promise((resolve, reject) => {
    wx.setStorage({
      key: key,
      data: data,
      success: () => resolve(),
      fail: (err) => reject(err)
    });
  });
};

/**
 * 从本地获取数据
 * @param {String} key 键名
 * @returns {Promise} 获取的数据
 */
const getStorage = (key) => {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: key,
      success: (res) => resolve(res.data),
      fail: (err) => reject(err)
    });
  });
};

/**
 * 删除本地存储数据
 * @param {String} key 键名
 * @returns {Promise} 删除结果
 */
const removeStorage = (key) => {
  return new Promise((resolve, reject) => {
    wx.removeStorage({
      key: key,
      success: () => resolve(),
      fail: (err) => reject(err)
    });
  });
};

module.exports = {
  formatTime,
  debounce,
  throttle,
  isValidUrl,
  isDouyinUrl,
  copyToClipboard,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  showConfirm,
  getSystemInfo,
  checkNetworkStatus,
  setStorage,
  getStorage,
  removeStorage
};