<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>供应商</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">添加供应商</el-button>
  </div>

    <v-screen :screen="screenQuery" @query="onQuery" ></v-screen>

    <el-table :data="suppliersList" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column  prop="image" label="供应商图片" >
        <template slot-scope="scope">
          <img :src="scope.row.image" width="40"  class="head_pic"/>
        </template>
      </el-table-column>
      <el-table-column  prop="name" label="前端供应商名称" ></el-table-column>
      <el-table-column  prop="title" label="后端供应商名称" ></el-table-column>
      <el-table-column  prop="tel" label="	供应商客服" ></el-table-column>
      <el-table-column  prop="desc" label="供应商描述" width="350"></el-table-column>
      <el-table-column fixed="right" label="操作"  >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="getsupplierdata(scope.row.id)">编辑</el-button>
          <el-button type="primary" size="small" @click="goCourier(scope.row.id)">快递模板</el-button>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :num='num' :total="total" :page="page"></v-pagination>

    <v-card name='供应商' width="120" :cardStatus="cardStatus" :ruleType="ruleType" :ruleForm="ruleForm" :rules="rules" @sumbit="sumbit" @hideCard="hideCard"></v-card>

  </div>
</template>

<script>
import vScreen from '../../component/screen'
import vPagination from '../../component/pagination'
import vCard from '../../component/card'
export default {
  data(){
    return {
      num:1,
      cardStatus:false,
      ruleForm:{},
      rules:['name','image','tel','title','desc'],
      ruleType:{
        'name':{
          type:'input',
          label:'前端供应商名称',
          placeholder:'请输入前端供应商名称'
        },
        'title':{
          type:'input',
          label:'后端供应商名称',
          placeholder:'请输入后端供应商名称'
        },
        'tel':{
          type:'number',
          label:'供应商客服',
          placeholder:'请输入供应商客服'
        },
        'desc':{
          type:'input',
          inpType:'textarea',
          label:'供应商前端运费描述',
          placeholder:'请输入供应商前端运费描述'
        },
        'image':{
          type:'image',
          label:'产品标题图',
          placeholder:'请上传图片'
        }
      },
      screen:{
        page:1,
        page_num:10
      },
      page:1,
      screenQuery:[{
        ref:'supplierName',
        label:'供应商名称',
        placeholder:'请输入供应商名称',
        type:'input',
      }],
      suppliersList:[],
      total:0
    }
  },
  components:{
      vScreen,
      vPagination,
      vCard
  },
  mounted(){
    this.screen.page = parseInt(localStorage.getItem("supplier")) || 1
    this.page = this.screen.page
    this.getsuppliers()
  },
  methods: {
    goCourier(id){
      this.$router.push({ path: '/supplier/courier', query:{
        id:id
      } })
    },
    getsupplierdata(id){
      let that =this;
      that.$request({
        data: {
          supplierId:id
        },
        url: 'suppliers/getsupplierdata',
        success(res){
          that.ruleForm = res.data
          that.cardStatus = true
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
      data.ruleForm.id ?this.updatesupplier(data.ruleForm):this.addsupplier(data.ruleForm)
    },
    addsupplier(data){
      let that =this;
      that.$request({
        data: data,
        url: 'suppliers/addsupplier',
        form:1,
        success(res){
          that.ruleForm = {}
          that.getsuppliers()
          that.cardStatus = false
        }
      })
    },
    updatesupplier(data){
      let that =this;
      that.$request({
        data: data,
        url: 'suppliers/updatesupplier',
        form:3,
        success(res){
          that.ruleForm = {}
          that.getsuppliers()
          that.cardStatus = false
        }
      })
    },
    onQuery(screen){
      this.extend(this.screen,screen);
      this.screen.page = 1;
      localStorage.setItem("supplier", 1)
      this.num++
      this.getsuppliers();
    },
    extend(target, options) {
        for (name in options) {
            target[name] = options[name];
        }
        return target;
    },
    pageChange(obj){
        this.screen.page = obj.page
        localStorage.setItem("supplier", obj.page)
        this.getsuppliers()
    },
    getsuppliers(){
      let that =this;
      that.$request({
        data: that.screen,
        url: 'suppliers/getsuppliers',
        success(res){
          that.suppliersList = res.data
          that.total = res.totle || 0;
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
