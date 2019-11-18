// pages/goodsDetail/goodsDetail.js
import {
  myRequest
} from '../../utils/myRequest.js'


Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数组
    goodsSliterImgs: [],
    // 商品详情
    goodsDetail: [],
    // 兼容后的产品图
    introduce: ""
  },

  // 自定义处理事件，点击加入购物车
  addToCart(e) {
    console.log(e);
    const goodsArry = wx.getStorageSync('goodsArry') || [];
    const {
      goods_id,
      goods_name,
      goods_price,
      goods_small_logo
    } = this.data.goodsDetail


    const goodsIndex = goodsArry.findIndex(item => {
      return item.goods_id === this.data.goodsDetail.goods_id
    })
    // console.log(goodsIndex)

    if (goodsIndex === -1) {
      // 存到数组当中
      goodsArry.push({
        goods_id,
        goods_name,
        goods_price,
        goods_small_logo,
        // 初始化被选中的状态
        goodsChecked: true,
        // 初始化商品数量
        goods_count: 1
      })

      // console.log(goodsArry)
      wx.setStorageSync('goodsArry', goodsArry)
    } else {
      // 如果存在，就累加数量
      goodsArry[goodsIndex].goods_count += 1;
    }
    // 判断后，筛选了存储的数据后再次存储
    wx.setStorageSync('goodsArry', goodsArry);

    // 弹窗提示用户添加成功
    wx.showToast({
      // 默认的icon，可选值，success，loading，none
      // icon:'none',
      // 自定义图标 - 图标级别高于 icon
      // image: '/images/default.svg',
      // 提示文字
      title: '加入购物车成功',
      // 持续时间
      duration: 1000,
      // !透明遮罩，防止点击穿透
      mask: true
    });
  },

  // 自定义处理事件，点击放大图片
  amplificationImg(e) {
    console.log(e)
    let url = e.currentTarget.dataset.url
    // console.log(e);
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    const {
      goods_id
    } = options;
    myRequest({
      url: 'goods/detail',
      data: {
        goods_id
      }
    }).then(res => {
      console.log(res),
        this.setData({
          // 轮播图数据
          goodsSliterImgs: res.data.message.pics,
          // 商品详情
          goodsDetail: res.data.message,
          // 富文本详情内容，由于 ios 系统不支持 webp 图片格式，替换成 jpg 格式
          introduce: res.data.message.goods_introduce.replace(/jpg.+?webp/g, 'jpg')
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },


})