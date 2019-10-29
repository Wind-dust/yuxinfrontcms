<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>优惠券</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">添加优惠券</el-button>
  </div>

    <el-table :data="couponList" border style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="title" label="标题" ></el-table-column>
      <el-table-column prop="price" label="优惠金额" ></el-table-column>
      <el-table-column prop="level_text" label="优惠券类型" ></el-table-column>
      <el-table-column prop="gs_id" label="商品或专题id" ></el-table-column>
      <el-table-column prop="name" label="商品或专题名称" ></el-table-column>
      <el-table-column prop="days" label="领取后几天有效" ></el-table-column>
      <el-table-column fixed="right" label="操作" width="350" >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="getcouponlistInfo(scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deletecoupon(scope.row.id)">删除</el-button>
          <el-button type="primary" size="small" @click="goAssociated(scope.row.id)">所属活动</el-button>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :total="total"></v-pagination>

    <v-card name='优惠券' width="120" :cardStatus="cardStatus" :ruleType="ruleType" :ruleForm="ruleForm" :rules="rules" @sumbit="sumbit" @hideCard="hideCard"></v-card>

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
      rules:['title','price','gs_id','level','days'],
      ruleType:{
        'title':{
          type:'input',
          label:'标题',
          placeholder:'请输入标题'
        },
        'price':{
          type:'number',
          label:'优惠金额',
          placeholder:'请输入优惠金额'
        },
        'level':{
          type:'select',
          label:'优惠券类型',
          placeholder:'请选择优惠券类型',
          option:[{
            value:1,
            label:'单商品优惠券'
          },{
            value:2,
            label:'专题优惠券'
          }]
        },
        'gs_id':{
          type:'input',
          label:'商品id或专题id',
          placeholder:'请输入商品id或专题id'
        },
        'days':{
          type:'number',
          label:'领取后几天有效',
          placeholder:'请输入自领取后几天内有效'
        }
      },
      level_text:{
        1:'单商品优惠券',
        2:'专题优惠券'
      },
      screen:{
        page:1,
        page_num:10
      },
      Qrcode:'',
      offlineTitle:'',
      couponList:[],
      total:0
    }
  },
  components:{
      vPagination,
      vCard
  },
  mounted(){
    this.getcouponlist()
  },
  methods: {
    goAssociated(id){
      this.$router.push({ path: '/coupons/coupons_associated', query:{
        id:id
      } })
    },
    deletecoupon(id){
      let that =this;
      that.$request({
        data: {id:id},
        url: 'coupons/deletecoupon',
        form:2,
        success(res){
          (parseInt(that.total)%10) === 1 ?that.pageChange({page:1}) :that.getcouponlist()
        }
      })
    },
    getcouponlistInfo(data){
      this.ruleForm = data
      this.cardStatus = true
    },
    showCard(){
      this.ruleForm = {}
      this.cardStatus = true
    },
    hideCard(){
      this.cardStatus = false
    },
    sumbit(data){
      data.ruleForm.id ?this.modifycoupon(data.ruleForm):this.addcoupon(data.ruleForm)
    },
    addcoupon(data){
      let that =this;
      if(data.title.length > 50){
        that.$message({message:'标题过长',type:'error' });
        return
      }
      that.$request({
        data: data,
        url: 'coupons/addcoupon',
        form:1,
        success(res){
          that.ruleForm = {}
          that.getcouponlist()
          that.cardStatus = false
        }
      })
    },
    modifycoupon(data){
      let that =this;
      if(data.title.length > 50){
        that.$message({message:'标题过长',type:'error' });
        return
      }
      that.$request({
        data: data,
        url: 'coupons/modifycoupon',
        form:3,
        success(res){
          that.ruleForm = {}
          that.getcouponlist()
          that.cardStatus = false
        }
      })
    },
    pageChange(obj){
        this.screen.page = obj.page
        this.getcouponlist()
    },
    getcouponlist(){
      let that =this;
      that.$request({
        data: that.screen,
        url: 'coupons/getcouponlist',
        success(res){
          that.couponList = res.data.map(val=>{
            val.level_text = that.level_text[val.level];
            return val;
          })
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
