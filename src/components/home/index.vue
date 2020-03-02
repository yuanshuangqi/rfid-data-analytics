<template>
    <el-container class="home_container">
       <!--左侧导航栏-->
        <el-aside width="auto" style="overflow: hidden">
            <el-menu class="el-menu-vertical-demo" :default-active="activeMenu"  background-color="#304156" active-text-color="#409EFF" text-color="#fff" :router="true" :collapse="isCollapse" :collapse-transition="false" @select="menuSelect">
                <div class="title" v-show="!isCollapse"><img class="logo" src="../../assets/logo.png"/>RFID 数据云平台</div>
                <submenu-recursive :isCollapse="isCollapse" :menus="treeMenus"/>
            </el-menu>
        </el-aside>
        <el-container>
            <!--头部区域-->
            <el-header class="header_container" height="60px">
                <!--收缩左侧菜单-->
                <div class="collapseMenu" @click="collapseMenuHandler">
                    <i class="el-icon-s-fold collapseMenu_icon" ></i>
                </div>
                <div class="header_breadcrumb">
                    <!--面包屑-->
                    <!--<el-breadcrumb separator-class="el-icon-arrow-right">-->
                        <!--<template v-for="item in breadcrumbList">-->
                            <!--<el-breadcrumb-item style="font-size: 20px" :key="item.url">{{item.menuName}}</el-breadcrumb-item>-->
                        <!--</template>-->
                    <!--</el-breadcrumb>-->
                    <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab" @tab-click="tabSelect">
                        <el-tab-pane
                                v-for="item in editableTabs"
                                :key="item.name"
                                :label="item.title"
                                :name="item.name">
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <!--右侧个人菜单-->
                <div class="header_dropdown">
                    <el-dropdown>
                        <span class="el-dropdown-link">
                           {{$store.state.userInfo.username}}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-button  @click="showCgpwdDialog"> 修改密码</el-button>
                            <el-button @click.native="logout">退出</el-button>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>
            <!--主题区域-->
            <el-main>
                <keep-alive :include = keepalive>
                    <router-view/>
                </keep-alive>
            </el-main>
        </el-container>
        <CgPwd ref="cgpwdDialog" ></CgPwd>
    </el-container>

</template>

<script>
    import {LOGOUT} from "store/mutations-type";
    import { mapGetters } from 'vuex'
    import submenuRecursive from './submenuRecursive'
    import {getUserInfo} from 'api/login'
    import CgPwd  from './update'

    export default {
        name: "index",

        data() {
            return {
                isCollapse: false,
                breadcrumbList:[],
                activeMenu:'',

                editableTabsValue: '2',
                editableTabs: [],
                btnOperation: {
                    addDialogVisible: false,
                },
                keepalive:[]
            }
        },
        components:{
            submenuRecursive,
            CgPwd
        },
        computed: {
            ...mapGetters([
                'treeMenus'
            ])
        },
        methods: {
            collapseMenuHandler() {
                this.isCollapse = !this.isCollapse
            },
            // 菜单激活回调
            menuSelect(index,indexPath){
               // 通过indexPath获取菜单的路径
                let menus = this.$store.state.userInfo.allMenus
                let arr = indexPath.map(value => {
                    return menus.find(obj =>obj.url === value)

                })
                this.breadcrumbList = arr
                this.addTab(this.breadcrumbList[1].menuName,index)
            },
            // 用户退出,清空前台token
            logout(){
                this.$store.commit(LOGOUT)
            },
            showCgpwdDialog() {
                this.$refs.cgpwdDialog.setCgpwdVisible(true)
            },
            addTab(menuName,index) {
                let indexName = index.substr(1,index.length-1);
                console.log("addbefor:"+this.keepalive)
                this.keepalive.push(indexName)
                console.log("addafter:"+this.keepalive)
                this.activeMenu = index
                this.editableTabsValue = index;
                let exist = this.editableTabs.find(c=>c.name==index);
                if(exist){
                     this.$router.push(index)
                }else {
                    this.editableTabs.push({
                        title: menuName,
                        name: index,
                        content: menuName
                    });

                }
            },
            removeTab(targetName) {
                console.log("rembefor:"+this.keepalive)
                let target = targetName.substr(1,targetName.length-1);
                var index = this.keepalive.indexOf(target);
                if (index > -1) {
                    this.keepalive.splice(index, 1);
                }
                console.log("rembefor:"+this.keepalive)
                let tabs = this.editableTabs;
                let activeName = this.editableTabsValue;
                //if (activeName === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.name === targetName) {
                            if(this.$route.meta.keepAlive){
                                this.$route.meta.keepAlive = false
                            }

                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeName = nextTab.name;
                                this.activeMenu = activeName
                                this.$router.push(activeName)
                            }else {
                                this.activeMenu = 'dataanalytics'
                                this.$router.push('dataanalytics')
                            }
                        }
                    });
               // }
                this.editableTabsValue = activeName;
                this.editableTabs = tabs.filter(tab => tab.name !== targetName);
            },
            tabSelect(tab){
                this.activeMenu = tab.name
                this.$router.push(tab.name)
            }

        },
        watch:{

        },
        created() {
            getUserInfo(this.$store.state.userInfo.username).then(res => {
                if(res.data.code === 20000){
                    let userInfo = res.data.data.items
                    // 异步更新vuex的用户信息
                    this.$store.dispatch('setUserInfo',userInfo)
                    // 同步左侧导航和面包屑
                    let current = this.$router.history.current
                    if(this.ObjUtil.isNotEmpty( current && current.path !== '/home' && current.path !== 'login')){
                        //用户刷新页面后，重新激活左侧导航
                        this.activeMenu = this.$router.history.current.path
                        //
                        let router = current.matched.map(e=>e.path)
                        let allMenus = userInfo.allMenus
                        let arr =[]
                        router.forEach(value => {
                            arr.push(allMenus.find(e=>e.url === value))
                        })
                        this.breadcrumbList = arr
                    }
                }
            })

        },
        mounted() {

        }
    }
</script>

<style lang="less" scoped>
    .el-menu-vertical-demo:not(.el-menu--collapse) {
        width: 200px;
        min-height: 400px;
    }
    .home_container {
        height: 100%;

        .collapseMenu {
            line-height: 60px;
            font-size: 40px;
            cursor: pointer;
        }
    }

    .header_container {
        display: flex;

        .header_breadcrumb {
            margin-left: 30px;
            width: 80%;
        }

        .header_dropdown {
            position: absolute;
            right: 30px;
            line-height: 60px;
            .el-dropdown-link{
                color: #409EFF;
                cursor: pointer;
            }
        }
    }

    .el-breadcrumb {
        line-height: 60px;
    }

    .el-aside {
        background-color: #304156;
        border-right: 1px solid #DCDFE6;
    }

    .el-main {
        background-color: #fff;
    }

    .el-button{
        display:block;
        width: 100px;
        margin:0 auto;
        border:none

    }
    .el-dropdown-menu{
        text-align:center;
    }
    .logo{
        width: 40px;
        height: auto;
    }
    .title{
        font-size: 20px;
        color: white;
    }
</style>
