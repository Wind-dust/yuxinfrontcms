<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>供应商功能管理</el-breadcrumb-item>
        <el-breadcrumb-item>供应商账号</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">添加供应商账号</el-button>
  </div>

    <el-table :data="supplierList" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column  prop="sup_name" label="账号名称" ></el-table-column>
      <el-table-column  prop="mobile" label="手机号" ></el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :total="total"></v-pagination>

    <v-card name='线下活动' width="120" :cardStatus="cardStatus" :ruleType="ruleType" :ruleForm="ruleForm" :rules="rules" @sumbit="sumbit" @hideCard="hideCard"></v-card>

  </div>
</template>

<script>
import vPagination from '../../component/pagination'
import vCard from '../../component/card'
import {downloadIamge} from '../../../assets/js/common'
export default {
  data(){
    return {
      cardStatus:false,
      ruleForm:{},
      rules:['sup_name','mobile'],
      ruleType:{
        'sup_name':{
          type:'input',
          label:'供应商账号名称',
          placeholder:'请输入供应商账号名称'
        },
        'mobile':{
          type:'number',
          label:'手机号',
          placeholder:'请输入手机号'
        },
      },
      screen:{
        page:1,
        page_num:10
      },
      supplierList:[],
      total:0
    }
  },
  components:{
      vPagination,
      vCard
  },
  mounted(){
    this.supplieradminlist()
  },
  methods: {
    showCard(){
      this.ruleForm = {}
      this.cardStatus = true
    },
    hideCard(){
      this.cardStatus = false
    },
    sumbit(data){
      let that =this;
      that.$request({
        data: data.ruleForm, 
        url: 'suppliers/addsupplieradmin',
        form:1,
        success(res){
          that.ruleForm = {}
          that.supplieradminlist()
          that.cardStatus = false
        }
      })
    },
    pageChange(obj){
        this.screen.page = obj.page
        this.supplieradminlist()
    },
    supplieradminlist(){
      let that =this;
      that.$request({
        data: that.screen,
        url: 'suppliers/supplieradminlist',
        success(res){
          that.supplierList = res.data
          that.total = res.total || 0;
        }
      })
    }
  }
}
</script>

<style scoped>
.qrcode{
  width: 250px;
}
</style>
