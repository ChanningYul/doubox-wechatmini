/**
 * 小程序入口文件
 * 管理应用的生命周期和全局数据
 */
App({
  /**
   * 小程序初始化完成时触发
   */
  onLaunch: function () {
    console.log('doubox小程序启动');
    
    // 检查微信版本
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      console.log('检查更新结果:', res.hasUpdate);
    });
    
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        }
      });
    });
  },

  /**
   * 小程序显示时触发
   */
  onShow: function () {
    console.log('小程序显示');
  },

  /**
   * 小程序隐藏时触发
   */
  onHide: function () {
    console.log('小程序隐藏');
  },

  /**
   * 小程序发生脚本错误或API调用报错时触发
   */
  onError: function (msg) {
    console.error('小程序错误:', msg);
  },

  /**
   * 全局数据
   */
  globalData: {
    userInfo: null,
    version: '1.0.0'
  }
});