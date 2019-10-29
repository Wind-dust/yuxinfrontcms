<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>金融管理</el-breadcrumb-item>
        <el-breadcrumb-item>邀请成为boss</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard(true)">添加</el-button>
  </div>

    <v-screen :screen="screenQuery" @query="onQuery" ></v-screen>

    <el-table :data="openbosslist" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column  prop="admin_name" label="操作管理员" ></el-table-column>
      <el-table-column  prop="nick_name" label="开通账号昵称" ></el-table-column>
      <el-table-column  prop="mobile" label="开通账号手机号" ></el-table-column>
      <el-table-column  prop="money" label="预扣款金额" ></el-table-column>
      <el-table-column  prop="message" label="描述" ></el-table-column>
      <el-table-column  prop="create_time" label="创建时间" ></el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :num='num' :total="total"></v-pagination>

    <v-card name='充值管理' width="120" :cardStatus="cardStatus" :ruleType="ruleType" :ruleForm="ruleForm" :rules="rules" @sumbit="sumbit" @hideCard="hideCard"></v-card>


  </div>
</template>

<script>
import {getStype, getIdentity, getStatus} from '../../../assets/js/common'
import vScreen from '../../component/screen'
import vPagination from '../../component/pagination'
import vCard from '../../component/card'
export default {
  data(){
    return {
      num:1,
      cardStatus:false,
      ruleForm:{},
      rules:['nick_name','mobile','money'],
      ruleType:{
        'nick_name':{
          type:'input',
          label:'开通账号昵称',
          placeholder:'请输入开通账号昵称'
        },
        'mobile':{
          type:'number',
          label:'开通账号手机号',
          placeholder:'请输入开通账号手机号'
        },
        'money':{
          type:'number',
          label:'开通后扣除金额',
          placeholder:'请输入开通后扣除金额'
        },
        'message':{
          type:'input',
          inpType:'textarea',
          label:'描述',
          placeholder:'请输入描述'
        }
      },
      screen:{
        page:1,
        page_num:10
      },
      screenQuery:[{
        ref:'nick_name',
        label:'开通账号昵称',
        type:'input',
        content:'',
        placeholder:'请输入开通账号昵称'
      },{
        ref:'mobile',
        label:'开通账号手机号',
        type:'input',
        content:'',
        placeholder:'请输入开通账号手机号'
      }],
      openbosslist:[],
      total:0
    }
  },
  components:{
      vScreen,
      vPagination,
      vCard
  },
  mounted(){
    this.getopenbosslist()
  },
  methods: {
    showCard(){
      this.cardStatus = true
    },
    hideCard(data){
      this.cardStatus = false
    },
    sumbit(data){
      console.log(data.ruleForm)
      let that =this
      that.$request({
        data: data.ruleForm,
        form:1,
        url: 'admin/openboss',
        success(res){
          that.cardStatus = false
          that.ruleForm = {}
          that.getopenbosslist();
        }
      })
    },
    onQuery(screen){
      this.screen = screen
      this.screen.page = 1
      this.num++;
      this.getopenbosslist()
    },
    getopenbosslist(){
      let that =this
      that.screen.page_num = 10
      that.$request({
        data: that.screen,
        url: 'admin/getopenbosslist',
        success(res){
          that.openbosslist = res.data ||[]
          that.total = res.all_count || 0;
        }
      })
    },
    pageChange(obj){
        this.screen.page = obj.page
        this.getopenbosslist()
    }
  }
}
</script>

<style scoped>

</style>
