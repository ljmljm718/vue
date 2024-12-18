<template>
  <div class="w-full h-full">
    <div
      class="h-[63px] px-[24px] flex items-center justify-between font-bold"
      style="border-bottom: 1px solid #e0e3eb"
    >
      <div>创建知识库</div>
      <div class="flex items-center cursor-pointer" @click="handleClickBack">
        <el-icon class="mr-[3px]" :size="14"><ArrowLeft /></el-icon>
        <span>返回</span>
      </div>
    </div>

    <div
      v-if="embeddingModelList.length > 0"
      class="w-full h-[calc(100%-64px)] pl-[63px] py-[16px] box-border"
    >
      <el-scrollbar class="pr-[63px]">
        <el-form
          :inline="true"
          :label-width="136"
          :model="formData"
          :rules="formRules"
          ref="formRef"
        >
          <div class="flex items-center mb-[16px]">
            <div class="title-tag font-bold"></div>
            <span>基础信息</span>
          </div>

          <el-form-item class="w-full !mr-0" prop="collectionName" label="名称">
            <el-input
              v-model="formData.collectionName"
              class="!w-1/4"
              placeholder="仅支持英文和数字的组合"
              clearable
            />
          </el-form-item>

          <el-form-item class="w-full !mr-0" prop="description" label="描述">
            <el-input v-model="formData.description" type="textarea" class="!w-1/2" clearable />
          </el-form-item>

          <el-form-item class="w-full !mr-0" prop="dataType" label="数据类型">
            <el-radio-group v-model="formData.dataType" class="!grid grid-cols-4 gap-[16px]">
              <el-radio
                v-for="item in dataTypeList"
                :key="item.name"
                :label="item.label"
                border
                :disabled="!item.enable"
              >
                <div class="font-bold leading-normal">{{ item.name }}</div>
                <div class="mt-[6px] text-[#666] text-wrap leading-normal">{{ item.content }}</div>
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <div class="flex items-center my-[16px]">
            <div class="title-tag font-bold"></div>
            <span>配置知识库</span>
          </div>

          <el-form-item class="w-full !mr-0" prop="embeddingModel" label="文本向量化模型">
            <el-select v-model="formData.embeddingModel" class="!w-1/4" @change="handleChangeModel">
              <el-option
                v-for="(item, index) in embeddingModelList"
                :key="item.id"
                :value="index"
                :label="item.embeddingModel"
              />
            </el-select>
          </el-form-item>

          <el-form-item class="w-full !mr-0" prop="embeddingDimension" label="向量维度">
            <el-radio-group
              v-model="formData.embeddingDimension"
              class="!grid grid-cols-4 gap-[16px] vector-dimension-radio"
            >
              <el-radio
                v-for="item in embeddingModelList[currentModel].embeddingDimension"
                :key="item"
                :label="item"
                border
              >
                <span class="leading-normal">{{ item }}</span>
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item class="w-full !mr-0" label="切片方式">
            <el-radio-group v-model="sliceType" class="!grid grid-cols-4 gap-[16px]">
              <el-radio v-for="item in sliceTypeList" :key="item.name" :label="item.name" border>
                <div class="font-bold leading-normal">{{ item.name }}</div>
                <div class="mt-[6px] text-[#666] text-wrap leading-normal">{{ item.content }}</div>
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item class="w-full !m-0" prop="chunkLength">
            <template #label>
              <div class="flex items-center">
                <span>切片最大长度</span>
                <el-popover placement="top" trigger="hover" :width="500" content="">
                  <template #reference>
                    <div class="question-mark cursor-pointer"></div>
                  </template>
                  <div class="flex flex-col space-y-[8px]">
                    <span>
                      请确保切片最大长度略小于向量化模型的最大输入长度，否则文本超长的部分会被模型丢弃。
                    </span>
                    <span>
                      当信息密度较大，且上下文关联性较小时，切片长度往往可以设置的小一些，以独立内容的长度为基准，如
                      200-500 左右。如政策信息、热点新闻、法律法规等。
                    </span>
                    <span>
                      当信息密度较小，需要较多上下文关联信息时，切片长度往往可以适当放大，但不宜过大，如
                      800-1000 左右。如产品说明书、小说、论文等。
                    </span>
                  </div>
                </el-popover>
              </div>
            </template>
            <el-input-number
              v-model="formData.chunkLength"
              class="!w-1/4"
              :min="embeddingModelList[currentModel].chunkLength[0]"
              :max="embeddingModelList[currentModel].chunkLength[1]"
            />
          </el-form-item>
          <div class="ml-[136px] my-[18px] flex items-center text-[12px] space-x-[8px]">
            <span class="text-[#666]">推荐长度</span>
            <div
              v-for="item in recommendSliceLengthList"
              :key="item"
              class="w-[43.5px] h-[24px] flex justify-center items-center rounded-[6px] bg-[#F5F6FA] cursor-pointer"
              @click="handleClickRecommendSliceLength(item)"
            >
              {{ item }}
            </div>
          </div>

          <el-form-item class="w-full !mr-0" prop="mergeSmallChunks">
            <template #label>
              <div class="flex items-center">
                <span>合并短文本片</span>
                <el-popover
                  placement="top"
                  trigger="hover"
                  content="配置是否对短文本片进行合并，且合并后的文本片会限制不超过切片最大长度"
                  :width="300"
                >
                  <template #reference>
                    <div class="question-mark cursor-pointer"></div>
                  </template>
                </el-popover>
              </div>
            </template>
            <el-switch v-model="formData.mergeSmallChunks" />
          </el-form-item>

          <el-form-item class="w-full !m-0" prop="imageOcr">
            <template #label>
              <div class="flex items-center">
                <span>图片OCR</span>
                <div class="beta-mark"></div>
              </div>
            </template>
            <el-switch v-model="formData.imageOcr" />
          </el-form-item>
          <div class="ml-[136px] mt-[12px] mb-[18px] text-[#666] text-[12px]">
            <span>可识别文档中的图片并解析文字存为切片。支持 docx，pdf。</span>
          </div>

          <el-form-item class="w-full !mr-0" prop="indexType" label="索引算法">
            <el-radio-group
              v-model="formData.indexType"
              class="w-full !grid grid-cols-4 gap-[16px]"
            >
              <el-radio
                v-for="item in embeddingModelList[currentModel].indexType"
                :key="item"
                :label="item"
                border
              >
                <div class="font-bold leading-normal">{{ item.toUpperCase() }}</div>
                <div class="mt-[6px] text-[#666] text-wrap leading-normal">
                  {{ indexAlgoMap[item] }}
                </div>
              </el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item class="w-full !mr-0" prop="quant" label="量化方式">
            <el-radio-group v-model="formData.quant" class="w-full !grid grid-cols-4 gap-[16px]">
              <el-radio
                v-for="item in embeddingModelList[currentModel].quant"
                :key="item"
                :label="item"
                border
              >
                <div class="font-bold leading-normal">{{ item.toUpperCase() }}</div>
                <div class="mt-[6px] text-[#666] text-wrap leading-normal">
                  {{ quantatitiveMethodMap[item] }}
                </div>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>

        <el-button type="primary" class="ml-[136px]" @click="handleClickCreateLib">
          创建知识库
        </el-button>
      </el-scrollbar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getSelectEmbeddingModel, postCreateLib, getCollectionList } from './api';

