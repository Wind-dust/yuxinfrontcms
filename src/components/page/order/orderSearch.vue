<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单搜索</el-breadcrumb-item>
      </el-breadcrumb>
  </div>

    <v-screen :screen="screenQuery" @query="onQuery" ></v-screen>

    <el-table :data="order_list" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column  prop="order_num" label="总成交订单" >
      </el-table-column>
      <el-table-column  prop="all_goods_num" label="总成交数量" ></el-table-column>
      <el-table-column  prop="all_goods_price" label="总成交额" ></el-table-column>
    </el-table>

  </div>
</template>

<script>
import vScreen from '../../component/screen'
import vPagination from '../../component/pagination'
export default {
  data(){
    return {
      screen:{},
      screenQuery:[],
      order_list:[]
    }
  },
  components:{
      vScreen
  },
  
  mounted(){
    this.getUserInfo()
  },
  methods: {
    getUserInfo(){
      this.$request({
          url:'admin/getadmininfo',
          success:res=>{
              this.$glbalData.userInfo = res.data || {};
              this.name = res.data.admin_name
              this.setOption(res.data.keyword)
          }
        })
    },
    setOption(options){
      let keyword = {
        ref:'keyword',
        label:'订单关键词搜索',
        type:'select',
        placeholder:'请选择订单关键词',
        option:[]
      }
      for(const k in options){
        keyword.option.push({
          value:k,
          label:keyword[k]
        })
      }
      this.screenQuery.push(keyword)
    },
    onQuery(screen){
      this.screen.keyword = screen.keyword
      this.getOrders();
    },
    getOrders(){
      let that =this;
      that.$request({
        data: that.screen,
        url: 'Order/searchKeywordOrders',
        success(res){
          that.order_list = []
          that.order_list.push({
            all_goods_num:res.all_goods_num,
            all_goods_price:res.all_goods_price,
            order_num:res.order_num
          })
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
