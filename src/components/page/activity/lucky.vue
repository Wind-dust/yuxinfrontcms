<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>抽奖活动</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-table :data="winnerList" border style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column  prop="user.nick_name" label="中奖用户昵称	" ></el-table-column>
      <el-table-column  prop="user.mobile" label="中奖用户手机号" ></el-table-column>
      <el-table-column  prop="goods_name" label="商品名称" ></el-table-column>
      <el-table-column  prop="image_path" label="商品图片" >
        <template slot-scope="scope">
          <img :src="scope.row.image_path" width="40"  class="head_pic"/>
        </template>
      </el-table-column>
      <el-table-column  prop="shop_num" label="中奖商品编号"></el-table-column>
      <el-table-column  prop="create_time" label="中奖时间"></el-table-column>
      <el-table-column  prop="statusText" label="状态"></el-table-column>
    </el-table>
    <v-pagination @pageChange="pageChange" :total="total"></v-pagination>

  </div>
</template>

<script>
import vPagination from '../../component/pagination'
export default {
  data(){
    return {
      screen:{
        page:1,
        page_num:10
      },
      winnerList:[],
      total:0
    }
  },
  components:{
      vPagination
  },
  mounted(){
    this.getWinnerList()
  },
  methods: {
    pageChange(obj){
        this.screen.page = obj.page
        this.getWinnerList()
    },
    getWinnerList(){
      let that =this;
      that.$request({
        data: that.screen,
        url: 'OfflineActivities/getWinnerList',
        success(res){
          that.winnerList = that.disWinnerList(res.WinnerList)
          that.total = res.total || 0;
        }
      })
    },
    disWinnerList(data = []) {
        let len = data.length;
        if (len === 0) return
        for (let i = 0; i < len; i++) {
            data[i].statusText = (data[i].status == 1)?'未领取' : '已领取'
        }
        return data
    },
  }
}
</script>

<style scoped>
</style>
