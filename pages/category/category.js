// pages/category/category.js
import {
  myRequest
} from '../../utils/myRequest.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tab栏的索引
    activeIndex: 0,
    // tab栏目数据
    tabData: [],
    // 左边详情导航栏数据
    leftData: [],
  },


  // 切换tab索引事件处理函数
  changeTab: function(e) {
    console.log(e.currentTarget.dataset.index),
      this.setData({
        // 获取点击事件的tab索引
        activeIndex: e.currentTarget.dataset.index,
        // 切换tab栏目的时候,改变数据列表的索引值
        leftData: this.data.tabData[this.data.activeIndex].children
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取tab栏数据
    myRequest({
        url: 'categories'
      })
      .then(res => {
        this.setData({
          // 获取一级数据
          tabData: res.data.message,
          // 获取二级数据
          leftData: res.data.message[this.data.activeIndex].children
        })
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
    // 用户在下拉的时候会自动触发的事件
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