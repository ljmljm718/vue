<template>
  <div class="w-full h-full create-lib-bg lib-detail">
    <div class="pt-[24px] pl-[36px] pb-[12px] flex items-center font-bold">
      <div
        class="w-[36px] h-[36px] go-back cursor-pointer"
        @click="
          collectionId = '';
          currentInfo = null;
        "
      ></div>
      <div class="ml-[28px]"><span class="text-[24px]">知识库详情</span></div>
    </div>
    <div v-if="formData" class="w-full h-[calc(100%-64px)] px-[99px] py-[16px] box-border relative">
      <el-scrollbar class="pr-[10px]" view-class="relative">
        <div class="w-full h-full absolute top-0 left-0 bg-transparent z-30"></div>
        <div class="flex items-center mb-[16px]">
          <div class="title-tag font-bold"></div>
          <span class="text-[16px]">基础信息</span>
        </div>
        <el-form
          :inline="true"
          label-width="130px"
          :model="formData"
          class="grid grid-cols-2 2xl:grid-cols-3"
        >
          <el-form-item prop="collectionName" label="名称" class="!mr-0">
            <el-input v-model="formData.collectionName" input-style="font-size: 16px" />
          </el-form-item>
          <el-form-item prop="kbId" label="ID" class="!mr-0">
            <el-input v-model="formData.kbId" input-style="font-size: 16px" />
          </el-form-item>
          <el-form-item prop="dType" label="数据类型" class="!mr-0">
            <el-input v-model="formData.dType" input-style="font-size: 16px" />
          </el-form-item>
          <el-form-item prop="description" label="描述" class="col-span-2 2xl:col-span-3 !mr-0">
            <el-input
              type="textarea"
              v-model="formData.description"
              input-style="font-size: 16px"
            />
          </el-form-item>
        </el-form>

        <div class="flex items-center my-[16px]">
          <div class="title-tag font-bold"></div>
          <span class="text-[16px]">配置信息</span>
        </div>
        <el-form
          :inline="true"
          label-width="130px"
          :model="formData"
          class="grid grid-cols-2 2xl:grid-cols-3"
        >
          <el-form-item prop="embeddingModel" label="文本向量化模型" class="!mr-0">
            <el-input v-model="formData.embeddingModel" input-style="font-size: 14px" />
          </el-form-item>
          <el-form-item prop="embeddingDimension" label="切片维度" class="!mr-0">
            <el-input v-model="formData.embeddingDimension" input-style="font-size: 16px" />
          </el-form-item>
          <el-form-item label="切片方式" class="!mr-0">
            <el-input v-model="embedType" input-style="font-size: 16px" />
          </el-form-item>
          <el-form-item prop="chunkLength" label="切片最大长度" class="!mr-0">
            <el-input v-model="formData.chunkLength" input-style="font-size: 16px" />
          </el-form-item>
          <el-form-item prop="merge" label="合并短文本片" class="!mr-0">
            <el-switch v-model="formData.merge" />
          </el-form-item>
          <el-form-item prop="ocr" class="!mr-0">
            <template #label>
              <div class="flex items-center">
                <span>图片OCR</span>
                <div
                  class="w-[32px] h-[18px] text-white bg-#615ced flex items-center justify-center ml-[8px] text-[14px]"
                  style="border-radius: 4px 4px 4px 0"
                >
                  Beta
                </div>
              </div>
            </template>
            <el-switch v-model="formData.ocr" />
          </el-form-item>
          <el-form-item prop="idxType" label="索引算法" class="!mr-0">
            <el-input v-model="formData.idxType" input-style="font-size: 16px" />
          </el-form-item>
          <el-form-item prop="quantify" label="量化方式" class="!mr-0">
            <el-input v-model="formData.quantify" input-style="font-size: 16px" />
          </el-form-item>
        </el-form>

        <div class="flex items-center my-[16px]">
          <div class="title-tag font-bold"></div>
          <span class="text-[16px]">文档信息</span>
        </div>
        <div class="grid grid-cols-2 2xl:grid-cols-3">
          <div
            v-for="item in docList"
            :key="item.docId"
            class="px-[24px] py-[22px] bg-[#F5F6FA] dark:bg-[#2C3240] rounded-[8px] flex justify-between items-center relative z-40"
          >
            <div class="flex items-center">
              <div class="flex-none" :class="docIconClassMap[item.docType]"></div>
              <div class="text-[16px]">{{ item.docName }}</div>
            </div>
            <a
              :href="item.fileManagement"
              class="w-[88px] h-[32px] text-[#615ced] active:opacity-50 flex items-center justify-center rounded-full no-underline text-[16px] dark:bg-[#615ced] dark:text-white"
              style="border: 1px solid #615ced"
            >
              <el-icon><Download /></el-icon>
              <span class="ml-[4px] text-[615ced]">下载</span>
            </a>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getLibDetailById, getDocList } from '../../apis';

