<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>线下活动</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">添加活动</el-button>
  </div>

    <el-table :data="offlineList" border style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column  prop="title" label="标题" ></el-table-column>
      <el-table-column  prop="image_path" label="图片" >
        <template slot-scope="scope">
          <img :src="scope.row.image_path" width="40"  class="head_pic"/>
        </template>
      </el-table-column>
      <el-table-column  prop="start_time" label="活动开始时间" ></el-table-column>
      <el-table-column  prop="stop_time" label="活动停止时间" ></el-table-column>
      <el-table-column  prop="create_time" label="创建时间" ></el-table-column>
      <el-table-column fixed="right" label="操作" width="350" >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="getOfflineActivitiesInfo(scope.row.id)">编辑</el-button>
          <el-button type="primary" size="small" @click="goOfflineGoods(scope.row.id)">活动商品</el-button>
          <el-button type="primary" size="small" @click="showQrCard(scope.row.id,scope.row.title)">二维码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :total="total"></v-pagination>

    <v-card name='线下活动' width="120" :cardStatus="cardStatus" :ruleType="ruleType" :ruleForm="ruleForm" :rules="rules" @sumbit="sumbit" @hideCard="hideCard"></v-card>

    <div class="cen-card" v-if="qrCodeCard">
      <el-card class="box-card" >
        <div slot="header" class="clearfix">
            <span>二维码</span>
          </div>
        <el-form label-width="80px" :model="qrRuleForm" ref="qrRuleForm"  :rules="qrRules">
          <el-form-item v-if="!!Qrcode">
            <img v-if="Qrcode"  class="qrcode" :src="Qrcode" alt="二维码">
          </el-form-item>
          <el-form-item label="分享者ID" v-else  >
            <el-input v-model="qrRuleForm.uid" placeholder="请输入分享者ID"></el-input>
          </el-form-item>
          <el-form-item class="flex-cen">
            <el-button v-if="!!Qrcode" type="primary" @click="qrCodeDownload('qrRuleForm')">下载</el-button>
            <el-button v-else type="primary" @click="qrSumbit('qrRuleForm')">确定</el-button>
            <el-button  @click="hideQrCard()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
  </div>
  </div>
</template>

<script>
import vPagination from '../../component/pagination'
import vCard from '../../component/card'
import {downloadIamge} from '../../../assets/js/common'
export default {
  data(){
    return {
      qrCodeCard:false,
      cardStatus:false,
      qrRules:{
        'uid':[{
          required:true,
          message:'请输入分享者ID',
          trigger:'blur'
        }]
      },
      qrRuleForm:{},
      ruleForm:{},
      rules:['title','start_time','stop_time','image_path'],
      ruleType:{
        'title':{
          type:'input',
          label:'标题',
          placeholder:'请输入标题'
        },
        'start_time':{
          type:'date',
          label:'开始时间',
          placeholder:'请输入开始时间'
        },
        'stop_time':{
          type:'date',
          label:'结束时间',
          placeholder:'请输入结束时间'
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
      Qrcode:'',
      offlineTitle:'',
      offlineList:[],
      total:0
    }
  },
  components:{
      vPagination,
      vCard
  },
  mounted(){
    this.getOfflineActivities()
  },
  methods: {
    goOfflineGoods(id){
      this.$router.push({ path: '/offline/offlineGoods', query:{
        id:id
      } })
    },
    getOfflineActivitiesInfo(id){
      let that =this;
      that.$request({
        data: {
          id:id
        },
        url: 'OfflineActivities/getOfflineActivities',
        success(res){
          that.ruleForm = res.result || {}
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
    showQrCard(id,tit){
      this.qrRuleForm = { id:id }
      this.Qrcode = ''
      this.offlineTitle = tit
      this.qrCodeCard = true
    },
    hideQrCard(){
      this.qrCodeCard = false
    },
    qrSumbit(name){
      let that= this;
      that.$refs[name].validate((valid) => {
        if (valid) {
            that.$request({
              data: that.qrRuleForm,
              url: 'OfflineActivities/resetOfflineActivitiesQrcode',
              type:'get',
              success(res){
                that.Qrcode = res.Qrcode
              }
            })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    qrCodeDownload() {
        downloadIamge(this.Qrcode, this.offlineTitle)
    },
    sumbit(data){
      data.ruleForm.id ?this.updateOfflineActivities(data.ruleForm):this.addOfflineActivities(data.ruleForm)
    },
    addOfflineActivities(data){
      let that =this;
      that.$request({
        data: data,
        url: 'OfflineActivities/addOfflineActivities',
        form:1,
        success(res){
          that.ruleForm = {}
          that.getOfflineActivities()
          that.cardStatus = false
        }
      })
    },
    updateOfflineActivities(data){
      let that =this;
      that.$request({
        data: data,
        url: 'OfflineActivities/updateOfflineActivities',
        form:3,
        success(res){
          that.ruleForm = {}
          that.getOfflineActivities()
          that.cardStatus = false
        }
      })
    },
    pageChange(obj){
        this.screen.page = obj.page
        this.getOfflineActivities()
    },
    getOfflineActivities(){
      let that =this;
      that.$request({
        data: that.screen,
        url: 'OfflineActivities/getOfflineActivities',
        success(res){
          that.offlineList = res.result
          that.total = res.total || 0;
        }
      })
    }
  }
}
</script>

<style scoped>
.qrcode{
  width: 250px;
}
</style>
