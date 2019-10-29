<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>消息模板</el-breadcrumb-item>
        <el-breadcrumb-item>任务列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">添加任务</el-button>
  </div>

    <el-table :data="taskList" border style="width: 100%">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column  prop="title" label="标题" ></el-table-column>
      <el-table-column  prop="typeText" label="发送人群" ></el-table-column>
      <el-table-column  prop="wtypeText" label="任务类型" ></el-table-column>
      <el-table-column  prop="messagetemplate.title" label="消息模板" ></el-table-column>
      <el-table-column  prop="messagetrigger.title" label="触发器" ></el-table-column>
      <el-table-column  prop="create_time" label="创建时间" ></el-table-column>
      <el-table-column  prop="statusText" label="状态" ></el-table-column>
      <el-table-column fixed="right" label="操作" width="350" >
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status != 2" size="small" @click="getMessageTaskInfo(scope.row.id)">编辑</el-button>
          <el-button type="primary" size="small" @click="auditMessageTask(scope.row.id,2)">启用</el-button>
          <el-button type="primary" size="small" @click="auditMessageTask(scope.row.id,3)">停用</el-button>
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
      rules:['title','type','wtype','mt_id','trigger_id'],
      ruleType:{
        'title':{
          type:'input',
          label:'标题',
          placeholder:'请输入标题'
        },
        'type':{
          type:'select',
          label:'发送人群',
          placeholder:'请选择发送人群',
          option:[{
            value:1,
            label:'所有会员'
          },{
            value:2,
            label:'普通会员'
          },{
            value:3,
            label:'钻石会员'
          },{
            value:4,
            label:'创业店主'
          },{
            value:5,
            label:'合伙人'
          }]
        },
        'wtype':{
          type:'select',
          label:'任务类型',
          placeholder:'请选择任务类型',
          option:[{
            value:1,
            label:'订单发货'
          },{
            value:2,
            label:'订单退款'
          },{
            value:3,
            label:'未付款订单提醒'
          },{
            value:4,
            label:'营销类活动'
          },{
            value:5,
            label:'定时任务'
          },{
            value:6,
            label:'生日祝福'
          },{
            value:7,
            label:'提现到账'
          },{
            value:8,
            label:'钻石奖励金到账'
          }]
        },
        'mt_id':{
          type:'select',
          label:'短信模板',
          placeholder:'请选择短信模板',
          val:'id',
          lab:'title',
          option:[]
        },
        'trigger_id':{
          type:'select',
          label:'触发器',
          placeholder:'请选择触发器',
          hdplay:false,
          val:'id',
          lab:'title',
          option:[]
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
      wtype:{
        1:'订单发货',
        2:'订单退款',
        3:'未付款订单提醒',
        4:'营销类活动',
        5:'定时任务',
        6:'生日祝福',
        7:'提现到账 ',
        8:'钻石奖励金到账'
      },
      type:{
        1:'所有会员',
        2:'普通会员',
        3:'钻石会员',
        4:'创业店主',
        5:'合伙人'
      },
      taskList:[],
      total:0
    }
  },
  components:{
      vPagination,
      vCard
  },
  mounted(){
    this.getMessageTask()
    this.MessageTemplate()
    this.Trigger()
  },
  methods: {
    auditMessageTask(id,status){
      let that =this;
      that.$request({
        data: {
          id:id,
          status:status
        },
        url: 'ModelMessage/auditMessageTask',
        form:3,
        success(res){
          that.getMessageTask()
        }
      })
    },
    getMessageTaskInfo(id){
      let that =this;
      that.$request({
        data: {
          id:id
        },
        url: 'ModelMessage/getMessageTask',
        success(res){
          that.ruleForm = res.messagetask || {}
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
      data.ruleForm.id ?this.editMessageTask(data.ruleForm):this.saveMessageTask(data.ruleForm)
    },
    saveMessageTask(data){
      let that =this;
      that.$request({
        data: data,
        url: 'ModelMessage/saveMessageTask',
        form:1,
        success(res){
          that.ruleForm = {}
          that.getMessageTask()
          that.cardStatus = false
        }
      })
    },
    editMessageTask(data){
      data.mt_id = data.mt_id ||data.messagetemplate.id;
      data.MessageTask_id = data.id;
      data.trigger_id = data.trigger_id || data.messagetrigger.id;
      let that =this;
      that.$request({
        data: data,
        url: 'ModelMessage/editMessageTask',
        form:3,
        success(res){
          that.ruleForm = {}
          that.getMessageTask()
          that.cardStatus = false
        }
      })
    },
    pageChange(obj){
        this.screen.page = obj.page
        this.getMessageTask()
    },
    MessageTemplate(){
      let that =this;
      that.$request({
        data: {all:1},
        url: 'ModelMessage/getMessageTemplate',
        success(res){
          that.ruleType['mt_id'].option = res.MessageTemplate
        }
      })
    },
    Trigger(){
      let that =this;
      that.$request({
        data: {all:1},
        url: 'ModelMessage/getTrigger',
        success(res){
          that.ruleType['trigger_id'].option = res.Trigger
        }
      })
    },
    getMessageTask(){
      let that =this;
      that.$request({
        data: that.screen,
        url: 'ModelMessage/getMessageTask',
        success(res){
          that.taskList = that.disTaskList(res.messagetask)
          that.total = res.total || 0;
        }
      })
    },
    disTaskList(data = []){
      for(let i=0,len=data.length;i<len;i++){
        data[i].wtypeText = this.wtype[data[i].wtype]
        data[i].typeText = this.type[data[i].type]
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