const collectionId = defineModel('id', { required: true, type: String });

// 数据类型英文到中文的映射
const dataTypeMap = {
  unstructured_data: '非结构化数据',
  structured_data: '结构化数据'
};

const embedType = ref('默认切片方式');

const formData = ref<any>();
const loading = ref(false);
const getCollectionInfo = async () => {
  if (collectionId.value === '') return;
  loading.value = true;
  try {
    const res = await getLibDetailById({ collectionId: collectionId.value });
    formData.value = res
      ? {
          ...res,
          kbId: res.id ? 'kb' + res.id : '',
          dType: res.dataType ? dataTypeMap[res.dataType] : '',
          merge: res.mergeSmallChunks ? (res.mergeSmallChunks === 'true' ? true : false) : false,
          ocr: res.imageOcr ? (res.imageOcr === 'true' ? true : false) : false,
          idxType: res.indexType ? res.indexType.toUpperCase() : '',
          quantify: res.quant ? res.quant.toUpperCase() : ''
        }
      : {};
  } catch (e) {
    console.log(e);
  } finally {
    loading.value = false;
  }
  console.log(formData.value);
};
getCollectionInfo();

// 根据知识库ID查询文档列表
const docList = ref<any[]>([]);

const getDocumentList = async (id: string) => {
  docList.value = [];
  const res = await getDocList({ collectionId: id });
  docList.value = Array.isArray(res) ? res : [];
};
getDocumentList(collectionId.value);

const docIconClassMap = {
  csv: 'csv-icon',
  xls: 'excel-icon',
  xlsx: 'excel-icon',
  jsonl: 'jsonl-icon',
  md: 'md-icon',
  markdown: 'md-icon',
  pdf: 'pdf-icon',
  ppt: 'ppt-icon',
  pptx: 'ppt-icon',
  txt: 'txt-icon',
  doc: 'word-icon',
  docx: 'word-icon'
};
</script>

<style lang="scss" scoped>
.go-back {
  background-image: url(../../assets/knowledge-goback.svg);
  background-size: 100% 100%;
}

.title-tag {
  width: 0.4em;
  height: 1.4em;
  background-color: #615ced;
  margin-right: 0.8em;
}

:deep(.el-switch.is-checked .el-switch__core) {
  border-color: #615ced;
  background-color: #615ced;
}

:deep(.el-form-item__label) {
  font-size: 16px;
}

.ai-dark {
  .go-back {
    background-image: url(../../assets/knowledge-goback-dark.png);
    background-size: 100% 100%;
  }
}

.doc-icon {
  width: 22px;
  height: 24px;
  margin-right: 10px;
  background-size: 100% 100%;
}

.csv-icon {
  @extend .doc-icon;
  background-image: url(../../assets/knowledge-csv.svg);
}

.excel-icon {
  @extend .doc-icon;
  background-image: url(../../assets/knowledge-excel.svg);
}

.jsonl-icon {
  @extend .doc-icon;
  background-image: url(../../assets/knowledge-jsonl.svg);
}

.md-icon {
  @extend .doc-icon;
  background-image: url(../../assets/knowledge-md.svg);
}

.pdf-icon {
  @extend .doc-icon;
  background-image: url(../../assets/knowledge-pdf.svg);
}

.ppt-icon {
  @extend .doc-icon;
  background-image: url(../../assets/knowledge-ppt.svg);
}

.txt-icon {
  @extend .doc-icon;
  background-image: url(../../assets/knowledge-txt.svg);
}

.word-icon {
  @extend .doc-icon;
  background-image: url(../../assets/knowledge-word.svg);
}
</style>

<style lang="scss">
.ai-dark {
  .lib-detail {
    .el-input__wrapper,
    .el-textarea__inner {
      background-color: #2c3240;
    }
  }
}
</style>
