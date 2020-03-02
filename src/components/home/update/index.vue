<template>
    <!-- 修改密码界面 -->
    <el-dialog  width="40%" :visible.sync="cgpwdVisible" :close-on-click-modal="false" :modal-append-to-body='false'>
        <el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size"
                 label-position="right">
            <el-form-item label="旧密码" prop="oldPassword">
                <el-input v-model="dataForm.oldPassword" type="password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="dataForm.newPassword" type="password" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="margin-top: 5px;">
            <el-button :size="size" @click.native="cgpwdVisible = false">取消</el-button>
            <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">提交</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {updateUserPwd} from 'api/login'
    export default {
        data() {
            return {
                size: 'small',
                cgpwdVisible: false, // 编辑界面是否显示
                editLoading: false,   //载入图标
                //初始化数据
                dataForm: {
                    oldPassword: '',
                    newPassword: ''
                },
                //设置属性
                dataFormRules: {
                    oldPassword: [
                        { required: true, message: '请输入旧密码', trigger: 'blur' }
                    ],
                    newPassword: [
                        { required: true, message: '请输入新密码', trigger: 'blur' }
                    ]
                },

            }
        },
        methods: {
            // 设置可见性
            setCgpwdVisible: function (cgpwdVisible) {
                this.cgpwdVisible = cgpwdVisible
            },


            // 提交请求
            submitForm: function () {
                //this.$refs.XXX 获取ref绑定的节点
                this.$refs.dataForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            updateUserPwd(this.dataForm).then(res => {
                                console.log(res.data.code)
                                if(res.data.code == 20000) {
                                            this.$message({ message: '修改成功', type: 'success' })
                                            this.cgpwdVisible = false       //隐藏该窗口
                                        } else {
                                            this.$message({message: '修改失败, ', type: 'error'})
                                        }
                                        this.editLoading = false
                                        this.$refs['dataForm'].resetFields()    //重置表单

                            })
                        })
                    }
                })
            }
        },

        mounted() {

        }
    }
</script>

<style scoped>

</style>