<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>消息模板</el-breadcrumb-item>
        <el-breadcrumb-item>内容列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="showCard()">添加内容</el-button>
  </div>

    <el-table :data="conList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="100"></el-table-column>
      <el-table-column  prop="title" label="标题"  ></el-table-column>
      <el-table-column  prop="typeText" label="发送类型" width="100"></el-table-column>
      <el-table-column  prop="template" label="发送模板"></el-table-column>
      <el-table-column  prop="create_time" label="创建时间" ></el-table-column>
      <el-table-column  prop="statusText" label="状态" ></el-table-column>
      <el-table-column fixed="right" label="操作" width="350" >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="getMessageTemplaterInfo(scope.row.id)">编辑</el-button>
          <el-button type="primary" size="small" @click="auditMessageTemplate(scope.row.id,2)">启用</el-button>
          <el-button type="primary" size="small" @click="auditMessageTemplate(scope.row.id,3)">停用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :total="total"></v-pagination>

    
    <div class="cen-card" v-if="cardStatus">
      <el-card class="box-card" >
        <div slot="header" class="clearfix">
            <span>内容</span>
          </div>
        <el-form label-width="80px" :model="ruleForm" ref="ruleForm"  :rules="rules">
          <el-form-item prop="title" label="标题" >
            <el-input v-model="ruleForm.title" placeholder="请输入标题ID"></el-input>
          </el-form-item>
          <el-form-item prop="type" label="发送类型" >
            <el-select v-model="ruleForm.type" placeholder="请选择发送类型">
              <el-option v-for="item in typeOpt" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="文本类型" >
            <el-select @change="textChange"  v-model="ruleForm.tText" placeholder="请选择文本类型">
              <el-option v-for="v in templatetext" :key="v.key" :label="v.value" :value="v.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="template" label="内容模板" >
            <el-input rows="5" ref="redact"  @input="setmsgoutput" @blur="redactBlur($event)"  type="textarea" v-model="ruleForm.template" placeholder="请输入内容模板"></el-input>
          </el-form-item>
          <el-form-item label="内容模板输出样式" >
            <div class="template">{{ruleForm.msgoutput}}</div>
          </el-form-item>
          <el-form-item class="flex-cen">
            <el-button type="primary" @click="sumbit('ruleForm')">确定</el-button>
            <el-button  @click="hideCard()">取消</el-button>
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
      cardStatus:false,
      ruleForm:{},
      rules:{
        'title':[{  required:true, message:'标题不能为空',
          trigger:'blur'
        }],
        'type':[{ required:true, message:'请选择发送类型',
          trigger:'change'
        }],
        'template':[{ required:true, message:'请输入内容模板',
          trigger:'blur'
        }]
      },
      screen:{
        page:1,
        page_num:10
      },
      typeOpt:[{
        value:1,
        label:'短短信'
      },{
        value:2,
        label:'长短信'
      },{
        value:3,
        label:'彩信'
      }],
      mtTextJson:{},
      templatetext:[],
      type:{
        1:'短短信',
        2:'长短信',
        3:'彩信',
      },
      status:{
        1:'待启用',
        2:'启用',
        3:'停用',
      },
      offlineTitle:'',
      conList:[],
      total:0,
      sellocation:''
    }
  },
  components:{
      vPagination,
      vCard
  },
  mounted(){
    this.getMessageTemplate()
    this.getMessageTemplateText()
  },
  methods: {
    textChange(val){
      this.intMsg(val)
    },
    redactBlur(e) {
      this.sellocation = this.$refs.redact.$refs.textarea.selectionStart
    },
    intMsg(key) {
        let t1 = this.ruleForm.template.substring(0, this.sellocation)
        let t2 = this.ruleForm.template.substring(this.sellocation, this.ruleForm.template.length)
        this.ruleForm.template = t1 + key + t2
        this.setmsgoutput()
    },
    setmsgoutput() {
      let that = this
      that.ruleForm.msgoutput= that.ruleForm.template.replace(/\{{2}\[.*?\]\}{2}/g, function(t, s) {
          return '<' + that.mtTextJson[t] + '>'
      })
    },
    auditMessageTemplate(id,status){
      let that =this;
      that.$request({
        data: {
          id:id,
          status:status
        },
        url: 'ModelMessage/auditMessageTemplate',
        form:3,
        success(res){
          that.getMessageTemplate()
        }
      })
    },
    getMessageTemplaterInfo(id){
      let that =this;
      that.$request({
        data: {
          id:id
        },
        url: 'ModelMessage/getMessageTemplate',
        success(res){
          that.ruleForm = res.Trigger || {};
          that.setmsgoutput()
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
    sumbit(name){
      let that= this;
      that.$refs[name].validate((valid) => {
        if (valid) {
          that.ruleForm.id ?that.editMessageTemplate(that.ruleForm):that.saveMessageTemplate(that.ruleForm)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      
    },
    saveMessageTemplate(data){
      let that =this;
      that.$request({
        data: data,
        url: 'ModelMessage/saveMessageTemplate',
        form:1,
        success(res){
          that.ruleForm = {}
          that.getMessageTemplate()
          that.cardStatus = false
        }
      })
    },
    editMessageTemplate(data){
      let that =this;
      that.$request({
        data: data,
        url: 'ModelMessage/editMessageTemplate',
        form:3,
        success(res){
          that.ruleForm = {}
          that.getMessageTemplate()
          that.cardStatus = false
        }
      })
    },
    pageChange(obj){
        this.screen.page = obj.page
        this.getMessageTemplate()
    },
    getMessageTemplateText(){
      let that =this;
      that.$request({
        url: 'ModelMessage/getMessageTemplateText',
        success(res){
          that.templatetext = res.templatetext
          that.distemplatetext(res.templatetext)
        }
      })
    },
    distemplatetext(data = []) {
        let len = data.length
        for (let i = 0; i < len; i++) {
            this.mtTextJson[data[i].key] = data[i].value
        }
    },
    getMessageTemplate(){
      let that =this;
      that.$request({
        data: that.screen,
        url: 'ModelMessage/getMessageTemplate',
        success(res){
          that.conList = that.disMessageTemplate(res.MessageTemplate)
          that.total = res.total || 0;
        }
      })
    },
    disMessageTemplate(data = []){
      for(let i=0,len=data.length;i<len;i++){
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
.template{
  width: calc(100% - 12px);
  min-height: 100px;
  padding: 7px 6px;
  border: 1px solid #d9d9d9;
}
.templateInp textarea{
  min-height: 100px;
}
</style>
