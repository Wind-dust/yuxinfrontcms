<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">添加商品分类</el-button>
  </div>

    <el-table :data="cateList" default-expand-all row-key="id" :tree-props="{children: '_child', hasChildren: 'hasChildren'}" border style="width: 100%">
      <el-table-column prop="id"  label="分类ID" width="150"></el-table-column>
      <el-table-column  prop="pid"  label="父级分类" width="80"></el-table-column>
      <el-table-column  prop="type_name"  label="商品分类名" ></el-table-column>
      <el-table-column  prop="status" label="状态" >
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" @change="statusChange(scope.row.id,scope.row.status)" :active-value="1" :inactive-value="2"></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作"   >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="editcatepage(scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <v-card name='商品分类' :cardStatus="cardStatus" :ruleType="ruleType" :ruleForm="ruleForm" :rules="rules" @sumbit="sumbit" @hideCard="hideCard"></v-card>

  </div>
</template>

<script>
import vCard from '../../component/card'
export default {
  data(){
    return {
      cardStatus:false,
      ruleForm:{},
      rules:['pid','type_name'],
      ruleType:{
        'pid':{
          type:'cascader',
          label:'上级分类',
          placeholder:'请选择上级分类',
          hdplay:true,
          props:{
            value:'id',
            label:'type_name',
            children:'_child',
            checkStrictly: true,
            emitPath:false
          },
          option:[]
        },
        'type_name':{
          type:'input',
          label:'分类名称',
          placeholder:'请输入分类名称'
        },
        'status':{
          type:'select',
          label:'状态',
          placeholder:'请选择状态(默认停用)',
          option:[{
            value:1,
            label:'启用'
          },{
            value:2,
            label:'停用'
          }]
        },
      },
      cateList:[]
    }
  },
  components:{
      vCard
  },
  mounted(){
    this.supplierId = this.$route.query.id;
    this.allCateList()
    this.addCatePage()
  },
  methods: {
    showCard(){
      this.ruleForm = {}
      this.ruleType['pid'].hdplay = false
      this.ruleType['status'].hdplay = false
      this.rules = ['pid','type_name']
      this.cardStatus = true
    },
    hideCard(){
      this.cardStatus = false
    },
    sumbit(data){
      data.ruleForm.id ?this.saveeditcate(data.ruleForm):this.saveaddcate(data.ruleForm)
    },
    statusChange(id,status){
      let that =this;
      that.$request({
        data: {
          id:id,
          type:status
        },
        form:3,
        url: 'category/stopstartcate',
        error(){
          that.allCateList()
        }
      })
    },
    saveaddcate(data){
      let that =this;
      that.$request({
        data: data,
        url: 'category/saveaddcate',
        form:1,
        success(res){
          that.ruleForm = {}
          that.allCateList()
          that.cardStatus = false
        }
      })
    },
    saveeditcate(data){
      let that =this;
      that.$request({
        data: data,
        url: 'category/saveeditcate',
        form:3,
        success(res){
          that.ruleForm = {}
          that.allCateList()
          that.cardStatus = false
        }
      })
    },
    editcatepage(id){
      let that =this;
      that.$request({
        data: {
          id:id
        },
        url: 'category/editcatepage',
        success(res){
          if(!res.cate_data){
            that.$message({message:'上级停用中,无法修改',type:'error' });
            return
          }
          that.rules = ['type_name']
          that.ruleForm = res.cate_data || {}
          that.ruleType['pid'].hdplay = true
          that.ruleType['status'].hdplay = true
          
          that.cardStatus = true
        }
      })
    },
    pageChange(obj){
        this.screen.page = obj.page
        this.allCateList()
    },
    addCatePage(){
      let that =this;
      that.$request({
        url: 'category/addcatepage',
        success(res){
          that.ruleType['pid'].option = res.data || []
          that.ruleType['pid'].option.unshift({
            id: '0',
            type_name: '顶级分类'
        })
        }
      })
    },
    allCateList(){
      let that =this;
      that.$request({
        data: {
          type:3
        },
        url: 'category/allCateList',
        success(res){
          that.cateList = res.data
          that.total = res.totle || 0;
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
