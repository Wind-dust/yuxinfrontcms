<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>音频列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="add fr" type="primary" icon="el-icon-plus" @click="asyncaudios()">同步远程音频</el-button>
  </div>

    <!-- <v-screen :screen="screenQuery" @query="onQuery" ></v-screen> -->

    <el-table :data="audioList" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column  prop="name" label="音频名称" ></el-table-column>
      <el-table-column  prop="audio" label="音频" width="350" >
        <template slot-scope="scope">
          <video class="audio" :src="scope.row.audio" controls="controls">
              您的浏览器不支持 video 标签。
          </video>
        </template>
      </el-table-column>
      <el-table-column  prop="audition_time" label="试听时间" ></el-table-column>
      <el-table-column fixed="right" label="操作" >
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="showAuditionTime(scope.row.id,scope.row.audition_time)">编辑</el-button>
        </template> 
      </el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :num='num' :total="total"></v-pagination>

    <v-card name='修改试听时间' width="100" :cardStatus="cardStatus" :ruleType="ruleType" :ruleForm="ruleForm" :rules="rules" @sumbit="sumbit" @hideCard="hideCard"></v-card>
  </div>
</template>

<script>
import {getIdentity} from '../../../assets/js/common'
import vCard from '../../component/card'
import vPagination from '../../component/pagination'
export default {
  data(){
    return {
      num:1,
      screen:{
        page:1,
        page_num:10
      },
      cardStatus:false,
      ruleForm:{},
      rules:['audition_time'],
      ruleType:{
        'audition_time':{
          type:'input',
          label:'试听时间',
          placeholder:'请输入试听时间'
        }
      },
      screenQuery:[{
        ref:'mobile',
        label:'手机号',
        type:'input',
        content:'',
        placeholder:'请输入用户手机号'
      }],
      audioList:[],
      audioID:0,
      audition_time:0,
      total:0
    }
  },
  components:{
      vPagination,
      vCard
  },
  mounted(){
    this.getAudioslist()
  },
  methods: {
    onQuery(screen){
      this.extend(this.screen,screen);
      this.screen.page = 1;
      this.num++
      this.getAudioslist();
    },
    extend(target, options) {
        for (name in options) {
            target[name] = options[name];
        }
        return target;
    },
    pageChange(obj){
        this.screen.page = obj.page
        this.getAudioslist()
    },
    showAuditionTime(id,time){
      this.cardStatus = true
      this.ruleForm = {id:id,audition_time:time}
    },
    hideCard(){
      this.cardStatus = false
    },
    sumbit(data){
      if(data.ruleForm.audition_time <0){
        this.$message({message:'试听时间不能小于0',type:'error' });
        return
      }
      this.$request({
        data: data.ruleForm,
        url: 'audios/editaudio',
        form:3,
        success:()=>{
            this.cardStatus = false
           this.getAudioslist();
        }
      })
    },
    asyncaudios(){
      this.$request({
        url: 'audios/asyncaudios',
        success:()=>{
          this.screen.page = 1;
           this.getAudioslist();
        }
      })
    },
    getAudioslist(){
      let that =this;
      that.$request({
        data: that.screen,
        url: 'audios/audioslist',
        success(res){
          that.audioList = res.data
          that.total = res.total || 0;
        }
      })
    },
    disaudioList(data = []) {
        let arr = data,
            len = arr.length
        for (let i = 0; i < len; i++) {
            arr[i].user_identityText = getIdentity(arr[i].user_identity)
        }
        return arr
    }
  }
}
</script>

<style scoped>
.audio{
  width: 300px;
  height: 52px;
}
</style>
