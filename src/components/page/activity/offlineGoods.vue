<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/offline' }" >线下活动</el-breadcrumb-item>
        <el-breadcrumb-item>线下活动商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">添加商品</el-button>
  </div>
  
    <el-table :data="goodList" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column  prop="goods_id" label="商品id" ></el-table-column>
      <el-table-column  prop="goods.goods_name" label="商品名称" ></el-table-column>
      <el-table-column  prop="statusText" label="	商品状态" ></el-table-column>
      <el-table-column  prop="create_time" label="创建时间"></el-table-column>
      <el-table-column fixed="right" label="操作"  >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="getGoodInfo(scope.row.id,scope.row.goods_id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :total="total"></v-pagination>

    <v-card name='商品' :cardStatus="cardStatus" :ruleType="ruleType" :ruleForm="ruleForm" :rules="rules" @sumbit="sumbit" @hideCard="hideCard"></v-card>

  </div>
</template>

<script>
import vScreen from '../../component/screen'
import vPagination from '../../component/pagination'
import vCard from '../../component/card'
export default {
  data(){
    return {
      cardStatus:false,
      ruleForm:{},
      rules:['goods_id'],
      ruleType:{
        'goods_id':{
          type:'input',
          label:'商品id',
          placeholder:'请输入商品id'
        }
      },
      screen:{
        page:1,
        page_num:10,
        active_id:''
      },
      goodList:[],
      total:0
    }
  },
  components:{
      vPagination,
      vCard
  },
  mounted(){
    this.screen.active_id = this.$route.query.id;
    this.getOfflineActivitiesGoods()
  },
  methods: {
    getGoodInfo(id,gid){
        this.ruleForm = {
          id:id,
          goods_id:gid
        }
        this.cardStatus = true
    },
    getsupplierdata(id){
      let that =this;
      that.$request({
        data: {
          supplierId:id
        },
        url: 'suppliers/getsupplierdata',
        success(res){
          that.ruleForm = res.data
          that.cardStatus = true
        }
      })
    },
    showCard(){
      this.ruleForm = {}
      this.cardStatus = true
    },
    hideCard(){
      this.cardStatus = false
    },
    sumbit(data){
      data.ruleForm.active_id = this.screen.active_id;
      data.ruleForm.id ?this.updateOfflineActivitiesGoods(data.ruleForm):this.addOfflineActivitiesGoods(data.ruleForm)
    },
    addOfflineActivitiesGoods(data){
      let that =this;
      that.$request({
        data: data,
        url: 'OfflineActivities/addOfflineActivitiesGoods',
        form:1,
        success(res){
          that.ruleForm = {}
          that.getOfflineActivitiesGoods()
          that.cardStatus = false
        }
      })
    },
    updateOfflineActivitiesGoods(data){
      let that =this;
      that.$request({
        data: data,
        url: 'OfflineActivities/updateOfflineActivitiesGoods',
        form:3,
        success(res){
          that.ruleForm = {}
          that.getOfflineActivitiesGoods()
          that.cardStatus = false
        }
      })
    },
    pageChange(obj){
        this.screen.page = obj.page
        this.getOfflineActivitiesGoods()
    },
    getOfflineActivitiesGoods(){
      let that =this;
      that.$request({
        data: that.screen,
        url: 'OfflineActivities/getOfflineActivitiesGoods',
        success(res){
          that.goodList = that.disGoodList(res.result)
          that.total = res.totle || 0;
        }
      })
    },
    disGoodList(data = []) {
        let len = data.length;
        if (len === 0) return
        for (let i = 0; i < len; i++) {
            data[i].statusText = (data[i].goods.status == 1)?'上架中' : '已下架'
        }
        return data
    },
  }
}
</script>

<style scoped>
</style>
