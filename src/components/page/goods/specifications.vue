<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品规格</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">添加规格</el-button>
  </div>

    <v-screen :screen="screenQuery" @query="onQuery" ></v-screen>

    <el-table :data="specList" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column  prop="category" label="三级分类" ></el-table-column>
      <el-table-column  prop="spe_name" label="规格名称" ></el-table-column>
      <el-table-column fixed="right" label="操作"  width="350">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="goAttribute(scope.row.id)">查看属性</el-button>
          <el-button type="primary" size="small" @click="getEditData(scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :num='num' :total="total"></v-pagination>

    <v-card name='商品规格' width="100" :cardStatus="cardStatus" :ruleType="ruleType" :ruleForm="ruleForm" :rules="rules" @sumbit="sumbit" @hideCard="hideCard"></v-card>

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
      rules:[],
      aRules:['top_id','sa_name'],
      cRules:['spe_name'],
      ruleType:{},
      aRuleType:{
        'top_id':{
          type:'cascader',
          label:'三级分类',
          placeholder:'请选择三级分类',
          props:{
            value:'id',
            label:'type_name',
            children:'_child',
            emitPath:false
          },
          option:[]
        },
        'sa_name':{
          type:'input',
          label:'规格名称',
          placeholder:'请输入规格名称'
        }
      },
      cRuleType:{
        'spe_name':{
          type:'input',
          label:'规格名称',
          placeholder:'请输入规格名称'
        }
      },
      screen:{
        page:1,
        page_num:10
      },
      screenQuery:[{
        ref:'type_name',
        label:'分类名称',
        placeholder:'请输入分类名称',
        type:'input',
        content:'',
      }],
      specList:[],
      total:0
    }
  },
  components:{
      vScreen,
      vPagination,
      vCard
  },
  mounted(){
    this.getSpecList()
    this.getAllCateList()
  },
  methods: {
    getAllCateList(){
      let that =this;
      that.$request({
        url: 'category/allCateList',
        success(res){
          that.aRuleType['top_id'].option = res.data || []
        }
      })
    },
    goAttribute(id){
      this.$router.push({ path: '/specifications/attribute', query:{
        id:id
      } })
    },
    getEditData(id){
      let that =this;
      that.$request({
        data: {
          id:id,
          type:1
        },
        url: 'spec/getEditData',
        success(res){
          that.ruleType = that.cRuleType
          that.rules = that.cRules
          that.ruleForm = res.spec || {}
          that.cardStatus = true
        }
      })
    },
    showCard(){
      this.ruleForm = {}
      this.ruleType = this.aRuleType
      this.rules = this.aRules
      this.cardStatus = true
    },
    hideCard(){
      this.cardStatus = false
    },
    sumbit(data){
      data.ruleForm.id ? this.saveEditSpecAttr(data):this.savespecattr(data)
    },
    savespecattr(data){
      let that =this;
      data.ruleForm.type = 1
      that.$request({
        data: data.ruleForm,
        url: 'spec/savespecattr',
        form:1,
        success(res){
          that.ruleForm = {}
          that.getSpecList()
          that.cardStatus = false
        }
      })
    },
    saveEditSpecAttr(data){
      let that =this;
      data.ruleForm.type = 1
      data.ruleForm.sa_name = data.ruleForm.spe_name
      that.$request({
        data: data.ruleForm,
        url: 'spec/saveEditSpecAttr',
        form:1,
        success(res){
          that.ruleForm = {}
          that.getSpecList()
          that.cardStatus = false
        }
      })
    },
    onQuery(screen){
      this.extend(this.screen,screen);
      this.screen.page = 1;
      this.num++
      this.getSpecList();
    },
    extend(target, options) {
        for (name in options) {
            target[name] = options[name];
        }
        return target;
    },
    pageChange(obj){
        this.screen.page = obj.page
        this.getSpecList()
    },
    getSpecList(){
      let that =this;
      that.$request({
        data: that.screen,
        url: 'spec/getSpecList',
        success(res){
          that.specList = res.data
          that.total = res.total || 0;
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