const emits = defineEmits(['backToLibPage', 'createSuccess']);

// 返回知识库
const handleClickBack = () => {
  emits('backToLibPage');
};

// 表单数据相关
interface FormData {
  collectionName: string | undefined;
  description: string | undefined;
  dataType: string;
  embeddingModel: string | undefined;
  embeddingDimension: string | number | undefined;
  chunkLength: number | string | undefined;
  imageOcr: boolean;
  mergeSmallChunks: boolean;
  indexType: string | undefined;
  quant: string | undefined;
}

const defaultFormData = {
  collectionName: undefined,
  description: undefined,
  dataType: 'unstructured_data',
  embeddingModel: undefined,
  embeddingDimension: undefined,
  chunkLength: undefined,
  imageOcr: false,
  mergeSmallChunks: true,
  indexType: undefined,
  quant: undefined
};

const checkCollectionNameduplicate = async (rule: any, value: any, callback: any) => {
  const list = await getCollectionList();
  const idx = list.findIndex((ele: any) => ele.collectionName === value);
  console.log(value, idx);
  if (-1 !== idx) {
    callback(new Error('知识库名称重复'));
  } else {
    callback();
  }
};

const formRules = reactive({
  collectionName: [
    { required: true, message: '知识库名称不能为空', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]+$/, message: '知识库名称必须是英文和数字的组合', trigger: 'blur' },
    { validator: checkCollectionNameduplicate, trigger: 'blur' }
  ],
  dataType: [{ required: true, message: '请选择数据类型', trigger: 'blur' }],
  embeddingModel: [{ required: true, message: '请选择向量化模型', trigger: 'blur' }],
  embeddingDimension: [{ required: true, message: '请选择向量维度', trigger: 'blur' }],
  chunkLength: [{ required: true, message: '切片长度不能为空', trigger: 'blur' }],
  indexType: [{ required: true, message: '请选择索引算法', trigger: 'blur' }],
  quant: [{ required: true, message: '请选择量化方式', trigger: 'blur' }]
});
const formRef = ref();
const formData = ref<FormData>(defaultFormData);

