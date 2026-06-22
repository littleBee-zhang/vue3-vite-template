// import { computed, watch } from "vue";

export default function models(
    props,
    emit,
    formRef,
    formData,
    regulars,
    elements,
    SelectTextList,
) {
    const innerForm = {}
    // 初始化拷贝初始值
    Object.assign(innerForm, props.form || {})

    watch(
        () => props.form,
        (newVal) => {
            if (newVal && typeof newVal === 'object') {
                Object.assign(innerForm, newVal)
                // 同步到外层 formData
                Object.assign(formData, innerForm)
            }
        },
        { immediate: true, deep: true }
    );
    const setFormValue = async (payload) => {
        if (!payload || typeof payload !== 'object') return
        if (!formRef.value) return

        formRef.value.clearValidate()
        formRef.value.resetFields()

        // 关键：等表单重置DOM走完再赋值，避免被初始快照覆盖
        await nextTick()
        Object.assign(innerForm, payload)
        Object.assign(formData, innerForm)
    }
    const colSpan = computed(() => 24 / (props?.column || 3));

    const currentDataSource = computed(() => {
        const type = Object.prototype.toString.call(props.dataSource);
        if (type === "[object Function]") return props.dataSource(formData);
        if (type === "[object Array]") return props.dataSource;
        return [];
    });

    // 构造单个字段校验规则
    const buildRules = (item) => {
        const rules = []

        // 必填校验
        if (item?.required) {
            const tipText = SelectTextList.includes(item?.view) ? '选择' : '输入'
            rules.push({
                required: true,
                message: item?.requiredMsg || `请${tipText}${item.label}`,
                trigger: ['blur', 'change']
            })
        }

        // 拼接自定义格式校验规则
        if (Array.isArray(item?.rules) && item.rules.length) {
            item.rules.forEach((rule) => {
                const baseRule = regulars[rule.type]

                if (!baseRule) return

                // 合并规则：自定义rule优先级最高，覆盖默认配置
                const mergeRule = {
                    trigger: ['blur', 'change', 'input'],
                    ...baseRule,
                    validator: (rule, value, callback) => {
                        // 空值交给必填规则处理
                        if (!value) return callback()
                        const reg = baseRule?.pattern
                        if (!reg.test(value)) {
                            return callback(new Error(baseRule?.message))
                        }
                        callback()
                    },
                    ...rule
                }
                rules.push(mergeRule)
            })
        }

        return rules
    }

    // 动态计算表单校验规则
    const formRules = computed(() => {
        const ruleObj = {}
        const dataSource = currentDataSource.value || []

        dataSource.forEach((item) => {
            if (!item?.key) return

            const fieldRules = buildRules(item)
            if (fieldRules.length) {
                ruleObj[item.key] = fieldRules
            }
        })

        return ruleObj
    })

    const resolveView = (item) => {
        if (!item?.view) return "ElInput";
        if (typeof item?.view === "string")
            return elements[item?.view] || item?.view;
        return item?.view;
    };

    const buildViewProps = (item) => ({
        ...(item?.viewProps || {}),
        allowClear: item?.allowClear,
    });

    const handleChangeBtn = async (item) => {
        try {
            if (item?.onClick) {
                await formRef.value?.validate();
                await item?.onClick(formData);
            }
            if (item?.onReset) handleReset();
        } catch (e) {
            console.error(e);
        }
    };

    const buildPlaceholder = (item) =>
        item?.placeholder ||
        `${SelectTextList.includes(item?.view) ? "请选择" : "请输入"}${item?.label || ""}`;

    const shouldHide = (item) =>
        typeof item?.visible === "boolean" && !item?.visible;
    const shouldDisplayNone = (item) =>
        typeof item?.hide === "boolean" && item?.hide;

    const handleOnlyNumber = (key, e) => {
        if (e.target) e.target.value = e.target.value.replace(/[^\d.]/g, "");
    };

    const handleFieldsChange = (...args) => {
        emit("fields-change", ...args);
        props.onFieldsChange(...args);
    };

    const handleValuesChange = () => { };

    const handleConfirm = async () => {
        if (!formRef.value) return
        try {
            // validate 返回 Promise，不要传回调参数
            const valid = await formRef.value.validate()
            if (valid) {
                const values = { ...formData.value }
                emit("confirm", values)
                typeof props.onConfirm === 'function' && props.onConfirm(values)
                emit("submit", values)
                return values
            }
        } catch (err) {
            // 校验失败会进入 catch
            console.warn("表单校验失败", err)
            return false
        }
    }

    const handleReset = async () => {
        if (!formRef.value) return
        formRef.value.clearValidate()
        formRef.value.resetFields()
        await nextTick()
        // 清空所有字段
        Object.keys(innerForm).forEach(key => {
            innerForm[key] = ''
        })
        Object.assign(formData, innerForm)
        // const res = props.onReset(formData);
        // if (res !== false) {
        //     // 清空校验提示
        //     formRef.value.clearValidate()
        //     formRef.value?.resetFields();
        //     await nextTick()
        //     // 只清空值，不删除key
        //     Object.keys(formData).forEach((k) => {
        //         formData[k] = undefined
        //     });
        // }
        emit("reset", {});
    };

    return {
        colSpan,
        currentDataSource,
        formRules,
        buildRules,
        resolveView,
        buildViewProps,
        handleChangeBtn,
        buildPlaceholder,
        shouldHide,
        shouldDisplayNone,
        handleOnlyNumber,
        handleFieldsChange,
        handleValuesChange,
        handleConfirm,
        handleReset,
        // 
        setFormValue,
        innerForm,
    };
}
