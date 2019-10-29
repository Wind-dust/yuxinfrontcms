<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/couponsHd' }">优惠券活动</el-breadcrumb-item>
        <el-breadcrumb-item class="title">活动优惠券列表:({{title}})</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">关联优惠券</el-button>
  </div>

    <el-table :data="couponList" border style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="title" label="标题" ></el-table-column>
      <el-table-column prop="price" label="优惠金额" ></el-table-column>
      <el-table-column fixed="right" label="操作" width="350" >
        <template slot-scope="scope">
          <el-button type="danger" size="small" @click="unbindcouponhd(scope.row.id)">解除关联</el-button>
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
      rules:['coupon_id'],
      ruleType:{
        'coupon_id':{
          type:'select',
          label:'优惠券类型',
          placeholder:'请选择优惠券类型',
          val:'id',
          lab:'title',
          option:[]
        },
      },
      screen:{
        coupon_hd_id:'',
        page:1,
        page_num:10
      },
      title:'',
      couponList:[],
      total:0
    }
  },
  components:{
      vPagination,
      vCard
  },
  mounted(){
    this.screen.coupon_hd_id = this.$route.query.id;
    console.log(this.screen.coupon_hd_id)
    this.gethdcoupon()
    this.getcouponlist()
  },
  methods: {
    unbindcouponhd(id){
      let that =this;
      that.$request({
        data: {
          coupon_hd_id:that.screen.coupon_hd_id,
          coupon_id:id
        },
        url: 'coupons/unbindcouponhd',
        form:2,
        success(res){
          (parseInt(that.total)%10) === 1 ?that.pageChange({page:1}) :that.gethdcoupon()
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
     data.ruleForm.coupon_hd_id = that.screen.coupon_hd_id
      that.$request({
        data: data.ruleForm,
        url: 'coupons/bindcouponhd',
        form:1,
        success(res){
          that.ruleForm = {}
          that.gethdcoupon()
          that.cardStatus = false
        }
      })
    },
    getcouponlist(){
      let that =this;
      that.$request({
        data:{
          page_num:10000,
        },
        url: 'coupons/getcouponlist',
        success(res){
          that.ruleType['coupon_id'].option = res.data
        }
      })
    },
    pageChange(obj){
        this.screen.page = obj.page
        this.gethdcoupon()
    },
    gethdcoupon(){
      let that =this;
      that.$request({
        data: that.screen,
        url: 'coupons/gethdcoupon',
        success(res){
          that.couponList = res.data.coupons
          that.title = res.data.title
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
