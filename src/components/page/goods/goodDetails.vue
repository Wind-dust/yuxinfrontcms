<template>
  <div class="tcontent">
    <div class="table-header clearfix">
      <el-breadcrumb class="breadcrumb"  separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/goodsList' }">商品列表</el-breadcrumb-item>
        <el-breadcrumb-item>商品详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  <div class="tabs">
    <template>
      <el-tabs class="eltabs" value="first" type="card" >
        <el-tab-pane label="基本信息" name="first">
            <div class="box-card" >
              <el-form label-width="110px" :model="goods_data" ref="goods_data"  label-position="right" :rules="rules">
                <el-form-item label="商品名称" prop="goods_name" >
                  <el-input v-model="goods_data.goods_name"    placeholder="请输入商品名称"></el-input>
                </el-form-item>
                <el-form-item label="商品标题" prop="subtitle" >
                  <el-input v-model="goods_data.subtitle" type="textarea"    placeholder="请输入商品标题"></el-input>
                </el-form-item>
                <el-form-item label="供应商" prop="supplier_name" >
                  <p class="chart" >{{goods_data.supplier_name}}</p>
                </el-form-item>
                <el-form-item label="三级分类" prop="goods_class" >
                  <p class="chart" >{{goods_data.goods_class}}</p>
                </el-form-item>
                <el-form-item label="商品类型" prop="goods_class" >
                  <p class="chart" >{{goods_data.goods_type==1?'普通商品':'虚拟商品'}}</p>
                </el-form-item>
                <el-form-item label="使用人群" prop="goods_class" >
                  <el-select  v-model="goods_data.target_users" placeholder="使用人群">
                    <el-option v-for="item in target_users_list" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="表格模板" prop="goods_class" >
                  <el-select  v-model="goods_data.goods_sheet" placeholder="请选择表格模板">
                    <el-option v-for="item in tabbleList" :key="item.id" :label="item.name" :value="item.id">
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品赠送权益" prop="giving_rights" >
                  <el-select  v-model="goods_data.giving_rights" placeholder="商品赠送权益">
                    <el-option v-for="item in giving_rights_list" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="产品标题图" prop="image" >
                  <v-upload @upresult='upresult' num='image' :image="goods_data.image"></v-upload>
                </el-form-item>
                <el-form-item label="商品分享标题图" prop="share_image" >
                  <v-upload @upresult='shareUpresult' num='share_image' :image="goods_data.share_image"></v-upload>
                </el-form-item>
                <el-form-item class="flex-cen">
                  <el-button  type="primary" @click="gSumbit('goods_data')">确定</el-button>
                  <el-button  @click="reduction()">取消</el-button>
                </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="专题" name="second">
          <el-button class="primary" type="primary" icon="el-icon-plus" @click="getgoodssubject(2)">关联专题</el-button>
          <el-table :data="goodssubject" class="table" border>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column  prop="subject_tier1" label="一级专题" >
            </el-table-column>
            <el-table-column  prop="subject_tier2" label="二级专题" ></el-table-column>
            <el-table-column  prop="subject" label="三级专题" ></el-table-column>
            <el-table-column  prop="goods_num" label="操作" >
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="delgoodssubjectassoc(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="商品轮播图" name="third">
          <div class="banner">
            <span class="imageTit">商品轮播图:</span>
              <v-upload @upresult='banner' @delImg="delImg" num='images_carousel' name='image_path' :multiple="true" @orderby="orderby" :image="images_carousel"></v-upload>
          </div>
        </el-tab-pane>
        <el-tab-pane v-if="goods_type == 1" label="商品规格" name="fourth">
          <el-button class="primary" type="primary" icon="el-icon-plus" @click="showspCardStatus()">添加规格</el-button>

          <el-table :data="spec_attr"  class="table" border>
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column  prop="spec_name" label="规格" >
            </el-table-column>
            <el-table-column  prop="attr_name" label="属性" ></el-table-column>
            <el-table-column  prop="goods_num" label="操作" >
              <template slot-scope="scope" v-if="goods_type == 1">
                <el-button type="primary" size="small" @click="delgoodsspec(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-table :data="sku" class="table" border>
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column  prop="attr" label="规格名称" >
            </el-table-column>
            <el-table-column  prop="sku_image" label="规格图" >
              <template slot-scope="scope">
                <img :src="scope.row.sku_image" width="40"  class="head_pic"/>
              </template>
            </el-table-column>
            <el-table-column  prop="stock" label="库存" ></el-table-column>
            <el-table-column  prop="market_price" label="市场价" ></el-table-column>
            <el-table-column  prop="retail_price" label="零售价" ></el-table-column>
            <el-table-column  prop="cost_price" label="成本价" ></el-table-column>
            <el-table-column  prop="margin_price" label="其他运费成本" ></el-table-column>
            <el-table-column  prop="weight" label="重量(单位kg)" ></el-table-column>
            <el-table-column  prop="volume" label="体积(单位m³)" ></el-table-column>
            <el-table-column  prop="freight_title" label="运费" ></el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="getgoodssku(scope.row.id)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane v-else label="音频商品规格" name="audiofourth">
          <el-button class="primary" type="primary" icon="el-icon-plus" @click="showAudioCardStatus()">添加音频sku</el-button>
          <el-table :data="sku" class="table" border>
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="name" label="sku名称"></el-table-column>
            <el-table-column prop="audioName" label="音频"></el-table-column>
            <el-table-column  prop="market_price" label="市场价" ></el-table-column>
            <el-table-column  prop="retail_price" label="零售价" ></el-table-column>
            <el-table-column  prop="cost_price" label="成本价" ></el-table-column>
            <el-table-column  prop="end_time" label="结束时间(按小时记)" ></el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="getGoodsAudioSku(scope.row.id)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="商品详情图" name="five">
          <div class="">
            <el-button class="primary" type="primary" icon="el-icon-plus" @click="addImg()">添加图片</el-button>
            <input class="hide" id="imgDetatil" type="file" accept="image/*" @change="imgDetatilChange" multiple="multiple">
            <el-button class="primary fr preview" type="primary" icon="el-icon-view" @click="showimageLook()"></el-button>

            <div id="imagesDetatil" class="table">
                <div class="pl-li table-cell" v-for="(v,k) in images_detatil" :class="v.row?'trpl':''" :key="k">
                    <img class="pl-image" :src="v.image_path" alt="">
                    <div class="hierarchy" v-if="!v.row">{{v.order_by}}</div>
                    <div class="pl-manage" v-if="!v.row">
                        <el-button class="primary" type="primary"  @click="delImgDetatil(v.image_path,5)" size="small">删除</el-button>
                        <el-button class="primary order_by" type="primary"  @click="showSort(v.image_path,v.order_by)" size="small">排序</el-button>
                    </div>
                </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="标签" name="six">
          <div class="tags">
            <el-tag :key="k" v-for="(v,k) in labellist" closable :disable-transitions="false" @close="handleClose(v.label_id,k)">{{v.label_name}} </el-tag>
            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue"
            ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="hideInput"
            > </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 标签</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </template>
  </div>
    <v-card name='关联专题' width="100" :cardStatus="sCardStatus" :ruleType="sRuleType" :ruleForm="sRuleForm" :rules="sRules" @sumbit="sSumbit" @hideCard="sHideCard"></v-card>

    <v-card name='添加属性规格' :cardStatus="spCardStatus" :ruleType="spRuleType" :ruleForm="spRuleForm" :rules="spRules" @sumbit="spSumbit" @hideCard="spHideCard"></v-card>

    <v-card name='编辑sku' width="100" :cardStatus="skuCardStatus" :ruleType="skuRuleType" :ruleForm="skuRuleForm" :rules="skuRules" @sumbit="skuSumbit" @hideCard="skuHideCard"></v-card>

    <v-card name='排序' :cardStatus="imgCardStatus" :ruleType="imgRuleType" :ruleForm="imgRuleForm" :rules="imgRules" @sumbit="imgSumbit" @hideCard="imgHideCard"></v-card>

    <v-card name='音频sku' :cardStatus="audioCardStatus" :ruleType="audioRuleType" :ruleForm="audioRuleForm" :rules="audioRules" @sumbit="audioSumbit" @hideCard="audioHideCard"></v-card>

    <div class="cen-card" v-if="imageLook" >
      <el-card class="box-card preview-box" >
        <div slot="header" class="clearfix">
            <span>预览</span>
          </div>
        <el-form label-width="0px" >
          <el-form-item  >
            <div class="infoList">
              <img v-for="(v,k) in images_detatil" :key="k" :src="v.image_path" alt="">
            </div>
          </el-form-item>
          <el-form-item class="flex-cen">
            <el-button  @click="hideImageLook()">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import vUpload from '../../component/upload';
