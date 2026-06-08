<template>
    <div class="gy-upload">
        <el-upload v-model:file-list="fileList" :http-request="doUpload" :list-type="listType"
            :on-preview="handlePreview" :on-remove="handleRemove" :limit="limit" :multiple="multipleComputed"
            :accept="accept" show-file-list>
            <el-button v-if="props.type === 'video'" size="small" type="primary">
                <template #icon>
                    <Plus />
                </template>
                点击上传
            </el-button>
            <el-icon v-else>
                <Plus />
            </el-icon>
        </el-upload>
        <!-- 预览弹窗 -->
        <el-dialog width="700px" v-model="dialogVisible">
            <template v-if="isVideoPreview">
                <video class="u-video" :src="previewUrl" controls style="width:100%;"></video>
            </template>
            <template v-else>
                <img class="u-image" :src="previewUrl" alt="预览" />
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import request from '@/request/http'

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    multiple: {
        type: Boolean,
        default: false
    },
    max: {
        type: Number,
        default: 9
    },
    type: {
        type: String,
        default: 'image', // image / video / auto
    },
    maxSize: {
        type: Number,
        default: 20, // 单位：MB
    }
})

const emit = defineEmits(['update:modelValue', 'change'])

// 内部状态
const fileList = ref([])
const dialogVisible = ref(false)
const previewUrl = ref('')
const isVideoPreview = ref(false)
const isInternalUpdate = ref(false)

// 计算属性
const isForceSingle = computed(() => props.type === 'video')
const multipleComputed = computed(() => !isForceSingle.value && props.multiple)
const limit = computed(() => isForceSingle.value ? 1 : props.max)
const listType = computed(() => props.type === 'video' ? 'text' : 'picture-card')
const accept = computed(() => {
    if (props.type === 'image') return 'image/*'
    if (props.type === 'video') return 'video/*'
    return 'image/*,video/*'
})

// =====================================
// 文件大小校验
// =====================================
const checkFileSize = (file) => {
    const maxByte = props.maxSize * 1024 * 1024
    if (file.size > maxByte) {
        ElMessage.error(`文件大小不能超过 ${props.maxSize}MB`)
        return false
    }
    return true
}

// =====================================
// 同步外部值 → fileList
// =====================================
const syncValueToFileList = (val) => {
    if (isInternalUpdate.value) return
    const urlList = (val || '')
        .split(',')
        .filter(Boolean)
        .filter(url => !url.startsWith('blob:'))

    const uniqueUrls = Array.from(new Set(urlList))
    fileList.value = uniqueUrls.map(url => ({
        name: url.split('/').pop() || 'file',
        url,
        uid: url
    }))
}

// =====================================
// 同步 fileList → v-model
// =====================================
const writeBackValue = async () => {
    const urls = fileList.value
        .map(item => item.url)
        .filter(Boolean)

    const uniqueUrls = Array.from(new Set(urls))
    const result = multipleComputed.value
        ? uniqueUrls.join(',')
        : uniqueUrls[0] || ''

    isInternalUpdate.value = true
    emit('update:modelValue', result)
    emit('change', result)
    await nextTick()
    isInternalUpdate.value = false
}

watch(() => props.modelValue, syncValueToFileList, {
    immediate: true,
    flush: 'post'
})

// =====================================
// 上传主体
// =====================================
const doUpload = async (options) => {
    const { file, onError, onSuccess } = options

    // 大小校验
    if (!checkFileSize(file)) {
        onError(new Error('size error'))
        return
    }

    const fileIsVideo = file.type.startsWith('video/')

    // 类型校验
    if (props.type === 'image' && fileIsVideo) {
        ElMessage.error('仅支持上传图片')
        onError(new Error('type error'))
        return
    }
    if (props.type === 'video' && !fileIsVideo) {
        ElMessage.error('仅支持上传视频')
        onError(new Error('type error'))
        return
    }

    try {
        const formData = new FormData()
        formData.append('file', file)

        const res = await request({
            url: '/sys/common/upload',
            method: 'post',
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        })

        const url = res.result?.url || res.result || res.url || ''
        if (!url) throw new Error('上传失败，未返回URL')

        const newItem = { name: file.name, url, uid: url }

        // 单文件覆盖
        if (isForceSingle.value || (props.type === 'auto' && fileIsVideo)) {
            fileList.value = [newItem]
        } else {
            // 多文件追加/替换
            const idx = fileList.value.findIndex(i => i.uid === file.uid)
            if (idx >= 0) {
                fileList.value.splice(idx, 1, newItem)
            } else {
                fileList.value.push(newItem)
            }
        }

        await writeBackValue()
        ElMessage.success('上传成功')
        onSuccess(res)
    } catch (err) {
        ElMessage.error('上传失败：' + err.message)
        onError(err)
    }
}

// =====================================
// 删除 & 预览
// =====================================
const handleRemove = async () => {
    await writeBackValue()
}

const handlePreview = (file) => {
    previewUrl.value = file.url
    const videoReg = /\.(mp4|mov|avi|mkv|flv|webm)$/i
    isVideoPreview.value = videoReg.test(file.url) || props.type === 'video'
    dialogVisible.value = true
}
</script>

<style scoped>
.gy-upload {
    display: inline-block;
}

.u-image {
    max-width: 100%;
    display: block;
    margin: 0 auto;
}

.u-video {
    width: 100%;
    display: block;
}
</style>