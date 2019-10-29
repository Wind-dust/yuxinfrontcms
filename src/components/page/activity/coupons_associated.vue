<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/coupons' }">优惠券</el-breadcrumb-item>
        <el-breadcrumb-item class="title">优惠券活动列表:({{title}})</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">关联优惠券活动</el-button>
  </div>

    <el-table :data="couponhdList" border style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="title" label="优惠券活动标题" ></el-table-column>
      <el-table-column prop="content" label="优惠券活动内容" ></el-table-column>
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
export default {
  data(){
    return {
      cardStatus:false,
      ruleForm:{},
      rules:['coupon_hd_id'],
      ruleType:{
        'coupon_hd_id':{
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
      couponhdList:[],
      total:0
    }
  },
  components:{
      vPagination,
      vCard
  },
  mounted(){
    this.screen.coupon_id = this.$route.query.id;
    this.gethdcouponlist()
    this.getcouponhdlist()
  },
  methods: {
    unbindcouponhd(id){
      let that =this;
      that.$request({
        data: {
          coupon_hd_id:id,
          coupon_id:that.screen.coupon_id
        },
        url: 'coupons/unbindcouponhd',
        form:2,
        success(res){
          (parseInt(that.total)%10) === 1 ?that.pageChange({page:1}) :that.gethdcouponlist()
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
     data.ruleForm.coupon_id = that.screen.coupon_id
      that.$request({
        data: data.ruleForm,
        url: 'coupons/bindcouponhd',
        form:1,
        success(res){
          that.ruleForm = {}
          that.gethdcouponlist()
          that.cardStatus = false
        }
      })
    },
    getcouponhdlist(){
      let that =this;
      that.$request({
        data:{
          page_num:10000,
        },
        url: 'coupons/getcouponhdlist',
        success(res){
          that.ruleType['coupon_hd_id'].option = res.data
        }
      })
    },
    pageChange(obj){
        this.screen.page = obj.page
        this.gethdcouponlist()
    },
    gethdcouponlist(){
      let that =this;
      that.$request({
        data: that.screen,
        url: 'coupons/gethdcouponlist',
        success(res){
          that.couponhdList = res.data.coupons_hd
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
