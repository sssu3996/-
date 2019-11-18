// pages/cars/cars.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 购物车数据
    goodsArry: [],
    // 全选状态
    checkall: false,
    // 商品总数
    totalCount: 0,
    // 总金额
    totalMoney: 0,
    // 收获地址
    address: {}
  },
  // 跳转到支付页面
  goToPay() {
    // 获取订单数据
    const {
      address,
      goodsArry,
      totalCount
    } = this.data

    // 检测是否有收货地址
    if (!address.userName) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none',
        duration: 2000
      })
    } else if (totalCount === 0) {
      // 检测是否有勾选商品
      wx.showToast({
        title: '请选择收货需要购买的商品',
        icon: 'none',
        duration: 2000
      })
    } else {
      // 跳转到支付页面
      wx: wx.navigateTo({
        url: '/pages/pay/pay',
        success: function(res) {},
      })
    }

  },

  // 选择收获地址的核心功能
  chooseAddressMain() {
    // 调用微信内置的收货地址功能
    wx.chooseAddress({
      // 用户点击了收获地址
      success: res => {
        // 解构获取到的收获地址信息
        const {
          userName,
          postalCode,
          provinceName,
          cityName,
          countyName,
          detailInfo,
          nationalCode,
          telNumber
        } = res
        // 组装成格式
        const address = {
          userName,
          telNumber,
          addressDetail: `${provinceName}${cityName}${countyName}${detailInfo}`
        }
        // 更新页面的收获地址
        this.setData({
          address
        });

        // 本地存储收货地址
        wx.setStorageSync('address', address)
      }
    })
  },

  // 获取收获地址
  getAddress() {
    // 获取用户授权情况
    wx.getSetting({
      success: res => {
        // console.log(res.authSetting["scope.address"])
        // 如果用户点击了拒绝，需要引导用户重新设置界面开启，否则无法调用收货地址接口
        if (res.authSetting["scope.address"] === false) {
          // 打开用户授权界面
          wx.openSetting({
            success: res => {
              // console.log(res)
              // 如果用户在设置界面开启了授权
              if (res.authSetting['scope.address'] === true) {
                // 已经授权，通过api方式调用收获地址
                this.chooseAddressMain();
              }

            }
          })
        } else {
          // 已经授权，通过 API 方式调用收货地址
          this.chooseAddressMain();
        }
      }
    })


  },

  // 自定义事件,单选商品
  selectGoods(e) {
    // console.log(e.currentTarget.dataset.index)
    // 获取当前商品索引值
    const {
      index
    } = e.currentTarget.dataset
    // console.log(index)
    //解构购物车的数据
    const {
      checkall,
      goodsArry
    } = this.data
    // console.log(checkall)

    // 获取当前选择的商品的选择状态，取反
    goodsArry[index].goodsChecked = !goodsArry[index].goodsChecked
    // console.log(goodsArry[index].goodsChecked)

    this.allSelect(goodsArry)

    // 更新数据
    this.updateCar(goodsArry)
  },

  // 全选,全选按钮被选中
  allSelect(goodsArry) {

    // 返回被选中的数组
    const selectarr = goodsArry.filter(v => {
      return v.goodsChecked
    })
    // console.log(selectarr.length)
    // console.log(goodsArry.length)


    // 判断数组长度设置全选状态
    this.setData({
      checkall: selectarr.length === goodsArry.length
    })
    // 更新数据
    this.updateCar(goodsArry)
  },

  // 全选状态
  selectAll(e) {
    console.log(e)
    const {
      checkall,
      goodsArry
    } = this.data
    console.log(checkall)

    // 遍历每一项，把 checkAll 取反后的状态更新列表每一项中
    goodsArry.forEach(v => {
      v.goodsChecked = !checkall
    })

    // 更新视图
    this.setData({
      goodsArry,
      checkall: !checkall
    })
    // 更新数据
    this.updateCar(goodsArry)
  },

  // 自定义点击事件，点击减号，减少商品数量
  reduceNum(e) {
    var that = this;
    // console.log(e.currentTarget.dataset)
    const {
      // 商品的索引值
      index,
      // 当前商品的数量
      num
    } = e.currentTarget.dataset

    // 获取列表数据
    const {
      goodsArry
    } = this.data
    // 设置加减下限
    if (num > 1) {
      goodsArry[index].goods_count--
        // 更新数据
        this.updateCar(goodsArry)
    } else {
      wx.showModal({
        title: '提示',
        content: '你确定要删除这个宝贝吗？',
        success: res => {
          if (res.confirm) {
            // console.log('用户点击确定')
            goodsArry.splice(index, 1)
            console.log('宝贝已删除')

            // 记得在异步回调函数内部更新数据
            // 更新数据
            this.updateCar(goodsArry)

          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })

    }

  },

  // 自定义点击事件，点击加号，增加商品数量
  addNum(e) {
    console.log(e)
    // this.data.goodsArry.goods_count++
    const {
      // 商品的索引值
      addindex,
      // 当前商品的数量
      addnum
    } = e.currentTarget.dataset

    // 获取列表数据
    const {
      goodsArry,
    } = this.data

    //  点击添加
    if (addnum <= 9999) {
      goodsArry[addindex].goods_count++
        // 记得在异步回调函数内部更新数据
    }

    // 更新数据
    this.updateCar(goodsArry)

  },

  // 更新页面需要渲染的数据
  updateCar(goodsArry) {
    // 商品总数
    let totalCount = 0;
    // 总金额
    let totalMoney = 0;

    // 遍历购物车数组
    goodsArry.forEach(v => {
      // 如果是选中的状态
      if (v.goodsChecked) {
        console.log(v)
        // 计算总金额 = 数量 * 单价
        totalMoney += v.goods_count * v.goods_price
        // 选中的商品数量累加
        totalCount++
      }
    })

    // 更新视图
    this.setData({
      totalMoney,
      totalCount,
      goodsArry,
      checkAll: goodsArry.length === totalCount
    })

    // 更新本地存储
    wx.setStorageSync('goodsArry', goodsArry)

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const goodsArry = wx.getStorageSync('goodsArry') || [];
    this.setData({
      goodsArry
    })
    // console.log(this.data.goodsArry)
    this.allSelect(goodsArry)
  },


})