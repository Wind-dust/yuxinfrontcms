<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单导出</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <v-screen :screen="screenQuery" @query="onQuery"></v-screen>

    <div class="hint" v-if="showHint">
        <p>{{orderData.length > 0 ? '已获取到'+orderData.length+'条数据':'未获取到数据'}}</p>
        <!-- <el-button type="primary" @click="eo()">导出</el-button> -->
        <div class='button' @click="exportData()">导出</div>
    </div>
  </div>
</template>

<script>
import vScreen from "../../component/screen";
import vPagination from "../../component/pagination";
export default {
  data() {
    return {
      screen: {},
      orderData: {},
      showHint:false,
      screenQuery: [
        {
          ref: "sup_id",
          label: "供应商id",
          type: "input",
          content: "",
          placeholder: "请输入供应商id"
        },
        {
          ref: "order_status",
          label: "订单状态",
          type: "select",
          content: "",
          placeholder: "请选择订单状态",
          option: [
            {
              value: 1,
              label: "待付款"
            },
            {
              value: 2,
              label: "已取消"
            },
            {
              value: 3,
              label: "已关闭"
            },
            {
              value: 4,
              label: "已付款"
            },
            {
              value: 5,
              label: "已发货"
            },
            {
              value: 6,
              label: "已收货"
            },
            {
              value: 7,
              label: "待评价"
            },
            {
              value: 8,
              label: "退款申请确认"
            },
            {
              value: 9,
              label: "退款中"
            },
            {
              value: 10,
              label: "退款成功"
            }
          ]
        },
        {
          label: "订单类型",
          ref: "order_type",
          type: "select",
          content: "",
          placeholder: "请选择订单类型",
          option: [
            {
              value: 1,
              label: "普通购物订单"
            },
            {
              value: 2,
              label: "线下活动订单"
            },
            {
              value: 3,
              label: "抽奖奖品订单"
            },
            {
              value: 4,
              label: "虚拟商品订单"
            }
          ]
        },
        {
          ref: "page",
          label: "页码",
          type: "input",
          content: "",
          placeholder: "请输入页数"
        },
        {
          ref: "pagenum",
          label: "查询条数",
          type: "input",
          content: 1000,
          placeholder: "默认一千条"
        },
        {
          ref:'nick_name',
          label:'昵称',
          type:'input',
          content:'',
          placeholder:'要查询的昵称'
        },
        {
          ref:'start_time',
          label:"订单创建时间（开始）",
          type:'date',
          content:''
        },
        {
          ref:'end_time',
          label:'订单创建时间（结束）',
          type:'date',
          content:''
        }
      ],
      order_list: []
    };
  },
  components: {
    vScreen
  },

  mounted() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      this.$request({
        url: "admin/getadmininfo",
        success: res => {
          this.$glbalData.userInfo = res.data || {};
          this.name = res.data.admin_name;
          //   this.setOption(res.data.keyword);
        }
      });
    },

    onQuery(screen) {
      console.log(screen);
      this.screen = screen;
      this.getOrders();
    },
    getOrders() {
      let that = this;

      that.$request({
        data: that.screen,
        url: "Order/exportDeliveryOrder",
        success(res) {
          that.orderData = res.result;
          that.showHint = true
        }
      });

    },
    exportData() {
    let orderData = this.orderData;
    console.log(orderData)
  
    let str = '订单号,收货人姓名,收货人电话,收货地址,备注,供应商id,供应商名称,商品名称,购买数量,sku\n'
    for(let i = 0 ; i < orderData.length ; i++ ){
        for(let item in orderData[i]){
            str+=`${orderData[i][item] + '\t'},`;     
        }
        str+='\n';
      }
    let uri = "data:text/csv;charset=utf-8,\ufeff" + encodeURIComponent(str);
    //通过创建a标签实现
    let link = document.createElement("a");
    link.href = uri;
    //对下载的文件命名
    link.download = "订单.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  },
  
};
</script>

<style scoped>
.hint{
    text-align: center;
    font-size: 30px;
    padding:  20px;
    box-sizing: border-box;
    background: #ffffff;
    border-radius: 4px;
}
.button{
    width: 70px;
    height: 45px;
    text-align: center;
    line-height: 45px;
    font-size: 14px;
    background: #409eff;
    color: #ffffff;
    margin: 10px auto;
    border-radius: 4px;

}
</style>
