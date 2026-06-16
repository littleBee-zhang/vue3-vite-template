import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

export default function models(props, emit) {
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

    // 文件大小校验
    const checkFileSize = (file) => {
        const maxByte = props.maxSize * 1024 * 1024
        if (file.size > maxByte) {
            ElMessage.error(`文件大小不能超过 ${props.maxSize}MB`)
            return false
        }
        return true
    }

    // 外部值 → 内部 fileList
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

    // 内部 → 外部 v-model
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

    // 上传
    const doUpload = async (options) => {
        const { file, onError, onSuccess } = options

        if (!checkFileSize(file)) {
            onError(new Error('size error'))
            return
        }

        const fileIsVideo = file.type.startsWith('video/')

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
                url: '/file/upload',
                method: 'POST',
                data: formData,
                isUploadFile: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            const result = res?.data
            
            const url = result.result?.url || result.result || result.url || ''
            if (!url) throw new Error('上传失败，未返回URL')

            const newItem = { name: file.name, url, uid: url,id:result.id }

            if (isForceSingle.value || (props.type === 'auto' && fileIsVideo)) {
                fileList.value = [newItem]
            } else {
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

    // 删除 & 预览
    const handleRemove = async () => await writeBackValue()

    const handlePreview = (file) => {
        previewUrl.value = file.url
        const videoReg = /\.(mp4|mov|avi|mkv|flv|webm)$/i
        isVideoPreview.value = videoReg.test(file.url) || props.type === 'video'
        dialogVisible.value = true
    }

    return {
        fileList,
        dialogVisible,
        previewUrl,
        isVideoPreview,
        multipleComputed,
        limit,
        listType,
        accept,
        doUpload,
        handleRemove,
        handlePreview
    }
}