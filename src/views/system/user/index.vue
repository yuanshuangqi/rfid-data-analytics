<template>
    <div>
        <add :addChildDialogVisible="btnOperation.addDialogVisible"
             @closeAddDialog="closeAddDialog" @reloadParentData="reloadParentData"/>
        <edit :editChildDialogVisible="btnOperation.editDialogVisible" :editObj="editObj"
              @closeEditDialog="closeEditDialog" @reloadParentData="reloadParentData"/>
        <roleAssign :roleAssignChildDialogVisible="btnOperation.roleAssignDialogVisible" :roleAssignRow="roleAssignRow"
                @closeRoleAssignDialog="closeRoleAssignDialog" @reloadParentData="reloadParentData"/>
        <div class="page-header">
            <div class="page-header-search">
                <el-form :inline="true" :model="search" ref="searchForm" @submit.native.prevent>
                    <el-form-item prop="account">
                        <el-input v-model="search.account" placeholder="用户名" size="small"  @keydown.enter.native="query"/>
                    </el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="query">检 索</el-button>
                    <el-button type="primary"  @click="add" v-if="$skyPermission.hasPermission('user_mgr_add')">添 加</el-button>
                </el-form>
            </div>
        </div>
        <div class="page-main">
            <el-table :data="userData" size="small">
                <el-table-column prop="account" label="用户名"/>
                <el-table-column prop="sex" label="性别">
                    <template slot-scope="scope">
                        {{scope.row.sex==1?'女':'男'}}
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="电话号码"/>
                <el-table-column label="角色">
                    <template slot-scope="scope">
                        {{userRoles(scope.row)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="400">
                    <template slot-scope="scope">
                        <el-button
                                size="mini"
                                type="danger"
                                @click="resetPwd(scope.$index, scope.row)" v-if="$skyPermission.hasPermission('user_mgr_reset')">重置密码
                        </el-button>
                        <el-button
                                type="primary"
                                size="mini"
                                @click="edit(scope.$index, scope.row)" v-if="$skyPermission.hasPermission('user_mgr_edit')">编辑
                        </el-button>
                        <el-button
                                type="primary"
                                size="mini"
                                @click="roleAssign(scope.$index, scope.row)" v-if="$skyPermission.hasPermission('user_mgr_role_assign')">角色分配
                        </el-button>
                        <el-button
                                size="mini"
                                type="danger"
                                @click="del(scope.$index, scope.row)" v-if="$skyPermission.hasPermission('user_mgr_del')">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="page-footer">
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="search.currentPage"
                    :page-sizes=search.pageSizes
                    :page-size=search.pageSize
                    layout="total,sizes, prev, pager, next"
                    :total="search.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import {getUserData, del as delUser,resetPwd} from 'api/user'
    import add from './add'
    import edit from './edit'
    import roleAssign from './roleAssign'

    export default {
        name: "user",
        components: {
            add,
            edit,
            roleAssign
        },
        computed: {
            userRoles() {
                return row => {
                    return row.roles.map(value => value.roleName).join(';')
                }
            }
        },
        data() {
            return {
                userData: [],
                editObj: null,
                roleAssignRow:null,
                search: {
                    currentPage: 1,
                    pageSizes: [15, 50, 200, 500],
                    pageSize: 15,
                    total: 0,
                    account: ''
                },
                btnOperation: {
                    addDialogVisible: false,
                    editDialogVisible: false,
                    roleAssignDialogVisible: false
                },

            }
        },
        methods: {
            reset() {
                this.$refs.searchForm.resetFields()
            },
            query() {
                this.loadUserData()
            },
            handleSizeChange(size) {
                this.search.pageSize = size
                this.loadUserData()
            },
            handleCurrentChange(page) {
                this.search.currentPage = page
                this.loadUserData()
            },
            loadUserData() {
                getUserData(this.search).then(res => {
                    if (res.data.code === 20000) {
                        this.search.total = res.data.data.total
                        this.userData = res.data.data.rows
                    }
                })
            },
            reloadParentData() {
                this.loadUserData()
            },
            add() {
                this.btnOperation.addDialogVisible = true
            },
            // 角色分配
            roleAssign(index, row) {
                this.btnOperation.roleAssignDialogVisible = true
                this.roleAssignRow = row
            },
            edit(index, row) {
                this.btnOperation.editDialogVisible = true
                this.editObj = row
            },
            del(index, row) {
                this.$confirm('是否删除用户?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delUser(row.id).then(res => {
                        if (res.data.success) {
                            this.$message.success(res.data.message)
                            this.loadUserData()
                        }
                    })
                }).catch(() => {

                });
            },
            resetPwd(index,row){
                this.$confirm('是否重置该用户密码?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    resetPwd(row.id).then(res => {
                        if (res.data.success) {
                            this.$message.success(res.data.message)
                            this.loadUserData()
                        }
                    })
                }).catch(() => {

                });
            },
            closeAddDialog() {
                this.btnOperation.addDialogVisible = false
            },
            closeEditDialog() {
                this.btnOperation.editDialogVisible = false
            },
            closeRoleAssignDialog(){
                this.btnOperation.roleAssignDialogVisible = false
            }

        },
        created() {
            Promise.all([this.loadUserData()]).then(res=>{

                   console.log(res)

            })

        }
    }
</script>

<style lang="less" scoped>

</style>
