Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图图片
    imgs: [],
    //  分类栏目
    category: [],
    // 首页楼层数据
    floorData: []
  },

  // 自定义事件处理函数，点击按钮，返回顶部
  goToTop(e) {
    console.log(e.currentTarget.dataset);
    // 将页面滚动到目标位置，支持选择器和滚动距离两种方式定位
    wx.pageScrollTo({
      scrollTop: e.currentTarget.dataset.scroll,
      duration: e.currentTarget.dataset.duration
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 请求轮播图图片
    wx: wx.request({
      url: 'https://api.zbztb.cn/api/public/v1/home/swiperdata',
      success: res => {
        // console.log(res),
        this.setData({
          imgs: res.data.message
        })
      }
    })
    // 发送分类数据请求
    wx: wx.request({
      url: 'https://api.zbztb.cn/api/public/v1/home/catitems',
      success: res => {
        // console.log(res)
        this.setData({
          category: res.data.message
        })
      }
    })

    // 发送首页楼层数据
    wx: wx.request({
      url: 'https://api.zbztb.cn/api/public/v1/home/floordata',
      success: res => {
        console.log(res)
        this.setData({
          floorData: res.data.message
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})