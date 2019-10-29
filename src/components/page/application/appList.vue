<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>应用案例</el-breadcrumb-item>
        <el-breadcrumb-item>案例管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">添加案例</el-button>
    </div>

    <!--<v-screen :screen="screenQuery" @query="onQuery" ></v-screen>-->

    <el-table :data="appList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="100"></el-table-column>
      <el-table-column  prop="image" label="图片" >
        <template slot-scope="scope">
          <img :src="scope.row.image_path" width="40"  class="head_pic"/>
        </template>
      </el-table-column>
      <el-table-column  prop="title" label="标题" ></el-table-column>
      <el-table-column  prop="jump_content" label="跳转路径" ></el-table-column>
      <el-table-column  prop="order" label="排序" ></el-table-column>
      <el-table-column  prop="content" label="简介" ></el-table-column>
      <!--<el-table-column  prop="status" label="状态" >-->
        <!--<template slot-scope="scope">-->
          <!--<el-switch v-model="scope.row.status" @change="statusChange(scope.row.id,scope.row.status)" :active-value="1" :inactive-value="2"></el-switch>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column fixed="right" label="操作" >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="getOneAppInfo(scope.row.id)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :num='num' :total="total" :page="page"></v-pagination>

    <v-card name='添加案例' width="110" :cardStatus="cardStatus" :ruleType="ruleType" :ruleForm="ruleForm" :rules="rules" @sumbit="sumbit" @hideCard="hideCard"></v-card>

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
        rules:['title','content'],
        ruleType:{
          'title':{
            type:'input',
            label:'标题',
            placeholder:'请输入标题'
          },
          'jump_content':{
            type:'input',
            label:'跳转内容',
            placeholder:'跳转内容'
          },
          'order':{
            type:'input',
            label:'排序',
            placeholder:'排序'
          },
          'content':{
            type:'input',
            inpType:'textarea',
            label:'简介',
            placeholder:'输入案例简介'
          },
          'image_path':{
            type:'image',
            label:'案例图',
            placeholder:'请上传图片'
          }
        },
        screen:{
          page:1,
          page_num:10
        },
        page:1,
        total:0,
        appList:[]
      }
    },
    components:{
      vScreen,
      vPagination,
      vCard
    },
    mounted(){
      // this.screen.page = parseInt(localStorage.getItem("goodList")) || 1
      // this.page = this.screen.page
      this.getAppliction()
    },
    methods: {
      showCard(){
        this.ruleForm = {}
        this.cardStatus = true
      },
      hideCard(){
        this.cardStatus = false
      },
      getAppliction(){
        let that = this
        that.$request({
          url:'/ApplicationCase/getApplicationCase',
          data:{
            page:that.screen.page,
            pageNum:that.screen.page_num
          },
          success(res) {
            that.appList = res.ApplicationCase
          }
        })
      },
      getOneAppInfo(id){
        let that = this
        that.$request({
          url:'ApplicationCase/getApplicationCase',
          data:{
            id:id
          },
          success(res) {
            that.ruleForm = res.ApplicationCase || {}
            that.cardStatus = true
          }
        })
      },
      sumbit(data){
        this.ruleForm.id ? this.editAppInfo(data):this.addAppCase(data)
      },
      editAppInfo(data){
        // let form = {
        //   content:data.ruleForm.content,
        //   id:data.ruleForm.id,
        //   image_path: data.ruleForm.image_path,
        //   jump_content: data.ruleForm.jump_content,
        //   order:data.ruleForm.order
        // }
        let that = this
        that.$request({
          url:'ApplicationCase/updateApplicationCase',
          data:data.ruleForm,
          form:3,
          success(res) {
            that.ruleForm = {}
            that.getAppliction()
            that.cardStatus = false
          }
        })
      },
      addAppCase(data){
        let that =this;
        that.$request({
          data: data.ruleForm,
          url: 'ApplicationCase/addApplicationCase',
          form:1,
          success(res){
            that.ruleForm = {}
            that.getAppliction()
            that.cardStatus = false
          }
        })
      },
      onQuery(screen){
        this.extend(this.screen,screen);
        this.screen.page = 1;
        // localStorage.setItem("goodList",1)
        this.num++
        this.getgoodslist();
      },
      extend(target, options) {
        for (name in options) {
          target[name] = options[name];
        }
        return target;
      },
      pageChange(obj){
        this.screen.page = obj.page
        // localStorage.setItem("goodList", obj.page)
        this.getAppliction()
      }
    }
  }
</script>

<style scoped>
</style>