const resetForm = () => {
  formData.value = defaultFormData;
};

// 数据类型
const dataTypeList = ref([
  {
    name: '非结构化数据',
    enable: true,
    label: 'unstructured_data',
    content:
      '文件的主要内容为文本和图表，如文章、报告、书籍等，支持 fag.xlsx、docx、pptx、pdf、markdown、txt 格式'
  },
  {
    name: '结构化数据',
    enable: false,
    label: 'structured_data',
    content:
      '文件的主要内容为结构化文本，需具备明确的字段约束，如问答总结、政策条款、数据收集等，支持csv、xlsx、jsonl、fag.xlsx 格式'
  }
]);

// 向量化模型列表
const embeddingModelList = ref([]);
const currentModel = ref(-1);
const loading = ref(true);

// 改变模型时切换下标
const handleChangeModel = (index: number) => {
  currentModel.value = index;
  setFormDataOfModel(currentModel.value);
};

// 设置模型部分的表单数据
const setFormDataOfModel = (index: number) => {
  const item: any = embeddingModelList.value[index];
  formData.value.embeddingModel = item.embeddingModel;
  formData.value.embeddingDimension = item.embeddingDimension[0];
  formData.value.chunkLength = item.chunkLength[1] >= 1000 ? 1000 : item.chunkLength[1];
  formData.value.indexType = item.indexType[0];
  formData.value.quant = item.quant[0];
};

// 获取向量化模型列表
const getSelectEmbeddingModelInfo = async () => {
  embeddingModelList.value = [];
  currentModel.value = -1;
  loading.value = true;

  try {
    const res = await getSelectEmbeddingModel({ modelType: 'collectionModel' });
    // 设 返回结果必是列表
    // indexType chunkLength embeddingDimension quant 字段必有值且用逗号分隔
    // 其他字段该有都有
    const list = res.map((ele: any) => {
      return {
        ...ele,
        chunkLength: ele.chunkLength.split(',').map((e) => Number(e)),
        embeddingDimension: ele.embeddingDimension.split(','),
        quant: ele.quant.split(','),
        indexType: ele.indexType.split(',')
      };
    });

    embeddingModelList.value = list;
    currentModel.value = 0;
    setFormDataOfModel(currentModel.value);
  } finally {
    loading.value = false;
  }
};
getSelectEmbeddingModelInfo();

// 切片方式
const sliceType = ref('默认切片方式');
const sliceTypeList = ref([
  {
    name: '默认切片方式',
    content: '识别理解段落之间的层次结构，保持文档结构语义完整的基础上，将文本划分为多个文本片'
  }
]);

// 切片长度
const recommendSliceLengthList = ref([200, 500, 800, 1000]);
const handleClickRecommendSliceLength = (length: number) => {
  formData.value.chunkLength = length;
};

// 索引算法
const indexAlgoMap = {
  flat: '适用于小规模数据集(1w篇文档以内)，对检索精度要求高的场景',
  hnsw: '适用于大规模数据集，对检索性能要求高的场景',
  hnsw_hybrid: '能够兼具对关键词和语义的理解，综合提高检索精度'
};

// 量化方式
const quantatitiveMethodMap = {
  float: '全精度，未做压缩量化',
  int8: '将4字节的 float 压缩为单个字节，以获取内存和计算延迟的收益，会造成微小的损失精度',
  fix16: '将4字节的 float 压缩为两个字节，以获取内存和计算延迟的收益，会造成微小的损失精度'
};

// 创建知识库
const handleClickCreateLib = async () => {
  await formRef.value.validate();
  const msg = await postCreateLib(formData.value);
  // 创建成功的话
  emits('createSuccess', msg);
};
</script>

<style lang="scss" scoped>
.title-tag {
  width: 4px;
  height: 14px;
  background: linear-gradient(135deg, #00c784 0%, #009688 100%);
  margin-right: 8px;
}

:deep(.el-radio) {
  width: 100%;
  padding: 16px !important;
  margin: 0;
  box-sizing: border-box;
  height: 100%;
}

:deep(.vector-dimension-radio .el-radio) {
  padding: 2px 4px !important;
}

:deep(.el-radio__label) {
  padding: 0 !important;
}

:deep(.el-radio .el-radio__input) {
  display: none;
}

.question-mark {
  width: 12px;
  height: 12px;
  background-image: url(./assets/knowledge-question-mark.png);
  background-size: 100% 100%;
  margin-left: 8px;
}

.beta-mark {
  width: 32px;
  height: 18px;
  background-image: url(./assets/knowledge-beta.png);
  background-size: 100% 100%;
  margin-left: 8px;
}
</style>
