<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品专题</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">添加商品专题</el-button>
  </div>

    <el-table :data="subjectList" default-expand-all row-key="id" :tree-props="{children: '_child', hasChildren: 'hasChildren'}" border style="width: 100%">
      <el-table-column prop="id"  label="专题ID" width="150"></el-table-column>
      <el-table-column  prop="image" label="图片" >
        <template slot-scope="scope">
          <img :src="scope.row.subject_image" width="40"  class="head_pic"/>
        </template>
      </el-table-column>
      <el-table-column  prop="subject_share_image" label="分享图片图片" >
        <template slot-scope="scope">
          <img :src="scope.row.subject_share_image" width="40"  class="head_pic"/>
        </template>
      </el-table-column>
      <el-table-column  prop="pid"  label="父级分类" width="80"></el-table-column>
      <el-table-column  prop="subject"  label="专题名称" ></el-table-column>
      <el-table-column  prop="order_by"  label="排序" ></el-table-column>
      <el-table-column  prop="status" label="状态" >
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" @change="statusChange(scope.row.id,scope.row.status)" :active-value="1" :inactive-value="2"></el-switch>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作"   >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="getsubjectdetail(scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <v-card name='商品专题' :cardStatus="cardStatus" :ruleType="ruleType" :ruleForm="ruleForm" :rules="rules" @sumbit="sumbit" @hideCard="hideCard"></v-card>

  </div>
</template>

<script>
import vCard from '../../component/card'
export default {
  data(){
    return {
      cardStatus:false,
      ruleForm:{},
      rules:['pid','subject'],
      ruleType:{
        'pid':{
          type:'cascader',
          label:'上级分类',
          placeholder:'请选择上级分类',
          hdplay:true,
          props:{
            value:'id',
            label:'subject',
            children:'_child',
            checkStrictly: true,
            emitPath:false
          },
          option:[]
        },
        'subject':{
          type:'input',
          label:'分类名称',
          placeholder:'请输入分类名称'
        },
        'order_by':{
          type:'input',
          label:'排序',
          placeholder:'请输入排序',
          hdplay:true
        },
        'status':{
          type:'select',
          label:'状态',
          placeholder:'请选择状态',
          option:[{
            value:1,
            label:'启用'
          },{
            value:2,
            label:'停用'
          }]
        },
        'image':{
          type:'image',
          label:'图片',
          placeholder:'请上传图片'
        },
        'share_image':{
          type:'image',
          label:'分享图片',
          placeholder:'请上传分享图片'
        },
      },
      subjectList:[]
    }
  },
  components:{
      vCard
  },
  mounted(){
    this.getallsubject()
    this.getallsubject2()
  },
  methods: {
    showCard(){
      this.ruleForm = {}
      this.ruleType['pid'].hdplay = false
      this.ruleType['order_by'].hdplay = true
      this.cardStatus = true
    },
    hideCard(){
      this.cardStatus = false
    },
    sumbit(data){
      data.ruleForm.id ?this.editsubject(data.ruleForm):this.addsubject(data.ruleForm)
    },
    statusChange(id,status){
      let that =this;
      that.$request({
        data: {
          id:id,
          status:status
        },
        form:3,
        url: 'subject/editsubject',
      })
    },
    addsubject(data){
      let that =this;
      that.$request({
        data: data,
        url: 'subject/addsubject',
        form:1,
        success(res){
          that.ruleForm = {}
          that.getallsubject()
          that.cardStatus = false
        }
      })
    },
    editsubject(data){
      let that =this;
      data.subject_image = data.image
      that.$request({
        data: data,
        url: 'subject/editsubject',
        form:3,
        success(res){
          that.ruleForm = {}
          that.getallsubject()
          that.cardStatus = false
        }
      })
    },
    getsubjectdetail(id){
      let that =this;
      that.$request({
        data: {
          subject_id:id
        },
        url: 'subject/getsubjectdetail',
        success(res){
          res.data = res.data || {}
          res.data.image = res.data.subject_image
          res.data.share_image = res.data.subject_share_image
          that.ruleForm = res.data
          that.ruleType['pid'].hdplay = true
          that.ruleType['order_by'].hdplay = false
          that.cardStatus = true
        }
      })
    },
    getallsubject2(){
      let that =this;
      that.$request({
        data: {
          stype:2
        },
        url: 'subject/getallsubject',
        success(res){
          that.ruleType['pid'].option = res.data || []
          that.ruleType['pid'].option.unshift({
            id: '0',
            subject: '顶级专题'
        })
        }
      })
    },
    getallsubject(){
      let that =this;
      that.$request({
        data: {
          stype:1
        },
        url: 'subject/getallsubject',
        success(res){
          that.subjectList = res.data
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
