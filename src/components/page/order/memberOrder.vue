<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>权益购买订单</el-breadcrumb-item>
      </el-breadcrumb>
  </div>

    <el-table :data="memberOrderList" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column  prop="user.nick_name" label="购买用户" >
      </el-table-column>
      <el-table-column  prop="fromuser.nick_name" label="分享用户" ></el-table-column>
      <el-table-column  prop="fromuser.identityText" label="分享用户身份" ></el-table-column>
      <el-table-column  prop="actypeText" label="活动类型" ></el-table-column>
      <el-table-column  prop="userTypeText" label="用户订单类型" ></el-table-column>
      <el-table-column  prop="pay_money" label="支付金额" ></el-table-column>
      <el-table-column  prop="payTypetext" label="支付类型" ></el-table-column>
      <el-table-column  prop="pay_time" label="支付时间" ></el-table-column>
      <el-table-column  prop="create_time" label="生成订单时间" ></el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :total="total"></v-pagination>

  </div>
</template>

<script>
import { getIdentity } from '../../../assets/js/common'
import vScreen from '../../component/screen'
import vPagination from '../../component/pagination'
export default {
  data(){
    return {
      screen:{
        page:1,
        page_num:10
      },
      memberOrderList:[],
      total:0
    }
  },
  components:{
      vScreen,
      vPagination,
  },
  mounted(){
    this.getMemberOrders()
  },
  methods: {
    pageChange(obj){
        this.screen.page = obj.page
        this.getMemberOrders()
    },
    getMemberOrders(){
      let that =this;
      that.$request({
        data: that.screen,
        url: 'Order/getMemberOrders',
        success(res){
          that.memberOrderList = that.dismemberOrderList(res.memberOrderList)
          that.total = res.total || 0;
        }
      })
    },
    dismemberOrderList(data = []) {
        let arr = data,
            len = arr.length
        for (let i = 0; i < len; i++) {
            arr[i].actypeText = this.getActypeText(arr[i].actype)
            arr[i].userTypeText = this.getTypeText(arr[i].user_type)
            arr[i].payTypetext = this.getPayTypeText(arr[i].pay_type)
            arr[i].fromuser ? arr[i].fromuser : arr[i].fromuser = {}
            arr[i].fromuser.identityText = getIdentity(arr[i].fromuser.user_identity)
        }
        return arr
    },
    getActypeText(n) {
        let text = ''
        switch (parseInt(n)) {
            case 1:
                text = '无活动'
                break;
            case 2:
                text = '兼职网推'
                break;
            default:
        }
        return text
    },
    getTypeText(n) {
        let text = ''
        switch (parseInt(n)) {
            case 1:
                text = '钻石会员'
                break;
            case 2:
                text = 'boss'
                break;
            default:
        }
        return text
    },
    getPayTypeText(n) {
        let text = ''
        switch (parseInt(n)) {
            case 1:
                text = '支付宝'
                break;
            case 2:
                text = '微信'
                break;
            case 3:
                text = '银联'
                break;
            default:
        }
        return text
    }
  }
}
</script>

<style scoped>
</style>
