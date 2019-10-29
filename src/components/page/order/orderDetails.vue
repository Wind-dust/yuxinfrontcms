<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/orderList' }">商品订单列表</el-breadcrumb-item>
        <el-breadcrumb-item>订单详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tabs">
      <template>
        <el-tabs class="eltabs" value="first" type="card">
          <el-tab-pane label="订单信息" name="first">
            <el-form class="form" label-width="150px">
              <el-form-item label="订单号:"><span class="text">{{order_info.order_no}}</span></el-form-item>
              <el-form-item label="下单日期:"><span>{{order_info.create_time}}</span></el-form-item>
              <el-form-item label="订单金额:"><span>{{order_info.order_money}}</span></el-form-item>
              <el-form-item label="商票抵扣金额:"><span>{{order_info.deduction_money}}</span></el-form-item>
              <el-form-item label="实际支付:"><span>{{order_info.pay_money}}</span></el-form-item>
              <el-form-item label="商品金额:"><span>{{order_info.goods_money}}</span></el-form-item>
              <el-form-item label="运费:"><span>{{order_info.express_money}}</span></el-form-item>
              <el-form-item label="优惠金额:"><span>{{order_info.discount_money}}</span></el-form-item>
              <el-form-item label="支付类型:"><span>{{order_info.pay_type_text}}</span></el-form-item>
              <el-form-item label="第三方支付金额:"><span>{{order_info.third_money}}</span></el-form-item>
              <el-form-item label="第三方支付类型:"><span>{{order_info.third_pay_type_text}}</span></el-form-item>
              <el-form-item label="订单状态:"><span>{{order_info.order_status_text}}</span></el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="商品清单" name="second">
            <el-table :data="order_pack" class="table" border>
              <el-table-column type="index" label="序号"></el-table-column>
              <el-table-column prop="goods_name" label="商品名称"></el-table-column>
              <el-table-column prop="sku_json" label="商品规格"></el-table-column>
              <el-table-column prop="goods_price" label="商品价格"></el-table-column>
              <el-table-column prop="goods_num" label="购买数量"></el-table-column>
              <el-table-column prop="integral" label="赠送积分"></el-table-column>
              <el-table-column prop="margin_price" label="利润"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="邮寄信息" name="third">
            <el-form class="form" label-width="150px">
              <el-form-item label="收件人:"><span class="text">{{order_info.linkman}}</span></el-form-item>
              <el-form-item label="联系电话:"><span>{{order_info.linkphone}}</span></el-form-item>
              <el-form-item label="收货地址:"><span>{{order_info.province_name}} {{order_info.city_name}} {{order_info.area_name}} {{order_info.address}}</span>
              </el-form-item>
              <el-form-item label="留言信息:"><span></span></el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="物流管理" name="fourth">
            <div class="express">
              <p class="no-deliver">还有<span>{{no_deliver_goods_num}}</span>个商品未发货
              <p>
              <div class="orderCard" v-for="(v,k) in logistics" :key="k">
                <el-card class="box-card" shadow="never">
                  <div slot="header" class="clearfix">
                    <span class="header">商品:{{v.id}}-{{v.goods_name}}</span>
                  </div>
                  <el-form label-width="80px" :model="v.express" :ref="'menu'+v.id">
                    <el-form-item label="快递公司" prop="express_key"
                                  :rules="[{ required: true, message: '快递公司不能为空', trigger: 'change' }]">
                      <el-select class="" v-model="v.express.express_key" placeholder="请选择快递公司">
                        <el-option v-for="(val,key) of options" :key="val" :label="val" :value="key">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="快递单号" prop="express_no"
                                  :rules="[{ required: true, message: '快递单号不能为空', trigger: 'blur' }]">
                      <el-input v-model="v.express.express_no" placeholder="请输入快递单号"></el-input>
                    </el-form-item>

                    <el-form-item class="flex-cen">
                      <el-button type="primary"
                                 @click="sumbit(v.id,v.express.express_key,v.express.express_no,v.express.delivery)">确定
                      </el-button>
                    </el-form-item>
                  </el-form>
                </el-card>
              </div>
            </div>
          </el-tab-pane>
          <!--v-if="fromlist.length > 0"-->
          <el-tab-pane label="查看表单" name="fifth">
            <!--<div class="demo-input-suffix lable" v-for="v,k in from">-->
            <!--{{v.title}}-->
            <!--<el-input v-model="v.value"></el-input>-->
            <!--</div>-->
            <!--<div class="box-card">-->
              <!--<el-form label-width="110px" v-for="v,k in text" label-position="right">-->
                <!--<el-form-item :label="v.title" prop="goods_name">-->
                  <!--<el-input v-model="v.value" placeholder=""></el-input>-->
                <!--</el-form-item>-->
                <!--<el-form label-width="110px" v-for="v,k in radio" label-position="right">-->
                  <!--<el-form-item :label="v.title" wx prop="goods_class">-->
                    <!--<el-select v-model="goods_data.goods_sheet" :placeholder="v.title">-->
                      <!--<el-option>是</el-option>-->
                      <!--<el-option>否</el-option>-->
                    <!--</el-select>-->
                  <!--</el-form-item>-->
                <!--</el-form>-->
                <!--<el-form label-width="110px" v-for="v,k in imgs" label-position="right">-->
                  <!--<el-form-item :label="v.title" wx prop="goods_class">-->
                    <!--<div class="banner">-->
                      <!--&lt;!&ndash;<v-upload @upresult='banner' @delImg="delImg" num='images_carousel' name='image_path' :multiple="true" @orderby="orderby" :image="images_carousel"></v-upload>&ndash;&gt;-->
                      <!--<img class="imgs" :src="v.value" alt="">-->
                    <!--</div>-->
                  <!--</el-form-item>-->
                <!--</el-form>-->
                <!--<el-form label-width="110px" v-for="v,k in img" label-position="right">-->
                  <!--<el-form-item :label="v.title" prop="image">-->
                    <!--&lt;!&ndash;<v-upload @upresult='upresult' num='image' image="v.value"></v-upload>&ndash;&gt;-->
                    <!--<img class="imgs" :src="v.value" alt="">-->
                  <!--</el-form-item>-->
                <!--</el-form>-->
                <!--&lt;!&ndash;<el-form-item label="商品分享标题图" prop="share_image" >&ndash;&gt;-->
                <!--&lt;!&ndash;<v-upload @upresult='shareUpresult' num='share_image' image="goods_data.share_image"></v-upload>&ndash;&gt;-->
                <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
                <!--&lt;!&ndash;<el-form-item class="flex-cen">&ndash;&gt;-->
                <!--&lt;!&ndash;<el-button  type="primary" @click="gSumbit('goods_data')">确定</el-button>&ndash;&gt;-->
                <!--&lt;!&ndash;<el-button  @click="reduction()">取消</el-button>&ndash;&gt;-->
                <!--&lt;!&ndash;</el-form-item>&ndash;&gt;-->
              <!--</el-form>-->
            <!--</div>-->
          </el-tab-pane>
        </el-tabs>
      </template>

    </div>
  </div>
