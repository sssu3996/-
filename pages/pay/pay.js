// pages/pay/pay.js
import {
  myRequest
} from '../../utils/myRequest.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 收货地址
    addressArr: [],
    // 商品列表
    goodsArry: [],
    // 商品总数
    totalCount: 0,
    // 总金额
    totalMoney: 0,
    token: '',
    // 被选择的商品，需要支付的商品
    payArry: []
  },

  // 点击支付按钮
  payForIt() {
    // 解构发送请求所需要的参数
    const {
      payArry,
      addressArr,
      totalMoney
    } = this.data

    // 根据接口文档的要求，组装订单数组
    const goods = [];
    payArry.forEach(v => {
      goods.push({
        goods_id : v.goods_id,
        goods_number : v.goods_count,
        goods_price : v.goods_price
      })
    })

    // 发送请求,生成商品订单
    // 完善 myRequest 封装，如果 url 中包含了  my/ 就自动给请求的 header 添加 token
    myRequest({
      url: 'my/orders/create',
      method: 'POST',
      data: {
        order_price: totalMoney,
        consignee_addr: addressArr,
        goods
      }
    }).then(res => {
      console.log(res)
    })
  },

  // 用户登录授权
  getToken(e) {
    console.log(e)
    // 解构获取发请求需要的参数
    const {
      encryptedData,
      iv,
      rawData,
      signature
    } = e.detail

    // 调用接口获取登录凭证（code）
    wx.login({
      success: res => {
        console.log(res)
        if (res.code) {
          const {
            code
          } = res

          //发起请求,获取用户token
          myRequest({
            url: 'users/wxlogin',
            method: "POST",
            data: {
              encryptedData,
              iv,
              rawData,
              signature,
              code
            }
          }).then(res => {
            console.log(res)
            // 判断是否登录成功
            if (res.data.message !== null) {
              // 获取token值
              const {
                token
              } = res.data.message
              // 重置token数据
              this.setData({
                token
              })
              // 存储token和用户信息在本地
              wx.setStorageSync('token', token)
              // 先把字符串转化为对象，再本地存储
              wx.setStorageSync('rawData', JSON.parse(rawData))
            } else {
              wx.showToast({
                title: '登录失败,请重新登录',
              });
            }

          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  // 计算总数，总金额，更新数据以及本地存储
  updateCars(goodsArry) {
    // 商品总数
    let totalCount = 0;
    // 商品总金额
    let totalMoney = 0;
    // 解构购物车商品信息

    console.log(goodsArry)
    // 计算总金额，遍历数组
    goodsArry.forEach(v => {
      totalMoney += v.goods_count * v.goods_price
      totalCount++
    })

    // 更新视图
    this.setData({
      totalMoney,
      totalCount,
      goodsArry
    })
    // 更新本地存储
    wx.setStorageSync("goodsArry", goodsArry)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 获取收货地址
    const addressArr = wx.getStorageSync("address") || [];
    // 获取商品信息
    const goodsArry = wx.getStorageSync("goodsArry") || [];
    console.log(goodsArry)
    // 过滤显示被选择的商品
    const payArry = [];
    goodsArry.forEach(v => {
      if (v.goodsChecked === true) {
        payArry.push(v)
      }
    })
    console.log(payArry)
    // 获取用户登录信息，是否有token
    const token = wx.getStorageSync('token') || "";
    // 更新数据
    this.setData({
      addressArr,
      goodsArry,
      token,
      payArry
    })

    // 更新数据
    this.updateCars(goodsArry)
  }


})