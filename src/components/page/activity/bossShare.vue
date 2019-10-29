<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>BOSS分享钻石卡</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">添加BOSS分享</el-button>
  </div>

    <el-table :data="bossShareList" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column  prop="linkman" label="BOSS名称" ></el-table-column>
      <el-table-column  prop="shopid" label="店铺ID" ></el-table-column>
      <el-table-column  prop="stock" label="分享数量" ></el-table-column>
      <el-table-column  prop="num" label="已领数量" ></el-table-column>
      <el-table-column  prop="coupon_money" label="分享金额" ></el-table-column>
      <el-table-column  prop="redmoneyStatusText" label="分享状态" ></el-table-column>
      <el-table-column  prop="typeText" label="使用类型" ></el-table-column>
      <el-table-column  prop="create_time" label="创建时间" width="180" ></el-table-column>
      <el-table-column  prop="statusText" label="状态" ></el-table-column>
      <el-table-column fixed="right" label="操作"  width="350">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status == 0" size="small" @click="passBossShareDiamondvip(scope.row.id,1)">审核通过</el-button>
          <el-button type="primary" v-if="scope.row.status == 0"  size="small" @click="passBossShareDiamondvip(scope.row.id,2)">审核不通过</el-button>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :total="total"></v-pagination>

    <v-card name='添加商品基本信息' width="100" :cardStatus="cardStatus" :ruleType="ruleType" :ruleForm="ruleForm" :rules="rules" @sumbit="sumbit" @hideCard="hideCard"></v-card>

  </div>
</template>

<script>
import vScreen from '../../component/screen'
import vPagination from '../../component/pagination'
import vCard from '../../component/card'
import {map} from '../../../assets/js/underscore'
export default {
  data(){
    return {
      cardStatus:false,
      ruleForm:{},
      rules:['mobile','linkman','stock','coupon_money','redmoney_status','type'],
      ruleType:{
        'mobile':{
          type:'number',
          label:'会员手机号',
          placeholder:'请输入会员手机号'
        },
        'linkman':{
          type:'input',
          label:'会员姓名',
          placeholder:'请输入会员姓名'
        },
        'stock':{
          type:'number',
          label:'分享数量',
          placeholder:'请输入分享数量'
        },
        'coupon_money':{
          type:'number',
          label:'分享金额',
          placeholder:'请输入分享金额'
        },
        'redmoney_status':{
          type:'select',
          label:'商票状态',
          placeholder:'请选择商票状态',
          option:[{
            value:'1',
            label:'直接领取'
          },{
            value:'2',
            label:'分享激活后获得'
          }]
        },
        'type':{
          type:'select',
          label:'使用类型',
          placeholder:'请选择使用类型',
          option:[{
            value:'1',
            label:'分享使用'
          },{
            value:'2',
            label:'绑定二维码链接'
          }]
        }
      },
      redmoneyStatus:{
        1:'直接领取',
        2:'分享激活后获得'
      },
      type:{
        1:'分享使用',
        2:'绑定二维码链接'
      },
      status:{
        0:'申请中',
        1:'审核通过',
        2:'审核不通过',
        3:'次数已用完'
      },
      screen:{
        page:1,
        page_num:10
      },
      bossShareList:[],
      total:0
    }
  },
  components:{
      vPagination,
      vCard
  },
  mounted(){
    this.getBossShareDiamondvip()
  },
  methods: {
    passBossShareDiamondvip(id,status){
      let that =this;
      that.$request({
        data:{
          id:id,
          status:status
        },
        url: 'Rights/passBossShareDiamondvip',
        form:1,
        success(res){
          that.getBossShareDiamondvip()
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
      let that =this;
      that.$request({
        data: data.ruleForm,
        url: 'Rights/creatBossShareDiamondvip',
        form:1,
        success(res){
          that.ruleForm = {}
          that.getBossShareDiamondvip()
          that.cardStatus = false
        }
      })
    },
    pageChange(obj){
        this.screen.page = obj.page
        this.getBossShareDiamondvip()
    },
    getBossShareDiamondvip(){
      let that =this;
      that.$request({
        data: that.screen,
        url: 'Rights/getBossShareDiamondvip',
        success(res){
          that.bossShareList = that.disShareList(res.data) 
          that.total = res.totle || 0;
        }
      })
    },
    disShareList(data = []){
      for(let i=0,len=data.length;i<len;i++){
        data[i].redmoneyStatusText = this.redmoneyStatus[data[i].redmoney_status] || '未知'
        data[i].typeText = this.type[data[i].type] || '未知'
        data[i].statusText = this.status[data[i].status] || '未知'
      }
      return data
    }
  }
}
</script>

<style scoped>
</style>
