<template>
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" :close-on-click-modal="false">
        <el-form label-position="right" :model="editForm" :rules="editFormRules" ref="editForm" label-width="80px">
            <el-form-item label="用户名" prop="account">
                <el-input v-model="editForm.account" :maxlength="20" autocomplete="off"/>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="editForm.sex">
                    <el-radio :label="0">男</el-radio>
                    <el-radio :label="1">女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="电话号码" prop="phone">
                <el-input v-model="editForm.phone"  autocomplete="off"/>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="editFormSubmit">确 定</el-button>
            <el-button type="info" @click="resetAddForm">重 置</el-button>
            <el-button @click="closeDialog">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import {edit} from 'api/user'
    export default {
        name: "index",
        props:{
            editChildDialogVisible:Boolean,
            editObj:Object,
            deptTreeData:Array
        },
        data(){
            return {
                aa:'1',
                editForm:{
                    id:'',
                    account:'',
                    phone:'',
                    sex:''
                },
                editFormRules:{
                    account:[
                        { required: true, message: '用户名不能为空', trigger: 'blur' },
                    ]
                },
                elSelectStyle:{
                    width: '100%'
                },
                selectParams: {
                    clearable: true,
                },
                treeParams: {
                    'check-strictly': true,
                    'default-expand-all': true,
                    'expand-on-click-node': false,
                    data: [],
                    props: {
                        value: 'id',
                        label: 'deptName',
                        checkStrictly: true
                    }
                }
            }
        },
        computed:{
            editDialogVisible:{
                get(){
                    return this.$props.editChildDialogVisible
                },
                set(){
                    this.closeDialog()
                }

            }
        },
        methods:{
            closeDialog(){
                this.$emit('closeEditDialog')
            },
            resetAddForm(){
                this.$refs.editFormRef.resetFields()
            },
            editFormSubmit(){
                this.$refs['editForm'].validate((valid) => {
                    if (valid) {
                        edit(this.editForm).then(res => {
                            let result = res.data
                            if(result.success){
                                this.$message.success(result.message)
                                this.closeDialog()
                                this.$emit('reloadParentData')
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            }
        },
        watch:{
            editObj(newVal){
                this.editForm.id = newVal.id
                this.editForm.account = newVal.account
                this.editForm.phone = newVal.phone
                this.editForm.sex = newVal.sex
            },
            deptTreeData(val){
                this.treeParams.data = val
            }
        }
    }
</script>

<style lang="less" scoped>
</style>