import vCard from '../../component/card'
import {imageDeal} from '../../../assets/js/common';
export default {
  data(){
    return {
      labellist: [],
      inputVisible: false,
      inputValue: '',
      skuCardStatus:false,
      skuRuleForm:{},
      skuRules:[],
      skuRuleType:{
        'attr':{
          type:'p',
          label:'规格属性',
        },
        'stock':{
          type:'number',
          label:'库存',
          placeholder:'请输入库存',
        },
        'market_price':{
          type:'number',
          label:'市场价',
          placeholder:'请输入市场价',
        },
        'retail_price':{
          type:'number',
          label:'零售价',
          placeholder:'请输入零售价',
        },
        'cost_price':{
          type:'number',
          label:'成本价',
          placeholder:'请输入成本价',
        },
        'margin_price':{
          type:'number',
          label:'其他运费成本',
          placeholder:'请输入其他运费成本',
        },
        'integral_price':{
          type:'number',
          label:'积分售价',
          placeholder:'请输入积分售价',
        },
        'freight_id':{
          type:'select',
          label:'运费',
          placeholder:'请选择运费',
          val:'id',
          lab:'title',
          option:[]
        },
        'weight':{
          type:'number',
          label:'重量(单位kg)',
          placeholder:'请输入重量(单位kg)',
        },
        'volume':{
          type:'number',
          label:'体积(单位m³)',
          placeholder:'请输入体积(单位m³)',
        },
        'sku_image':{
          type:'image',
          label:'规格详情图',
        }
      },
      audioCardStatus:false,
      audioRuleForm:{},
      audioRules:[],
      audioRuleType:{
        'name':{
          type:'input',
          label:'sku名称',
          placeholder:'请输入sku名称',
        },
        'audio_id_list':{
          type:'select',
          label:'音频列表',
          multiple:true,
          filterable:true,
          placeholder:'请选择音频',
          val:'id',
          lab:"name",
          option:[]
        },
        'market_price':{
          type:'number',
          label:'市场价',
          placeholder:'请输入市场价',
        },
        'retail_price':{
          type:'number',
          label:'零售价',
          placeholder:'请输入零售价',
        },
        'cost_price':{
          type:'number',
          label:'成本价',
          placeholder:'请输入成本价',
        },
        'integral_price':{
          type:'number',
          label:'积分售价',
          placeholder:'请输入积分售价',
        },
        'end_time':{
          type:'number',
          label:'结束时间(按小时记)',
          placeholder:'请输入结束时间(按小时记)',
        }
      },
      imgCardStatus:false,
      imgRuleForm:{},
      imgRules:['order_by'],
      imgRuleType:{
        'order_by':{
          type:'number',
          label:'排序',
          placeholder:'请选择排序'
        }
      },
      spCardStatus:false,
      spRuleForm:{},
      spRules:[],
      spRuleType:{
        'attr_id':{
          type:'cascader',
          label:'规格属性',
          placeholder:'请选择规格属性',
          props:{
            value:'id',
            label:'attr_name',
            children:'attr',
            emitPath:false
          },
          option:[]
        }
      },
      sCardStatus:false,
      sRuleForm:{},
      sRules:['subject_id'],
      sRuleType:{
        'subject_id':{
          type:'cascader',
          label:'专题',
          placeholder:'请选择专题',
          props:{
            value:'id',
            label:'subject',
            children:'_child',
            emitPath:false
          },
          option:[]
        }
      },
      good_id:'',
      goods_data:{},
      goods_data_copy:{},
      rules:{
        goods_name:[{
          required:true,
          message:'商品名称不能为空',
          trigger:'blur'
        }]
      },
      images_carousel:[],
      images_detatil:[],
      sku:[],
      spec_attr:[],
      goodssubject:[],
      hasGoodssubject:[],
      labellist:[],
      target_users_list:[{
        value:1,
        label:'全部'
      },{
        value:2,
        label:'钻石及以上'
      },{
        value:3,
        label:'创业店主及以上'
      },{
        value:4,
        label:'合伙人及以上'
      }],
      tabbleList:[],
      giving_rights_list:[{
        value:1,
        label:'不赠送'
      },{
        value:2,
        label:'钻石'
      }],
      getAttr:false,
      getFreights:false,
      imageLook:false,
      image_path:'',
      goods_type:1
    }
  },
  components:{
      vUpload,
      vCard
  },
  mounted(){
    this.good_id = this.$route.query.id;
    this.goods_type = this.$route.query.goods_type;
    this.getOneGoods();
    this.goodslabellist();
    this.getgoodssubject(1);
    this.getAudioslist();
    this.getSheet()
  },
  methods: {
    getSheet(){
      let that =this;
      that.$request({
        data:{pageNum:1000},
        url: 'goods/getSheet',
        success(res){
          res.sheetlist.unshift({id:'', name:'不选择'})
          that.tabbleList = res.sheetlist || []
        }
      })
    },
    showimageLook(){
      this.imageLook = true
      console.log(22222)
    },
    hideImageLook(){
      this.imageLook = false
    },
    showSort(path,num){
      this.imgRuleForm = {
        order_by:num,
        image_path:path
      }
      this.imgCardStatus = true
    },
    imgSumbit(data){
      let that =this
      that.$request({
        data: data.ruleForm,
        form:3,
        url: 'goods/sortimagedetail',
        success(res){
          that.getOneGoods(3)
          that.imgCardStatus = false
        }
      })
    },
    imgHideCard(){
      this.imgCardStatus = false
    },
    addImg(){
       document.querySelector('#imgDetatil').click()
    },
    imgDetatilChange(e){
      let files = e.target.files || e.dataTransfer.files,that =this;
      let formdata = new FormData();
      let x = 0,len = files.length;
      for (let i = 0; i < len; i++) {
          imageDeal(files[i], function(file) {
              x++
              formdata.append('images[]', file)
          })
      }
      let interval = setInterval(function() {
          if (len === x) {
              clearInterval(interval)
              that.uploadmultifile(formdata)
          }
      }, 100)
    },
    uploadmultifile(formdata){
      let that = this;
      that.$request({
        data: formdata,
        url: 'upload/uploadmultifile',
        success(res){
          that.uploadgoodsimages(res.data)
        },
        complete(res){
            document.querySelector('#imgDetatil').value = ''
        }
      })
    },
    uploadgoodsimages(images){
      let that =this
      let formData = new FormData();
      formData.append('image_type', 1)
      formData.append('goods_id', that.good_id)
      for (let i = 0,len=images.length; i < len; i++) {
          formData.append('images[]', images[i])
      }
      that.$request({
        data: formData,
        form:1,
        url: 'goods/uploadgoodsimages',
        success(res){
          that.getOneGoods(3)
        }
      })
    },
    handleClose(id,k) {
      let that =this
      that.$request({
        data: {
          goods_id:that.good_id,
          label_id:id
        },
        form:2,
        url: 'label/labeldel',
        success(res){
          that.labellist.splice(k, 1);
        }
      })
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    hideInput(){
      if(this.inputValue) return
      this.inputVisible = false;
    },
    handleInputConfirm() {
      if(!this.inputValue) return
      let that =this
      that.$request({
        data: {
          goods_id:that.good_id,
          label_name:that.inputValue
        },
        form:1,
        url: 'label/addlabeltogoods',
        success(res){
          that.inputValue = '';
          that.goodslabellist();
        }
      })
    },
    delImgDetatil(img){
      this.delImg({path:img})
    },
    delImg(data){
      let that =this
      that.$request({
        data: {
          image_path:data.path
        },
        form:2,
        url: 'goods/delgoodsimage',
        success(res){
          that.getOneGoods(3)
        },
      })
    },
    orderby(param){
      let that =this
      that.$request({
        data: {
          image_path:param.path,
          order_by:param.order_by
        },
        form:3,
        url: 'goods/sortimagedetail',
        success(res){
          that.getOneGoods(3)
        },
      })
    },
    delgoodsspec(id){
      let that =this
      that.$request({
        data: {
          goods_id:that.good_id,
          attr_id:id
        },
        form:2,
        url: 'goods/delgoodsspec',
        success(res){
          that.getOneGoods(2)
        }
      })
    },
    showspCardStatus(){
      this.spCardStatus = true
    },
    showAudioCardStatus(){
      this.audioCardStatus = true
    },
    audioHideCard(){
        this.audioCardStatus = false
    },
    sHideCard(){
        this.sCardStatus = false
    },
    spHideCard(){
        this.spCardStatus = false
    },
    skuHideCard(){
        this.skuCardStatus = false
    },
    upresult(data){
        this.goods_data.image = data.image_path
    },
    shareUpresult(data){
      this.goods_data.share_image = data.image_path
    },
    banner(data){
      let formdata = new FormData();
      formdata.append('image_type', '2');
      formdata.append('goods_id', this.good_id);
      for(let i=0,len=data.image_path.length;i<len;i++){
        formdata.append('images[]', data.image_path[i]);
      }
      let that =this
      that.$request({
        data: formdata,
        form:1,
        url: 'goods/uploadgoodsimages',
        success(res){
          that.getOneGoods(3)
        }
      })
    },
    gSumbit(name){
      let that= this;
      that.$refs[name].validate((valid) => {
        if (valid) {
          that.saveupdategoods()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    saveupdategoods(){
      let that =this,data = JSON.parse(JSON.stringify(that.goods_data));
      that.goods_data_copy.image === data.image?
        data.image = '':'';
      that.goods_data_copy.share_image === data.share_image?
        data.share_image = '':'';
      data.goods_id = data.id;
      data.sheet_id = data.goods_sheet
      that.$request({
        data: data,
        form:3,
        url: 'goods/saveupdategoods',
        success(res){
          that.getOneGoods(1)
        }
      })
    },
    reduction(){
      this.goods_data = JSON.parse(JSON.stringify(this.goods_data_copy))
    },
    spSumbit(data){
      let that =this
      that.$request({
        data: {
          goods_id:that.good_id,
          attr_id:data.ruleForm.attr_id
        },
        form:1,
        url: 'goods/addgoodsspec',
        success(res){
          that.spCardStatus = false
          that.getOneGoods()
        }
      })
    },
    sSumbit(data){
      let that =this
      that.$request({
        data: {
          goods_id:that.good_id,
          subject_id:data.ruleForm.subject_id
        },
        form:1,
        url: 'subject/subjectgoodsassoc',
        success(res){
          that.sCardStatus = false
          that.getgoodssubject(1)
        }
      })
    },
    skuSumbit(data){
      let that =this
      console.log(data)
      data.ruleForm.sku_id = data.ruleForm.id
      that.$request({
        data: data.ruleForm,
        form:3,
        url: 'goods/editgoodssku',
        success(res){
          that.skuCardStatus = false
          that.getOneGoods(4)
        }
      })
    },

    audioSumbit(data){
      let ruleForm = data.ruleForm
      if(parseInt(ruleForm.market_price) < 0){
        this.$message({message:'市场价必须大于或等于0',type:'error'})
        return
      }
      if(parseInt(ruleForm.retail_price) < 0){
        this.$message({message:'零售价必须大于或等于0',type:'error'})
        return
      }
      if(parseInt(ruleForm.cost_price) < 0){
        this.$message({message:'成本价必须大于或等于0',type:'error'})
        return
      }
      if(parseInt(ruleForm.integral_price) < 0){
        this.$message({message:'积分售价必须大于或等于0',type:'error'})
        return
      }
      if(parseInt(ruleForm.end_time) < 0){
        this.$message({message:'结束时间必须大于或等于0',type:'error'})
        return
      }
      ruleForm.audio_id_list = ruleForm.audio_id_list.join(',')
      ruleForm.id?this.saveAudioSku(ruleForm): this.addaudiosku(ruleForm)
    },
    addaudiosku(ruleForm){
      let that =this
      ruleForm.goods_id = this.good_id
      that.$request({
        data: ruleForm,
        form:1,
        url: 'goods/addaudiosku',
        success(res){
          that.audioRuleForm = {}
          that.audioCardStatus = false
          that.getOneGoods(4)
        }
      })
    },
    saveAudioSku(ruleForm){
      let that =this
      ruleForm.sku_id = ruleForm.id
      that.$request({
        data: ruleForm,
        form:3,
        url: 'goods/saveAudioSku',
        success(res){
          that.audioRuleForm = {}
          that.audioCardStatus = false
          that.getOneGoods(4)
        }
      })
    },
    getSupplierFreights(){
      let that =this
      that.$request({
        data: {
          supplierId:that.goods_data.supplier_id
        },
        url: 'suppliers/getSupplierFreights',
        success(res){
          that.getFreights = true
          that.skuRuleType['freight_id'].option = res.data
        }
      })
    },
    getgoodssku(id){
      let that =this
      that.$request({
        data: {
          sku_id:id,
        },
        url: 'goods/getgoodssku',
        success(res){
          that.skuRuleForm = res.data
          that.skuCardStatus = true
        }
      })
    },
    getGoodsAudioSku(id){
      let that =this
      that.$request({
        data: {
          goods_id:this.good_id,
          sku_id:id
        },
        url: 'goods/getGoodsAudioSku',
        success(res){
          let audio_id_list = [],list = res.sku && res.sku.audioIdList;
          for(let i=0,len=list.length;i<len;i++){
            audio_id_list.push(list[i].audio_pri_id)
          }
          that.audioRuleForm = res.sku;
          that.audioRuleForm.audio_id_list = audio_id_list;
          that.audioCardStatus = true;
        }
      })
    },
    getspecattr(){
      let that =this
      that.$request({
        data: {
          cate_id:that.goods_data.cate_id,
        },
        url: 'spec/getspecattr',
        success(res){
          that.spRuleType['attr_id'].option = that.disspe_list(res.data)
          that.getAttr = true
        }
      })
    },
    disspe_list(data = []){
      for(let i = 0,len=data.length;i<len;i++){
        data[i].attr_name = data[i].spe_name
      }
      return data
    },
    getgoodssubject(type){
      let that =this
      that.$request({
        data: {
          goods_id:that.good_id,
          stype:type
        },
        url: 'subject/getgoodssubject',
        success(res){
          type == 1 ? (that.goodssubject = res.data):(
            (that.sRuleType['subject_id'].option = res.data) &&
            (that.sCardStatus = true)
          )
        }
      })
    },
    delgoodssubjectassoc(id){
      let that =this
      that.$request({
        data: {
          goods_id:that.good_id,
          subject_id:id
        },
        form:2,
        url: 'subject/delgoodssubjectassoc',
        success(res){
          that.getgoodssubject(1)
        }
      })
    },
    getAudioslist(){
      let that =this
      that.$request({
        data: {
          page:1,
          page_num:1000
        },
        url: 'audios/audioslist',
        success(res){
          that.audioRuleType['audio_id_list'].option = res.data || []
        }
      })
    },
    goodslabellist(){
      let that =this
      that.$request({
        data: {
          goods_id:that.good_id
        },
        url: 'label/goodslabellist',
        success(res){
          that.labellist = res.data || []
        }
      })
    },
    getOneGoods(type = ''){
      let that =this
      that.$request({
        data: {
          id:that.good_id,
          get_type:type,
          goods_type:this.goods_type
        },
        url: 'goods/getOneGoods',
        success(res){
          if(type == 1  || type ==''){
            that.goods_data = res.goods_data
            let goods_sheet = that.goods_data.goods_sheet;
            that.goods_data.goods_sheet = goods_sheet ? goods_sheet : ''
            that.goods_data_copy = JSON.parse(JSON.stringify(res.goods_data))
            !that.getAttr && that.getspecattr()
            !that.getFreights && that.getSupplierFreights()
          }
          if(type == 2  || type ==''){
            that.spec_attr = res.spec_attr
          }
          if(type == 3 || type ==''){
            that.images_carousel = res.images_carousel;
            that.images_detatil = that.disimages_detatil(res.images_detatil)
          }
          if(type == 4  || type ==''){
            let sku = res.sku;
            if(that.goods_type == 2){
              for(let i=0,len=sku.length;i<len;i++){
                let audios = sku[i].audios,nameArr = [];
                for(let x=0,len1=audios.length;x<len1;x++){
                  nameArr.push(audios[x].name)
                }
                sku[i].audioName = nameArr.join(', ')
              }
              that.sku = sku
            } else{
              that.sku = sku
            }
          }
        }
      })
    },
    disimages_detatil(data = []) {
        let len = data.length,
            arr = [];
        if(len === 0) return
        for (let i = 0; i < len; i++) {
            if (i % 5 === 0 && i != 0) {
                arr.push({
                    row: true
                })
            }
            arr.push(data[i])
        }
        return arr
    }
  }
}
</script>

<style scoped>
.tabs{
  background-color: #fff;
}
.eltabs{
  min-height: 700px;
}
.box-card{
  margin-top: 20px;
  width: 500px;
  margin-left: 20px;;
}
.table{
  width: 95%;
  margin: 20px auto;
}
.primary{
  margin-left: 30px;
}
.chart{
  display: inline-block;
  width: 98%;
  height: 40px;
  line-height: 40px;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  background-color: #FFF;
  font-size: 14px;
  text-indent: 10px;
}
.banner{
  margin-top: 20px;
}
.imageTit{
  float: left;
  margin-left: 20px;
  font-size: 18px;
  line-height: 62px;
}

.el-icon-plus {
  float: left;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.el-icon-plus:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
}
.tags{
  padding: 20px;
}
.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 100px;
  margin-left: 10px;
  vertical-align: bottom;
}
.table{
  border-collapse: separate;
  border-spacing: 10px;
}
.table-cell {
    display: table-cell !important;
}
.pl-li {
    position: relative;
    width: 20%;
    min-width: 100px;
    max-width: 300px;
    height: auto;
    padding: 10px;
    margin-right: 10px;
    border: 1px solid #e9e9e9;
    overflow: auto;
}
.hierarchy {
    position: absolute;
    top: 10px;
    left: 0;
    width: 100%;
    height: 20px;
    text-align: center;
    color: #3bb4f2;
    font-weight: bold;
    font-size: 18px;
}
.pl-image {
    width: 100%;
    min-height: 50px;
}
.trpl .pl-image{
  display: none;
}
.pl-manage {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    opacity: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .3);
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.pl-li:hover .pl-manage {
    opacity: 1;
}
.order_by{
  margin-top: 10px;
}
.trpl {
    display: table-row!important;
    height: 1px;
    overflow: hidden;
    padding: 0;
}
.preview{
  cursor: pointer;
  margin-right: 50px;
}
.infoList{
  width: 100%;
  max-height: 700px;
  overflow: auto;
}
.infoList img{
  display: inline-block;
  float: left;
  width: 100%;
}
.infoList::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
}
.preview-box{
  width:700px;
}

.el-icon-plus {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
}
.el-icon-plus:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
}
.avatar {
  width: auto;
  min-width: 60px;
  height: 60px;
  display: block;
  cursor: pointer;
}
.imgli{
  position: relative;
  display: inline-block;
  padding: 0 10px;
  float: left;
}
.imgDel{
  position: absolute;
  top: 0;
  right: 10px;
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  margin-right: 0;
  cursor: pointer;
  color: #000;
  font-weight: bold;
}
.add{
  margin-bottom: 20px;
}
</style>
