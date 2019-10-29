<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/supplier' }" replace>供应商</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/supplier/courier',query:{id:supplierId} }" replace>快递模板</el-breadcrumb-item>
        <el-breadcrumb-item>运费模板</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">添加运费模板</el-button>
  </div>

    <el-table :data="courierList" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column  prop="unit_price" :label="'计价单位'+ stype[type]" ></el-table-column>
      <el-table-column  prop="price" label="邮费单价" ></el-table-column>
      <el-table-column  prop="after_price" label="续件价格" ></el-table-column>
      <el-table-column  prop="total_price" label="包邮价格" ></el-table-column>
      <el-table-column fixed="right" label="操作"  >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="getSupplierFreightdetail(scope.row.id)">编辑</el-button>
          <el-button type="primary" size="small" @click="getprovincecitybyfreight(scope.row.id)">地址</el-button>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :total="total"></v-pagination>

    <v-card name='运费模板' width="120" :cardStatus="cardStatus" :ruleType="ruleType" :ruleForm="ruleForm" :rules="rules" @sumbit="sumbit" @hideCard="hideCard"></v-card>

    <v-card name='地址' :cardStatus="aCardStatus" :ruleType="aRuleType" :ruleForm="aRuleForm" :rules="aRules" @sumbit="aSumbit" @hideCard="aHideCard"></v-card>

  </div>
</template>

<script>
import vPagination from '../../component/pagination'
import vCard from '../../component/card'
export default {
  data(){
    return {
      aCardStatus:false,
      aRuleForm:{},
      aRules:[],
      aRuleType:{
        'city_id_str':{
          type:'cascader',
          label:'地址',
          placeholder:'请选择地址',
          props:{
            value:'id',
            label:'area_name',
            children:'_child',
            multiple:true,
          },
          levels:true,
          // filterable:true,
          clearable:true,
          collapse:true,
          option:[]
        },
      },
      cardStatus:false,
      ruleForm:{},
      rules:['unit_price','price','after_price','total_price'],
      ruleType:{
        'unit_price':{
          type:'number',
          label:'计价单位',
          placeholder:'请输入计价单位'
        },
        'price':{
          type:'number',
          label:'邮费单价',
          placeholder:'请输入邮费单价'
        },
        'after_price':{
          type:'number',
          label:'续件价格',
          placeholder:'请输入续件价格'
        },
        'total_price':{
          type:'number',
          label:'包邮价格',
          placeholder:'请输入包邮价格'
        }
      },
      stype:{1:'(件)',2:'(kg)',3:'(m³)'},
      type:1,
      supplierId:'',
      courierId:'',
      courierList:[],
      total:0,
      freight_detail_id:''
    }
  },
  components:{
      vPagination,
      vCard
  },
  mounted(){
    this.courierId = this.$route.query.id;
    console.log()
    this.supplierId = this.$route.query.supplierId;
    this.type = this.$route.query.type;
    this.getSupplierFreightdetailList()
  },
  methods: {
    getprovincecitybyfreight(id){
      let that =this;
      that.$request({
        data: {
          freight_id:that.courierId,
          freight_detail_id:id
        },
        url: 'provinces/getprovincecitybyfreight',
        success(res){
          that.freight_detail_id = id
          that.aRuleType['city_id_str'].option = res.data
          that.aRuleForm = {
            city_id_str:that.disAddress(res.data)
          }
          console.log(that.aRuleForm)
          that.aCardStatus = true
        }
      })
    },
    disAddress(data = []){
      let arr = []
      for(let i=0,len=data.length;i<len;i++){
        for(let y=0,len1=data[i]._child.length;y<len1;y++){
          (data[i]._child[y].status == 2) && arr.push([data[i].id,data[i]._child[y].id])
        }
      }
      return arr
    },
    aSumbit(data){
      console.log(data.ruleForm)
      let that =this;
      data.ruleForm.city_id_str = that.disCityId(data.ruleForm.city_id_str)
      data.ruleForm.freight_detail_id = that.freight_detail_id
      that.$request({
        data: data.ruleForm,
        url: 'suppliers/updatesupplierfreightarea',
        form:3,
        success(res){
          that.ruleForm = {}
          that.freight_detail_id = ''
          that.aCardStatus = false
        }
      })
    },
    disCityId(data = []){
      let str = '';
      for(let i=0,len=data.length;i<len;i++){
        str+=data[i][1] + ','
      }
      str =  str.substring(0,str.length-1); 
      return str
    },
    showCard(){
      this.ruleForm = {}
      this.cardStatus = true
    },
    hideCard(){
      this.cardStatus = false
    },
    aHideCard(){
        this.aCardStatus = false
    },
    sumbit(data){
      data.ruleForm.id ?this.editsupplierfreightdetail(data.ruleForm):this.addSupplierFreightdetail(data.ruleForm)
    },
    addSupplierFreightdetail(data){
      let that =this;
      data.freight_id = that.courierId
      that.$request({
        data: data,
        url: 'suppliers/addSupplierFreightdetail',
        form:1,
        success(res){
          that.ruleForm = {}
          that.getSupplierFreightdetailList()
          that.cardStatus = false
        }
      })
    },
    editsupplierfreightdetail(data){
      let that =this;
      data.freight_detail_id = data.id
      that.$request({
        data: data,
        url: 'suppliers/editsupplierfreightdetail',
        form:3,
        success(res){
          that.ruleForm = {}
          that.getSupplierFreightdetailList()
          that.cardStatus = false
        }
      })
    },
    getSupplierFreightdetail(id){
      let that =this;
      that.$request({
        data: {
          sfd_id:id
        },
        url: 'suppliers/getSupplierFreightdetail',
        success(res){
          that.ruleForm = res.data || {}
          that.cardStatus = true
        }
      })
    },
    pageChange(obj){
        this.screen.page = obj.page
        this.getSupplierFreightdetailList()
    },
    getSupplierFreightdetailList(){
      let that =this;
      that.$request({
        data: {
          freight_id:that.courierId
        },
        url: 'suppliers/getSupplierFreightdetailList',
        success(res){
          that.courierList = res.data
          that.total = res.totle || 0;
        }
      })
    },
  }
}
</script>

<style scoped>
</style>
