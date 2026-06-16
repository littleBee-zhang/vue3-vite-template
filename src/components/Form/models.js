import { computed, watch } from "vue";

export default function models(
    props,
    emit,
    formRef,
    formData,
    regulars,
    elements,
    SelectTextList,
) {
    const colSpan = computed(() => 24 / (props?.column || 3));

    const currentDataSource = computed(() => {
        const type = Object.prototype.toString.call(props.dataSource);
        if (type === "[object Function]") return props.dataSource(formData);
        if (type === "[object Array]") return props.dataSource;
        return [];
    });

    watch(
        () => formData,
        (val) => {
            emit("values-change", { ...val }, { ...val });
            props.onValuesChange({ ...val }, { ...val });
        },
        { deep: true },
    );

    const buildRules = (item) => {
        const rules = [];
        if (item?.required) {
            rules.push({
                required: true,
                message:
                    item?.requiredMsg ||
                    `请${SelectTextList.includes(item?.view) ? "选择" : "输入"}${item?.label}`,
                trigger: "blur",
            });
        }
        if (item?.rules?.length) {
            item?.rules.forEach((rule) => {
                rules.push({ ...(regulars[rule.type] || {}), ...rule });
            });
        }
        return rules;
    };

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
        try {
            await formRef.value.validate();
            const values = { ...formData };
            emit("confirm", values);
            props.onConfirm(values);
            emit("submit", values);
            // props.onSubmit(values);
            return values;
        } catch (err) {
            console.warn("表单校验失败", err);
            return false;
        }
    };

    const handleReset = () => {
        const res = props.onReset(formData);
        if (res !== false) {
            formRef.value?.resetFields();
            Object.keys(formData).forEach((k) => delete formData[k]);
        }
        emit("reset", {});
    };

    return {
        colSpan,
        currentDataSource,
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
    };
}
