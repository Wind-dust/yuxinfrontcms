<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>会员管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员列表</el-breadcrumb-item>
      </el-breadcrumb>
  </div>

    <v-screen :screen="screenQuery" @query="onQuery" ></v-screen>

    <el-table :data="result" border style="width: 100%">
      <el-table-column prop="id" label="用户id"></el-table-column>
      <el-table-column  prop="avatar" label="用户头像" >
        <template slot-scope="scope">
  　　　　<img :src="scope.row.avatar" width="40" class="head_pic"/>
  　　  </template>
      </el-table-column>
      <el-table-column  prop="nick_name" label="用户昵称" ></el-table-column>
      <el-table-column  prop="user_identityText" label="用户身份" ></el-table-column>
      <el-table-column  prop="mobile" label="手机号" ></el-table-column>
      <el-table-column  prop="balance" label="商票余额" ></el-table-column>
      <el-table-column  prop="commission" label="佣金余额" ></el-table-column>
      <el-table-column  prop="integral" label="积分" ></el-table-column>
      <el-table-column  prop="create_time" label="注册时间" ></el-table-column>
      <el-table-column  prop="last_time" label="最后登录时间" ></el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :num='num' :total="total"></v-pagination>

  </div>
</template>

<script>
import {getIdentity} from '../../../assets/js/common'
import vScreen from '../../component/screen'
import vPagination from '../../component/pagination'
export default {
  data(){
    return {
      num:1,
      screen:{
        page:1,
        page_num:10
      },
      screenQuery:[{
        ref:'mobile',
        label:'手机号',
        type:'input',
        content:'',
        placeholder:'请输入用户手机号'
      }],
      result:[],
      total:0
    }
  },
  components:{
      vScreen,
      vPagination,
  },
  mounted(){
    this.getUsers()
  },
  methods: {
    onQuery(screen){
      this.extend(this.screen,screen);
      this.screen.page = 1;
      this.num++
      this.getUsers();
    },
    extend(target, options) {
        for (name in options) {
            target[name] = options[name];
        }
        return target;
    },
    pageChange(obj){
        this.screen.page = obj.page
        this.getUsers()
    },
    getUsers(){
      let that =this;
      that.$request({
        data: that.screen,
        url: 'User/getUsers',
        success(res){
          that.result = that.disResult(res.result)
          that.total = res.totle || 0;
        }
      })
    },
    disResult(data = []) {
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
</style>
