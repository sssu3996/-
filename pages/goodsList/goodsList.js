// pages/goodsList/goodsList.js
import {
  myRequest
} from '../../utils/myRequest.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodslist: [],
    cid: 1,
    query: "",
    pagenum: 1,
    pagesize: 20,
    total: 0
  },

  // 封装列表请求数据
  getGoodList(obj) {
    const {
      query,
      cid,
      pagesize
    } = this.data;

    // 发送获取商品列表请求
    myRequest({
      url: "goods/search",
      data: {
        ...obj,
        cid,
        query,
        pagesize
      }
    }).then(res => {
      console.log(res)
      this.setData({
        goodslist: res.data.message.goods,
        total: res.data.message.total
      })
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    // 解构页面路由参数
    const {
      cid,
      query
    } = options;
    //  设置data数据
    this.setData({
      cid,
      query
    })

    const {
      pagenum
    } = this.data;

    // 请求列表数据
    this.getGoodList({
      pagenum
    })
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  // 注意不要被覆盖了
  onReachBottom: function() {
    console.log('触底了')
    this.data.pagenum++
    this.getGoodList()
  },


})