<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>金融管理</el-breadcrumb-item>
        <el-breadcrumb-item>充值管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard(true)">充值</el-button>
  </div>

    <v-screen :screen="screenQuery" @query="onQuery" ></v-screen>

    <el-table :data="AdminRemittance" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column  prop="initiateadmin.admin_name" label="发起操作人" ></el-table-column>
      <el-table-column  prop="create_time" label="发起时间" ></el-table-column>
      <el-table-column  prop="user.nick_name" label="充值用户昵称" ></el-table-column>
      <el-table-column  prop="user.mobile" label="充值用户手机号" ></el-table-column>
      <el-table-column  prop="identity" label="充值用户身份" ></el-table-column>
      <el-table-column  prop="stypeText" label="充值类型" ></el-table-column>
      <el-table-column  prop="credit" label="充值金额" ></el-table-column>
      <el-table-column  prop="message" label="前端描述" ></el-table-column>
      <el-table-column  prop="admin_message" label="后端描述" ></el-table-column>
      <el-table-column  prop="statusText" label="状态" ></el-table-column>
      <el-table-column fixed="right" label="操作"  width="210">
        <template slot-scope="scope">
          <el-button type="primary" size="small" v-if="scope.row.status == 1"  @click="auditAdminRemittance(scope.row.id,1)">审核通过</el-button>
          <el-button type="danger" v-if="scope.row.status == 1"  size="small" @click="auditAdminRemittance(scope.row.id,2)">审核不通过</el-button>
        </template>
      </el-table-column>
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
      rules:['passwd','nick_name','mobile','credit','stype'],
      ruleType:{
        'passwd':{
          type:'input',
          inpType:'password',
          label:'cms密码',
          placeholder:'请输入cms登录密码'
        },
        'nick_name':{
          type:'input',
          label:'前端用户昵称',
          placeholder:'请输入前端用户昵称'
        },
        'mobile':{
          type:'number',
          label:'前台用户手机号',
          placeholder:'请输入前台用户手机号'
        },
        'credit':{
          type:'number',
          label:'充值金额',
          placeholder:'请输入充值金额'
        },
        'stype':{
          type:'select',
          label:'充值类型',
          placeholder:'请选择充值类型',
          option:[ {
            value: 1,
            label: '商票'
          }, {
              value: 2,
              label: '佣金'
          }, {
              value: 3,
              label: '积分'
          }]
        },
        'message':{
          type:'input',
          inpType:'textarea',
          label:'前端描述',
          placeholder:'请输入前端描述'
        },
        'admin_message':{
          type:'input',
          inpType:'textarea',
          label:'后端描述',
          placeholder:'请输入后端描述'
        }
      },
      screen:{
        page:1,
        page_num:10
      },
      screenQuery:[{
        ref:'status',
        label:'状态',
        type:'select',
        content:'',
        option:[{
          value: '',
            label: '全部'
        }, {
            value: 1,
            label: '待审核'
        }, {
            value: 2,
            label: '审核通过'
        }, {
            value: 3,
            label: '审核没通过'
        }]
      },{
        ref:'stype',
        label:'充值类型',
        type:'select',
        content:'',
        option:[{
            value: '',
            label: '全部'
        }, {
            value: 1,
            label: '商票'
        }, {
            value: 2,
            label: '佣金'
        }, {
            value: 3,
            label: '积分'
        }]
      },{
        ref:'min_credit',
        label:'最小收款金额',
        type:'input',
        content:'',
        placeholder:'请输入最小收款金额'
      },{
        ref:'max_credit',
        label:'最大收款金额',
        type:'input',
        content:'',
        placeholder:'请输入最大收款金额'
      }],
      AdminRemittance:[],
      total:0
    }
  },
  components:{
      vScreen,
      vPagination,
      vCard
  },
  mounted(){
    this.getAdminRemittance()
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
        url: 'admin/adminRemittance',
        success(res){
          that.cardStatus = false
          that.ruleForm = {}
          that.getAdminRemittance();
        }
      })
    },
    onQuery(screen){
      // Object.prototype.push.apply(this.screen , screen ); 
      // Object.apply(this.screen,screen)
      this.screen = screen
      this.screen.page = 1
      this.num++;
      // console.log(this.screen)
      this.getAdminRemittance()
    },
    auditAdminRemittance(id = '',status = ''){
      let that =this
      that.$request({
        data: {
          id:id,
          status:status
        },
        url: 'admin/auditAdminRemittance',
        success(res){
          that.$message({message:'审核成功',type:'success' });
          that.getAdminRemittance();
        }
      })
    },
    getAdminRemittance(){
      let that =this
      that.screen.page_num = 10
      that.$request({
        data: that.screen,
        url: 'admin/getAdminRemittance',
        success(res){
          that.AdminRemittance = that.disAdminRemittance(res.AdminRemittances)
          that.total = res.total;
        }
      })
    },
    pageChange(obj){
        this.screen.page = obj.page
        this.getAdminRemittance()
    },
    disAdminRemittance(data = []){
      let arr = data, len = arr.length;
      for (let i = 0; i < len; i++) {
          arr[i].stypeText = getStype(arr[i].stype)
          arr[i].statusText = getStatus(arr[i].status)
          arr[i].identity = getIdentity(arr[i].user.user_identity)
      }
      return arr
    }
  }
}
</script>

<style scoped>

</style>
