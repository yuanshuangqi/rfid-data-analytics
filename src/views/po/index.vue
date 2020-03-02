<template>
    <div class="po-data">
       <div class="po-search">
           <el-form :inline="true" :model="search" ref="searchForm" @submit.native.prevent>
               <el-form-item prop="menuName">
                   <span class="condition">PO单号 </span> <el-input v-model="search.orderNo" placeholder="PO单号" size="small" @keydown.enter.native="query"/>
                   <div class="condition">工序</div>
                       <el-select v-model="search.dicType" class="option" filterable placeholder="工序">
                           <el-option
                                   v-for="item in options"
                                   :key="item.id"
                                   :label="item.name"
                                   :value="item.id">
                           </el-option>
                       </el-select>
                   <div class="condition">ETD</div>
                   <div class="el-input">
                       <el-date-picker
                               v-model="search.dateFrom"
                               type="date"
                               placeholder="选择日期"
                               :picker-options="pickerOptions"
                               value-format="yyyy-MM-dd">
                       </el-date-picker>
                   </div>
                   <div class="condition">至</div>
                   <div class="el-input">
                       <el-date-picker
                               v-model="search.dateTo"
                               align="right"
                               type="date"
                               placeholder="选择日期"
                               :picker-options="pickerOptions"
                               value-format="yyyy-MM-dd">
                       </el-date-picker>
                   </div>
               </el-form-item>
               <el-button type="primary" icon="el-icon-search" @click="query">检 索</el-button>
           </el-form>
       </div>
        <div id="po-data" class="po-data" style="width: 1200px;height:500px;"/>
    </div>
</template>

<script>
    import echarts from 'echarts'
    require('echarts/theme/macarons') // echarts theme
    import {getPOList} from 'api/po'

    export default {
        components: {},
        name:'po',
        data() {
            return {
                flag:true,
                search:{
                    orderNo:'',
                    dicType:'MetalCheck',
                    dateFrom: new Date(),
                    dateTo: new Date(),
                },
                orderEtd:[],
                redQty:[],
                orangeQty:[],
                yellowQty:[],
                blueQty:[],
                lessETD1: '8',
                lessETD2: '16',
                // 指定图表的配置项和数据
                options: [
                    {
                        id: 'MetalCheck',
                        name:'检针'
                    },
                    {
                        id: 'Tagging',
                        name:'吊牌'
                    },
                    {
                        id: 'Bagging',
                        name:'包装'
                    }
                ],
                pickerOptions: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },

            }
        },
        mounted() {
            this.$nextTick(() => {
                this.initChart('po-data')
            })
        },
        methods: {

            query(){
                this.flag = true
                getPOList(this.search).then(res => {
                    this.orderEtd = []
                    this.redQty = []
                    this.orangeQty = []
                    this.yellowQty = []
                    this.blueQty = []
                    this.lessETD1 = res.data.lessETD1
                    this.lessETD2 = res.data.lessETD2
                    res.data.poInfoData.forEach(item => {
                        this.orderEtd.push(item.orderNo+ "\n"+item.etd)
                        this.redQty.push(item.redQty)
                        this.orangeQty.push(item.orangeQty)
                        this.yellowQty.push(item.yellowQty)
                        this.blueQty.push(item.blueQty)
                    })
                    this.initChart('po-data')
                })

            },
            initChart(id) {
                // var self = this
                this.chart = echarts.init(document.getElementById(id))
                // 使用刚指定的配置项和数据显示图表。

                this.chart.setOption({
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data: ['完成量', '未完成（ETD-'+this.lessETD2+'天）','未完成（ETD-'+this.lessETD1+'天）','未完成（ETD）']
                    },
                    grid: {
                        height: '70%'
                    },
                    xAxis: {
                        data:  this.orderEtd,
                        name:"PO单号"+ "\n"+"ETD",//坐标轴名称。
                        nameLocation:'end',//坐标轴名称显示位置。
                        axisLabel : {//坐标轴刻度标签的相关设置。
                            interval:0,
                            rotate:"45"
                        }
                    },
                    yAxis: {
                        name: '数量'
                    },
                    series: [{
                        name: '完成量',
                        type: 'bar',
                        stack: 'vistors',
                        barWidth: '60%',
                        data: this.blueQty,
                        itemStyle:{
                            normal: {
                                color: '#66CCFF'
                            }
                        }

                    },
                        {
                            name: '未完成（ETD-'+this.lessETD2+'天）',
                            type: 'bar',
                            stack: 'vistors',
                            barWidth: '60%',
                            data: this.yellowQty,
                            itemStyle:{
                                normal: {
                                    color: 'yellow'
                                }
                            }
                        },
                        {
                            name: '未完成（ETD-'+this.lessETD1+'天）',
                            type: 'bar',
                            stack: 'vistors',
                            barWidth: '60%',
                            data: this.orangeQty,
                            itemStyle:{
                                normal: {
                                    color: '#FF751B'
                                }
                            }
                        },
                        {
                            name: '未完成（ETD）',
                            type: 'bar',
                            stack: 'vistors',
                            barWidth: '60%',
                            data: this.redQty,
                            itemStyle:{
                                normal: {
                                    color: 'red'
                                }
                            }
                        }]
                })
                    // ,
                    //  this.chart.on('click', function (params) {
                    //      if(self.flag){
                    //          let poNo = params.name.substr(0, params.name.indexOf("\n"));
                    //          console.log(poNo)
                    //          self.$router.push('/order')
                    //      }
                    //      self.flag = false
                    //  })
            }
        },
        created(){
            this.query()
        }
    }
</script>

<style lang="less" scoped>
    .po-data{margin-top: 10px}
    .el-input{
        width: 140px;
        display: inline-block;
    }
    .option {
        width: 100px;
    }
    .condition{ cursor: pointer;
        display: inline-block;
        padding: 3px 6px;
        text-align: right;
        width: 50px;
        vertical-align: top;}
    .el-form-item{
        width: 80%;
    }
</style>
