<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/specifications' }" >商品规格</el-breadcrumb-item>
        <el-breadcrumb-item>商品属性</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">添加属性</el-button>
  </div>

    <el-table :data="attrList" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column  label="所属规格" >
        <template>
          <span>{{spec_name}}</span>
        </template>
      </el-table-column>
      <el-table-column  prop="attr_name" label="	属性名称" ></el-table-column>
      <el-table-column fixed="right" label="操作"  width="350">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="getEditData(scope.row.id)">编辑</el-button>
        </template> 
      </el-table-column>
    </el-table>

    <v-card name='商品规格' width="100" :cardStatus="cardStatus" :ruleType="ruleType" :ruleForm="ruleForm" :rules="rules" @sumbit="sumbit" @hideCard="hideCard"></v-card>

  </div>
</template>

<script>
import vCard from '../../component/card'
export default {
  data(){
    return {
      cardStatus:false,
      ruleForm:{},
      rules:['sa_name'],
      ruleType:{
        'sa_name':{
          type:'input',
          label:'属性名称',
          placeholder:'请输入属性名称'
        }
      },
      spec_id:'',
      spec_name:'',
      attrList:[],
      total:0
    }
  },
  components:{
      vCard
  },
  mounted(){
    this.spec_id = this.$route.query.id;
    this.getAttr()
  },
  methods: {
    getEditData(id){
      let that =this;
      that.$request({
        data: {
          id:id,
          type:2
        },
        url: 'spec/getEditData',
        success(res){
          that.ruleForm = res.attr || {}
          that.ruleForm.sa_name = that.ruleForm.attr_name
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
      let that =this,url = '',form = 1;
      data.ruleForm.type = 2
      console.log(!!data.ruleForm.id)
      if(data.ruleForm.id){
        url='spec/saveEditSpecAttr'
        form = 3
      }else{
        url='spec/savespecattr'
        data.ruleForm.top_id = that.spec_id
      }
      that.$request({
        data: data.ruleForm,
        url: url,
        form:form,
        success(res){
          that.ruleForm = {}
          that.getAttr()
          that.cardStatus = false
        }
      })
    },
    saveEditSpecAttr(){

    },
    getAttr(){
      let that =this;
      that.$request({
        data: {
          spec_id:that.spec_id
        },
        url: 'spec/getAttr',
        success(res){
          that.attrList = res.attr || [];
          that.spec_name = res.spec_name
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
