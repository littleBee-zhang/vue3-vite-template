import {
  ElInput,
  ElInputNumber,
  ElSelect,
  ElDatePicker,
  ElTreeSelect,
  ElSwitch,
  ElSlider,
  ElRate,
  ElColorPicker,
  ElTimePicker,
  ElCascader,
  ElTransfer,
  ElTimeSelect,
  ElButton
} from 'element-plus';

// 导入自定义价格输入组件
import VirtualSelect from '@/components/virtualSelect/index.vue'
import Upload from '@/components/upload/index.vue'
// 统一别名导出
const elements = {
  Input: ElInput,
  InputNumber: ElInputNumber,
  Select: ElSelect,
  Picker: ElDatePicker,
  TreeSelect: ElTreeSelect,
  Switch: ElSwitch,
  Slider: ElSlider,
  Rate: ElRate,
  ColorPicker: ElColorPicker,
  TimePicker: ElTimePicker,
  Cascader: ElCascader,
  TimeSelect: ElTimeSelect,
  Button: ElButton,
  Transfer: ElTransfer,
  VirtualSelect,
  Upload
};

export default elements;
export const SelectTextList = ['Select','Picker','TreeSelect','Cascader','VirtualSelect']