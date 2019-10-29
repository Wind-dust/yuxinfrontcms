<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>消息模板</el-breadcrumb-item>
        <el-breadcrumb-item>触发列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">添加触发</el-button>
  </div>

    <el-table :data="triggerList" border style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column  prop="title" label="标题" ></el-table-column>
      <el-table-column  prop="start_time" label="活动开始时间" ></el-table-column>
      <el-table-column  prop="stop_time" label="活动停止时间" ></el-table-column>
      <el-table-column  prop="create_time" label="创建时间" ></el-table-column>
      <el-table-column  prop="statusText" label="状态" ></el-table-column>
      <el-table-column fixed="right" label="操作" width="350" >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="getTriggerInfo(scope.row.id)">编辑</el-button>
          <el-button type="primary" size="small" @click="auditTrigger(scope.row.id,2)">启用</el-button>
          <el-button type="primary" size="small" @click="auditTrigger(scope.row.id,3)">停用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :total="total"></v-pagination>

    <v-card name='线下活动' width="120" :cardStatus="cardStatus" :ruleType="ruleType" :ruleForm="ruleForm" :rules="rules" @sumbit="sumbit" @hideCard="hideCard"></v-card>

  </div>
</template>

<script>
import vPagination from '../../component/pagination'
import vCard from '../../component/card'
import {downloadIamge} from '../../../assets/js/common'
export default {
  data(){
    return {
      cardStatus:false,
      ruleForm:{},
      rules:['title','start_time','stop_time'],
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
        }
      },
      screen:{
        page:1,
        page_num:10
      },
      status:{
        1:'待审核',
        2:'启用',
        3:'停用',
      },
      offlineTitle:'',
      triggerList:[],
      total:0
    }
  },
  components:{
      vPagination,
      vCard
  },
  mounted(){
    this.getTrigger()
  },
  methods: {
    auditTrigger(id,status){
      let that =this;
      that.$request({
        data: {
          id:id,
          status:status
        },
        url: 'ModelMessage/auditTrigger',
        form:3,
        success(res){
          that.getTrigger()
        }
      })
    },
    getTriggerInfo(id){
      let that =this;
      that.$request({
        data: {
          id:id
        },
        url: 'ModelMessage/getTrigger',
        success(res){
          that.ruleForm = res.Trigger || {}
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
      data.ruleForm.id ?this.editTrigger(data.ruleForm):this.addTrigger(data.ruleForm)
    },
    addTrigger(data){
      let that =this;
      that.$request({
        data: data,
        url: 'ModelMessage/addTrigger',
        form:1,
        success(res){
          that.ruleForm = {}
          that.getTrigger()
          that.cardStatus = false
        }
      })
    },
    editTrigger(data){
      let that =this;
      that.$request({
        data: data,
        url: 'ModelMessage/editTrigger',
        form:3,
        success(res){
          that.ruleForm = {}
          that.getTrigger()
          that.cardStatus = false
        }
      })
    },
    pageChange(obj){
        this.screen.page = obj.page
        this.getTrigger()
    },
    getTrigger(){
      let that =this;
      that.$request({
        data: that.screen,
        url: 'ModelMessage/getTrigger',
        success(res){
          that.triggerList = that.disTrigger(res.Trigger)
          that.total = res.total || 0;
        }
      })
    },
    disTrigger(data = []){
      for(let i=0,len=data.length;i<len;i++){
        data[i].statusText = this.status[data[i].status]
      }
      return data
    }
  }
}
</script>

<style scoped>
.qrcode{
  width: 250px;
}
</style>
