<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>小程序抽奖活动</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">添加活动</el-button>
  </div>

    <el-table :data="ldList" border style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column  prop="title" label="标题" ></el-table-column>
      <el-table-column  prop="start_time" label="活动开始时间" ></el-table-column>
      <el-table-column  prop="end_time" label="活动结束时间" ></el-table-column>
      <el-table-column  prop="create_time" label="创建时间" ></el-table-column>
      <el-table-column  prop="status" label="状态" >
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" @change="statusChange(scope.row.id,scope.row.status)" :active-value="2" :inactive-value="1"></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="250" >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="getHdInfo(scope.row.id)">编辑</el-button>
          <el-button type="primary" size="small" @click="goluckyDrawGoods(scope.row.id)">活动商品</el-button>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :total="total"></v-pagination>

    <v-card name='线下活动' width="120" :cardStatus="cardStatus" :ruleType="ruleType" :ruleForm="ruleForm" :rules="rules" @sumbit="sumbit" @hideCard="hideCard"></v-card>

  </div>
</template>

<script>
import vPagination from '../../component/pagination'
import vCard from '../../component/card'
export default {
  data(){
    return {
      cardStatus:false,
      ruleForm:{},
      rules:['title','start_time','end_time'],
      ruleType:{
        'title':{
          type:'input',
          label:'标题',
          placeholder:'请输入标题'
        },
        'start_time':{
          type:'date',
          label:'开始时间',
          placeholder:'请输入开始时间'
        },
        'end_time':{
          type:'date',
          label:'结束时间',
          placeholder:'请输入结束时间'
        }
      },
      screen:{
        page:1,
        page_num:10
      },
      offlineTitle:'',
      ldList:[],
      total:0
    }
  },
  components:{
      vPagination,
      vCard
  },
  mounted(){
    this.getHd()
  },
  methods: {
    goluckyDrawGoods(id){
      this.$router.push({ path: '/luckyDraw/luckyDrawGoods', query:{
        id:id
      } })
    },
    getHdInfo(id){
      let that =this;
      that.$request({
        data: {
          id:id
        },
        url: 'coupons/getHd',
        success(res){
          that.ruleForm = res.luckydraw || {}
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
    statusChange(id,status){
      let that =this;
      that.$request({
        data: {
          id:id,
          status:status
        },
        url: 'coupons/updateHd',
        form:3,
        error(){
          that.getHd()
        }
      })
    },
    sumbit(data){
      data.ruleForm.id ?this.updateHd(data.ruleForm):this.saveHd(data.ruleForm)
    },
    saveHd(data){
      let that =this;
      that.$request({
        data: data,
        url: 'coupons/saveHd',
        form:1,
        success(res){
          that.ruleForm = {}
          that.getHd()
          that.cardStatus = false
        }
      })
    },
    updateHd(data){
      let that =this;
      that.$request({
        data: data,
        url: 'coupons/updateHd',
        form:3,
        success(res){
          that.ruleForm = {}
          that.getHd()
          that.cardStatus = false
        },
        error(){
          that.getHd()
        }
      })
    },
    pageChange(obj){
        this.screen.page = obj.page
        this.getHd()
    },
    getHd(){
      let that =this;
      that.$request({
        data: that.screen,
        url: 'coupons/getHd',
        success(res){
          that.ldList = res.luckydraw
          that.total = res.total || 0;
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
