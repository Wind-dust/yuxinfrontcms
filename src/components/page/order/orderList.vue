<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <v-screen :screen="screenQuery" @query="onQuery"></v-screen>

    <el-table :data="order_list" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="order_no" label="订单号">
      </el-table-column>
      <el-table-column prop="nick_name" label="购买用户昵称"></el-table-column>
      <el-table-column prop="order_money" label="订单金额"></el-table-column>
      <el-table-column prop="deduction_money" label="商票抵扣金额"></el-table-column>
      <el-table-column prop="pay_money" label="实际支付"></el-table-column>
      <el-table-column prop="goods_money" label="商品金额"></el-table-column>
      <el-table-column prop="discount_money" label="优惠金额"></el-table-column>
      <el-table-column prop="third_money" label="微信支付金额"></el-table-column>
      <el-table-column prop="order_status_text" label="订单状态"></el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="goOrderdetails(scope.row.id)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :num='num' :total="total" :page="page"></v-pagination>

  </div>
</template>

<script>
  import vScreen from '../../component/screen'
  import vPagination from '../../component/pagination'

  export default {
    data() {
      return {
        screen: {
          page: 1,
          page_num: 10
        },
        page: 1,
        num: 1,
        screenQuery: [{
          ref: 'order_no',
          label: '订单号',
          type: 'input',
          content: '',
          placeholder: '请输入订单号'
        }, {
          ref: 'nick_name',
          label: '用户昵称',
          type: 'input',
          content: '',
          placeholder: '请输入用户昵称'
        }, {
          ref: 'order_status',
          label: '订单状态',
          type: 'select',
          content: '',
          placeholder: '请选择订单状态',
          option: [{
            value: '',
            label: '全部'
          }, {
            value: 1,
            label: '待付款'
          }, {
            value: 2,
            label: '取消订单'
          }, {
            value: 3,
            label: '已关闭'
          }, {
            value: 4,
            label: '已付款'
          }, {
            value: 5,
            label: '已发货'
          }, {
            value: 6,
            label: '已收货'
          }, {
            value: 7,
            label: '待评价'
          }, {
            value: 8,
            label: '退款申请确认'
          }, {
            value: 9,
            label: '退款中'
          }, {
            value: 10,
            label: '退款成功'
          }]
        }, {
          ref: "sup_id",
          label: "供应商",
          type: "select",
          content: "",
          placeholder: '请选择供应商',
          filterable: true,
          val: 'id',
          lab: 'name',
          option: []
        }, {
          ref: 'start_time',
          label: "订单创建时间（开始）",
          type: 'date',
          content: ''
        },
          {
            ref: 'end_time',
            label: '订单创建时间（结束）',
            type: 'date',
            content: ''
          }
        ],
        order_list: [],
        total: 0
      }
    },
    components: {
      vScreen,
      vPagination,
    },
    mounted() {
      this.screen.page = parseInt(localStorage.getItem("orderList")) || 1
      this.page = this.screen.page
      this.getOrders()
      this.getAllSuppliers()
    },
    methods: {
      goOrderdetails(id) {
        this.$router.push({
          path: '/orderList/orderDetails', query: {
            id: id
          }
        })
      },
      getAllSuppliers() {
        let that = this;
        that.$request({
          url: 'suppliers/getsuppliersall',
          success(res) {
            let option = that.disData(res.data)
            that.screenQuery[3].option = option
          }
        })
      },
      disData(data) {
        let arr = []
        for (let i = 0; i < data.length; i++) {
          let value = data[i].id
          let label = data[i].name
          let json = {
            value:value,
            label:label
          }
          arr.push(json)
        }
        return arr
      },
      onQuery(screen) {
        this.extend(this.screen, screen);
        this.screen.page = 1;
        localStorage.setItem("orderList", 1)
        this.num++;
        this.getOrders();
      },
      extend(target, options) {
        for (name in options) {
          target[name] = options[name];
        }
        return target;
      },
      pageChange(obj) {
        this.screen.page = obj.page
        localStorage.setItem("orderList", obj.page)
        this.getOrders()
      },
      getOrders() {
        let that = this;
        that.$request({
          data: that.screen,
          url: 'Order/getOrders',
          success(res) {
            that.order_list = that.disorder_list(res.order_list)
            that.total = res.totle || 0;
          }
        })
      },
      disorder_list(data = []) {
        let arr = data,
          len = arr.length
        for (let i = 0; i < len; i++) {
          arr[i].order_status_text = this.getStatusText(arr[i].order_status)
        }
        return arr
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
</style>
