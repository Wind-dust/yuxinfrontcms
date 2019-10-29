<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页轮播图</el-breadcrumb-item>
        <el-breadcrumb-item>轮播图管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">添加轮播图</el-button>
    </div>

    <el-table :data="slider" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="100"></el-table-column>
      <el-table-column  prop="image" label="图片" >
        <template slot-scope="scope">
          <img :src="scope.row.image_path" width="40"  class="head_pic"/>
        </template>
      </el-table-column>
      <el-table-column  prop="title" label="标题" ></el-table-column>
      <el-table-column  prop="jump_type" label="跳转路径" ></el-table-column>
      <el-table-column  prop="order" label="排序" ></el-table-column>
      <el-table-column  prop="jump_content" label="跳转内容" ></el-table-column>
      <!--<el-table-column  prop="status" label="状态" >-->
      <!--<template slot-scope="scope">-->
      <!--<el-switch v-model="scope.row.status" @change="statusChange(scope.row.id,scope.row.status)" :active-value="1" :inactive-value="2"></el-switch>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column fixed="right" label="操作" >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="editSlider(scope.row.id)">编辑</el-button>
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
        rules:['title','image_path'],
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
          'jump_type':{
            type:'input',
            label:'跳转类型',
            placeholder:'默认路径'
          },
          'image_path':{
            type:'image',
            label:'图片',
            placeholder:'请上传图片'
          }
        },
        screen:{
          page:1,
          page_num:10
        },
        page:1,
        total:0,
        slider:[]
      }
    },
    components:{
      vScreen,
      vPagination,
      vCard
    },
    mounted(){
      this.screen.page = parseInt(localStorage.getItem("goodList")) || 1
      this.page = this.screen.page
      this.getSlider()
    },
    methods: {


      showCard(){
        this.ruleForm = {}
        this.cardStatus = true
      },
      hideCard(){
        this.cardStatus = false
      },
      statusChange(id,status){
        let that =this;
        that.$request({
          data: {
            id:id,
            type:status
          },
          form:3,
          url: 'goods/updowngoods',
          error(){
            that.getSlider()
          }
        })
      },
      editSlider(id){
        this.cardStatus = true
        let that =this;
        that.$request({
          data: {id:id},
          url: 'banner/getBanner',
          success(res){
            that.ruleForm = res.banner || {}
          }
        })
      },
      sumbit(data){
        data.ruleForm.id ? this.edit(data):this.add(data)
      },
      add(data){
        let that =this;
        that.$request({
          data: data.ruleForm,
          url: 'banner/addBanner',
          form:1,
          success(res){
            that.ruleForm = {}
            that.getSlider()
            that.cardStatus = false
          }
        })
      },
      edit(data){
        let that =this;
        that.$request({
          data: data.ruleForm,
          url: 'banner/updateBanner',
          form:3,
          success(res){
            that.ruleForm = {}
            that.getSlider()
            that.cardStatus = false
          }
        })
      },
      onQuery(screen){
        this.extend(this.screen,screen);
        this.screen.page = 1;
        // localStorage.setItem("goodList",1)
        this.num++
        this.getSlider();
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
        this.getSlider()
      },
      getSlider(){
        let that =this;
        that.$request({
          data: that.screen,
          url: 'banner/getBanner',
          success(res){
            that.slider = res.banner
          }
        })
      }
    }
  }
</script>

<style scoped>
</style>
