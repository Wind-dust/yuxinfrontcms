<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/luckyDraw' }" >小程序抽奖活动</el-breadcrumb-item>
        <el-breadcrumb-item>奖品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">添加商品</el-button>
  </div>

    <el-table :data="goodList" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column  prop="title" label="奖品名称" ></el-table-column>
      <el-table-column  prop="image" label="图片" >
        <template slot-scope="scope">
          <img :src="scope.row.image" width="40"  class="head_pic"/>
        </template>
      </el-table-column>
      <el-table-column  prop="probability" label="中奖概率" ></el-table-column>
      <el-table-column  prop="kind_text" label="抽奖种类" ></el-table-column>
      <el-table-column  prop="relevance" label="抽奖内容" ></el-table-column>
      <el-table-column  prop="debris" label="碎片个数" ></el-table-column>
      <el-table-column  prop="has" label="已抽中数量(碎片)" width="100" ></el-table-column>
      <el-table-column  prop="stock" label="库存" ></el-table-column>
      <el-table-column  prop="winnings_number" label="可中数量(整个)" ></el-table-column>
      <el-table-column  prop="create_time" label="创建时间"></el-table-column>
      <el-table-column  prop="order" label="排序"></el-table-column>
      <el-table-column  prop="status_text" label="状态"></el-table-column>
      <el-table-column fixed="right" label="操作" width="200" >
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status ===1" size="small" @click="goodSort(scope.row.id,scope.row.order)">排序</el-button>
          <el-button v-if="scope.row.status ===1"  type="danger" size="small" @click="goodDisabled(scope.row.id)">失效</el-button>
        </template>
      </el-table-column>
    </el-table>

    <v-card name='新建奖品' :cardStatus="cardStatus" :ruleType="ruleType" :ruleForm="ruleForm" :rules="rules" @sumbit="sumbit" @hideCard="hideCard"></v-card>

    <v-card name='排序' :cardStatus="sCardStatus" :ruleType="sRuleType" :ruleForm="sRuleForm" :rules="sRules" @sumbit="sSumbit" @hideCard="sHideCard"></v-card>
  </div>
</template>

<script>
import vScreen from '../../component/screen'
import vCard from '../../component/card'
export default {
  data(){
    return {
      sCardStatus:false,
      sRuleForm:{},
      sRules:['order'],
      sRuleType:{
        'order':{
          type:'number',
          label:'排序',
          placeholder:'请输入排序'
        },
      },
      cardStatus:false,
      ruleForm:{},
      rules:['title','probability','kind','debris','stock','winnings_number'],
      ruleType:{
        'title':{
          type:'input',
          label:'奖品名称',
          placeholder:'请输入奖品名称'
        },
        'probability':{
          type:'input',
          label:'中奖概率',
          placeholder:'请输入中奖概率'
        },
        'kind':{
          type:'select',
          label:'抽奖种类',
          placeholder:'请选择抽奖种类',
          option:[{
            value:1,
            label:'优惠券'
          },{
            value:2,
            label:'商品SKU'
          },{
            value:3,
            label:'钻石卡身份'
          },{
            value:4,
            label:'商城积分'
          },{
            value:5,
            label:'通用碎片'
          }]
        },
        'relevance':{
          type:'input',
          label:'抽奖内容',
          placeholder:'请输入抽奖内容(优惠券ID或商品SKUID或积分)'
        },
        'debris':{
          type:'number',
          label:'碎片个数',
          placeholder:'请输入碎片个数'
        },
        'stock':{
          type:'number',
          label:'库存',
          placeholder:'请输入库存'
        },
        'winnings_number':{
          type:'number',
          label:'可中数量',
          placeholder:'请输入可中数量'
        },
        'image':{
          type:'image',
          label:'图片',
          placeholder:'请上传图片'
        }
      },
      kindJson:{
          1:'优惠券',
          2:'商品SKU',
          3:'钻石卡身份',
          4:'商城积分',
          5:'通用碎片'
        },
      hd_id:'',
      goodList:[]
    }
  },
  components:{
      vCard
  },
  mounted(){
    this.hd_id = this.$route.query.id;
    this.getHdGoods()
  },
  methods: {
    goodSort(id,order){
      this.sRuleForm = {id:id,order:order}
      this.sCardStatus = true
    },
    goodDisabled(id){
      let that =this;
      that.$request({
        data: {hd_id:that.hd_id,id:id},
        url: 'coupons/saveHdGoods',
        form:3,
        success(res){
          that.getHdGoods()
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
    sHideCard(){
      this.sCardStatus = false
    },
    sumbit(data){
      data.ruleForm.hd_id = this.hd_id;
      if(data.ruleForm.probability < 0) {
        this.$message({message:'中奖概率不能小于0',type:'error' });
        return
      }
      if(parseInt(data.ruleForm.debris) < 0) {
        this.$message({message:'碎片个数不能为负数',type:'error' });
        return
      }
      if(parseInt(data.ruleForm.stock) < 0) {
        this.$message({message:'库存不能为负数',type:'error' });
        return
      }
      if(parseInt(data.ruleForm.winnings_number) < 0) {
        this.$message({message:'可中数量不能为负数',type:'error' });
        return
      }
      let that =this;
      that.$request({
        data: data.ruleForm,
        url: 'coupons/addHdGoods',
        form:1,
        success(res){
          that.ruleForm = {}
          that.getHdGoods()
          that.cardStatus = false
        }
      })
    },
    sSumbit(data){
      let that =this;
      if(parseInt(data.ruleForm.order) < 1) {
        that.$message({message:'排序不能小于1',type:'error' });
        return
      }
      that.$request({
        data: data.ruleForm,
        url: 'coupons/saveHdGoods',
        form:3,
        success(res){
          that.sRuleForm = {}
          that.getHdGoods()
          that.sCardStatus = false
        }
      })
    },
    getHdGoods(){
      let that =this;
      that.$request({
        data: {hd_id:that.hd_id},
        url: 'coupons/getHdGoods',
        success(res){
          that.goodList = res.HdGoods.map(val=>{
            val.kind_text = that.kindJson[val.kind];
            val.status_text = val.status === 1?'正常':'失效';
            return val
          })
        }
      })
    },
  }
}
</script>

<style scoped>
</style>
