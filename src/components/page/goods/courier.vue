<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/supplier' }" replace>供应商</el-breadcrumb-item>
        <el-breadcrumb-item>快递模板</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">添加快递模板</el-button>
  </div>

    <el-table :data="courierList" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column  prop="stypeText" label="计价方式" ></el-table-column>
      <el-table-column  prop="title" label="标题" ></el-table-column>
      <el-table-column  prop="desc" label="详情" ></el-table-column>
      <el-table-column fixed="right" label="操作"  >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="getCourier(scope.row.id)">编辑</el-button>
          <el-button type="primary" size="small" @click="goFreight(scope.row.id,scope.row.stype)">运费模板</el-button>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :total="total"></v-pagination>

    <v-card name='供应商' width="120" :cardStatus="cardStatus" :ruleType="ruleType" :ruleForm="ruleForm" :rules="rules" @sumbit="sumbit" @hideCard="hideCard"></v-card>

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
      rules:['stype','title','desc'],
      ruleType:{
        'stype':{
          type:'select',
          label:'计价方式',
          placeholder:'请选择计价方式',
          option:[{
            value:1,
            label:'件数'
          },{
            value:2,
            label:'重量'
          },{
            value:3,
            label:'体积'
          }]
        },
        'title':{
          type:'input',
          label:'标题',
          placeholder:'请输入标题'
        },
        'desc':{
          type:'input',
          inpType:'textarea',
          label:'详情',
          placeholder:'请输入详情'
        },
      },
      stype:{1:'件数',2:'重量',3:'体积'},
      supplierId:'',
      courierList:[],
      total:0
    }
  },
  components:{
      vPagination,
      vCard
  },
  mounted(){
    this.supplierId = this.$route.query.id;
    this.getsupplierfreights()
  },
  methods: {
    goFreight(id,type){
      console.log(id)
      this.$router.push({ path: '/supplier/freight', query:{
        id:id,
        type:type,
        supplierId:this.supplierId
      } })
    },
    showCard(){
      this.ruleForm = {}
      this.cardStatus = true
    },
    hideCard(){
      this.cardStatus = false
    },
    sumbit(data){
      data.ruleForm.id ?this.updateSupplierFreight(data.ruleForm):this.addsupplier(data.ruleForm)
    },
    addsupplier(data){
      let that =this;
      data.supplierId = that.supplierId
      that.$request({
        data: data,
        url: 'suppliers/addsupplierfreight',
        form:1,
        success(res){
          that.ruleForm = {}
          that.getsupplierfreights()
          that.cardStatus = false
        }
      })
    },
    updateSupplierFreight(data){
      let that =this;
      data.supplier_freight_Id = data.id
      that.$request({
        data: data,
        url: 'suppliers/updateSupplierFreight',
        form:3,
        success(res){
          that.ruleForm = {}
          that.getsupplierfreights()
          that.cardStatus = false
        }
      })
    },
    getCourier(id){
      let that =this;
      that.$request({
        data: {
          supplierFreightId:id
        },
        url: 'suppliers/getSupplierFreight',
        success(res){
          that.ruleForm = res.data || {}
          that.cardStatus = true
        }
      })
    },
    onQuery(screen){
      this.extend(this.screen,screen);
      this.screen.page = 1;
      this.getsupplierfreights();
    },
    extend(target, options) {
        for (name in options) {
            target[name] = options[name];
        }
        return target;
    },
    pageChange(obj){
        this.screen.page = obj.page
        this.getsupplierfreights()
    },
    getsupplierfreights(){
      let that =this;
      that.$request({
        data: {
          supplierId:that.supplierId
        },
        url: 'suppliers/getsupplierfreights',
        success(res){
          that.courierList = that.discourierList(res.data) 
          that.total = res.totle || 0;
        }
      })
    },
    discourierList(data= []){
      for(let i=0,len=data.length;i<len;i++){
        data[i].stypeText = this.stype[data[i].stype] 
      }
      return data
    }
  }
}
</script>

<style scoped>
</style>
