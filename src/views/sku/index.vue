<template>
    <div class="sku-data">
       <div class="sku-search">
           <el-form :inline="true" :model="search" ref="searchForm" @submit.native.prevent>
               <el-form-item prop="menuName">
                   <span class="condition">SKU号 </span> <el-input v-model="search.skuCode" placeholder="SKU号" size="small" @keydown.enter.native="query"/>
                   <span class="condition">尺码 </span> <el-input v-model="search.sizeCode" placeholder="尺码" size="small" @keydown.enter.native="query"/>
                   <span class="condition">颜色 </span> <el-input v-model="search.colorCode" placeholder="颜色" size="small" @keydown.enter.native="query"/>
                   <div class="condition">工序</div>
                       <el-select v-model="search.dicType" class="option" filterable placeholder="工序">
                           <el-option
                                   v-for="item in options"
                                   :key="item.id"
                                   :label="item.name"
                                   :value="item.id">
                           </el-option>
                       </el-select>
               </el-form-item>
               <el-button type="primary" icon="el-icon-search" @click="query">检 索</el-button>
           </el-form>
       </div>
        <div id="sku-data" class="sku-data" style="width: 1200px;height:500px;"/>
    </div>
</template>

<script>
    import echarts from 'echarts'
    require('echarts/theme/macarons') // echarts theme
    import {getSKUList} from 'api/sku'

    export default {
        components: {},
        name:'sku',
        data() {
            return {
                search:{
                    skuCode:'',
                    sizeCode:'',
                    colorCode:'',
                    dicType:'Bagging',
                },
                sku:[],
                redQty:[],
                blueQty:[],
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
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.initChart('sku-data')
            })
        },
        methods: {
            query(){
                getSKUList(this.search).then(res => {
                    this.sku = []
                    this.redQty = []
                    this.blueQty = []
                    res.data.skuInfoData.forEach(item => {
                        this.sku.push(item.skuCode+ "\n"+item.colorCode+":"+item.color+" "+item.sizeCode+":"+item.size)
                        this.redQty.push(item.redQty)
                        this.blueQty.push(item.blueQty)
                    })
                    this.initChart('sku-data')
                })

            },
            initChart(id) {
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
                        data: ['完成量','未完成']
                    },
                    grid: {
                        height: '70%'
                    },
                    xAxis: {
                        data:  this.sku,
                        name:"SKU号",//坐标轴名称。
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
                            name: '未完成',
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
            }
        },
        created(){
            this.query()
        }
    }
</script>
<style lang="less" scoped>
    .sku-data{margin-top: 10px}
    .el-input{
        width: 150px;
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