</template>

<script>
  import vCard from '../../component/card'

  export default {
    data() {
      return {
        order_id: '',
        options: {},
        no_deliver_goods: [],
        no_deliver_goods_num: 0,
        logistics: [],
        order_info: {},
        order_pack: [],
        cardStatus: true,
        ruleType: {},
        ruleForm: {},
        rules: [],
        fromlist: [],
        airPlan: [],
        arr: [],
        imgs: [],
        from: [],
        img: [],
        text: [],
        radio: []
      }
    },
    components: {
      vCard
    },
    created() {
      this.order_id = this.$route.query.id;
      this.getOrderInfo();
      this.getExpressList()
    },
    mounted() {


    },
    methods: {
      showCard() {
        this.ruleForm = {}
        this.cardStatus = true
      },
      hideCard() {
        this.cardStatus = false
      },
      getOrderSheet() {
        console.log(this.order_info)
        let that = this
        that.$request({
          data: {
            order_no: that.order_info.order_no
          },
          url: 'order/getOrderSheet',
          success(res) {
            that.fromlist = res.fromList
            let list = res.fromList
            let ruleType = {}
            console.log(list)
            let json = {
              type: '',
              lable: '',
              value: ''
            }
            let img = []
            let airPlan = []
            let arr = []
            let imgs = []
            let text = []
            let radio = []
            for (let i = 0; i < list.length; i++) {
              //组合数据
              for (let j = 0; j < list[i].from.length; j++) {
                switch (parseInt(list[i].from[j].type)) {
                  case 1:
                  case 2:

                  case 5:
                    text.push(list[i].from[j])
                    break;
                  case 3:
                    radio.push(list[i].from[j])
                    break
                  case 4:
                    airPlan.push(list[i].from[j])
                    break;
                  case 6:
                    // let key1 = list[i].from[j].name
                    // img[key1] = list[i].from[j].value
                    img.push(list[i].from[j])
                    break;
                  case 7:
                    imgs.push(list[i].from[j])
                    break;
                }
              }
              that.from = list[i].from
            }
            that.ruleType = ruleType
            that.airPlan = airPlan
            that.arr = arr
            that.imgs = imgs
            that.img = img
            that.text = text
            that.radio = radio
            console.log(this.from)
          }
        })
      },
      sumbit(id, key, express_no, bl) {
        let that = this;
        that.$refs['menu' + id][0].validate((valid) => {
          if (valid) {
            let delivery = bl ? 'updateDeliverOrderGoods' : 'deliverOrderGoods'
            that.deliverOrderGoods(id, key, express_no, delivery)
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      deliverOrderGoods(id, express_key, express_no, delivery) {
        let that = this
        that.$request({
          data: {
            express_key: express_key,
            express_no: express_no,
            order_goods_id: id
          },
          url: 'Order/' + delivery,
          success(res) {
            that.$message({message: '发货成功', type: 'success'});
            that.getOrderInfo()
          }
        })
      },
      getExpressList() {
        let that = this
        that.$request({
          url: 'Order/getExpressList',
          success(res) {
            that.options = res.ExpressList
          }
        })
      },
      getOrderInfo() {
        let that = this
        that.$request({
          data: {
            id: that.order_id
          },
          url: 'Order/getOrderInfo',
          success(res) {
            that.no_deliver_goods = res.no_deliver_goods;
            that.no_deliver_goods_num = res.no_deliver_goods_num;
            that.logistics = that.dislogistics(res.order_child, res.has_deliver_goods);
            that.order_info = res.order_info;
            that.order_pack = that.disorder_pack(res.order_pack);
            that.order_info.pay_type_text = that.order_info.pay_type == 1 ? '第三方支付' : '商票';
            that.order_info.third_pay_type_text = that.getthirdpaytype(that.order_info.third_pay_type)
            that.order_info.order_status_text = that.getStatusText(that.order_info.order_status)
            that.getOrderSheet()
          }
        })
      },
      dislogistics(list = [], hasList = []) {
        let len1 = list.length, arr = [], allExpress = this.IshasExpress(hasList);
        for (let i = 0; i < len1; i++) {
          let len3 = list[i].order_goods.length;
          for (let y = 0; y < len3; y++) {
            let tem = list[i].order_goods[y];
            tem.express = allExpress[list[i].order_goods[y].id] || {delivery: false};
            arr.push(tem)
          }
        }
        return arr
      },
      IshasExpress(list = []) {
        let allExpress = {};
        for (let i = 0, len = list.length; i < len; i++) {
          allExpress[list[i].goods.id] = list[i].goods.express;
          allExpress[list[i].goods.id].delivery = true
        }
        return allExpress
      },
      disorder_pack(data = []) {
        let len = data.length, len1, arr = [];
        for (let i = 0; i < len; i++) {
          len1 = data[i].order_goods.length
          for (let y = 0; y < len1; y++) {
            arr.push(data[i].order_goods[y])
          }
        }
        return arr
      },
      getthirdpaytype: function (n) {
        let str = ''
        switch (parseInt(n)) {
          case 1:
            str = '支付宝'
            break;
          case 2:
            str = '微信'
            break;
          case 2:
            str = '银联'
            break;
          default:
            str = '意料之外的支付方式'
            break;
        }
        return str
      },
      getStatusText: function (n) {
        let str = ''
        switch (parseInt(n)) {
          case 1:
            str = '待付款'
            break;
          case 2:
            str = '订单已取消'
            break;
          case 3:
            str = '订单已关闭'
            break;
          case 4:
            str = '已付款'
            break;
          case 5:
            str = '已发货'
            break;
          case 6:
            str = '已收货'
            break;
          case 7:
            str = '待评价'
            break;
          case 8:
            str = '退款申请确认'
            break;
          case 9:
            str = '退款中'
            break;
          case 10:
            str = '退款成功'
            break;
          default:
            str = '意料之外的状态'
            break;
        }
        return str
      }
    }
  }
</script>

<style scoped>
  .tabs {
    background-color: #fff;
  }

  .eltabs {
    min-height: 700px;
  }

  .table {
    width: 95%;
    margin: 0 auto 20px;
  }

  .box-card {
    margin-top: 20px;
    width: 500px;
    margin-left: 20px;;
  }

  .form span {
    font-size: 18px;
    color: #404040;
  }

  .text {
    font-size: 18px;
  }

  .express {
    padding: 15px;
  }

  .no-deliver {
    margin-left: 20px;
    font-size: 16px;
    margin-bottom: 15px;
  }

  .no-deliver span {
    color: #e61f18;
  }

  .orderCard {
    display: inline-block;
    float: left;
    width: 400px;
    margin: 10px 0 0 20px;
  }

  .box-card .header {
    font-size: 15px;
  }

  .lable {
    width: 50%;
    margin: 10px auto;
  }

  .imgs {
    width: 150px;
    height: 150px;
  }
</style>
