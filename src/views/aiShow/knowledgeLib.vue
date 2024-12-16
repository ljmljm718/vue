<script setup lang="ts">
import {
  getCollectionList,
  getDocList,
  postDeleteLib,
  postDeleteDoc,
  postAddDoc,
  postForceDeleteLib
} from './api';
// @ts-ignore
import KnowledgeLibCreateOrUpdate from './kowledgeLibCreateOrUpdate.vue';
import DefaultLibImg from './assets/knowledge-lib-default-img.png';
import GuideImg from './assets/knowledge-guide.png';

// false 则显示创建知识库页面
const showLibPage = ref(true);

const handleClickCreateLib = () => {
  showLibPage.value = false;
};

const showCreateLibSuccessDialog = ref(false);
const createLibSuccessDialogLibName = ref('');
const addIndex = ref(-1);

const handleCreateLibSuccess = async (libId: string) => {
  await getKnowledgeList();
  const index = knowledgeList.value.findIndex((ele) => ele.collectionId === libId);
  addIndex.value = index;
  const item = knowledgeList.value[index];
  console.log('新增项: ', item);
  showLibPage.value = true;

  showCreateLibSuccessDialog.value = true;
  createLibSuccessDialogLibName.value = item.collectionName;
};

// 暂不导入 关闭对话框 重置createLibSuccessDialogLibName
const handleClickNoImport = () => {
  showCreateLibSuccessDialog.value = false;
  createLibSuccessDialogLibName.value = '';
  addIndex.value = -1;
};

// 立即导入
const handleClickImportImmediate = () => {
  showCreateLibSuccessDialog.value = false;
  createLibSuccessDialogLibName.value = '';

  handleClickImport(addIndex.value);
  addIndex.value = -1;
};

const handleShowLibPage = async () => {
  // await 重新查询知识库列表
  showLibPage.value = true;
};

// 知识库列表
const knowledgeList = ref<any[]>([]);
const getKnowledgeList = async () => {
  knowledgeList.value = [];
  const res = await getCollectionList();
  knowledgeList.value = Array.isArray(res) ? res : [];
};
getKnowledgeList();

// 数据类型英文到中文的映射
const dataTypeMap = {
  unstructured_data: '非结构化数据',
  structured_data: '结构化数据'
};

// 展示教程
const showGuide = ref(false);

const handleClickGuideArrow = () => {
  showGuide.value = !showGuide.value;
};

// 导入文档
const showImportDialog = ref(false);
const docUrl = ref('');
const currentLibId = ref('');
const currentDocTypes = ref<string[]>([]);

const handleClickImport = (index: number) => {
  const id = knowledgeList.value[index].collectionId;
  docUrl.value = '';
  currentLibId.value = id;
  currentDocTypes.value =
    knowledgeList.value[index].dataType === 'unstructured_data'
      ? docTypesForUnstructuredData
      : docTypesForStructuredData;
  showImportDialog.value = true;
};

const handleSubmitImport = async () => {
  const id = currentLibId.value;
  await postAddDoc({
    collectionId: id,
    fileManagement: docUrl.value
  });
  message.success('导入成功');

  // 上传完成后重新查询文档列表和知识库列表
  await getDocumentList(id);
  await getKnowledgeList();
  showImportDialog.value = false;
  currentLibId.value = '';
  currentDocTypes.value = [];
};

// 根据知识库ID查询文档列表
const docList = ref<any[]>([]);

const getDocumentList = async (id: string) => {
  docList.value = [];
  const res = await getDocList({ collectionId: id });
  docList.value = Array.isArray(res) ? res : [];
};

// 查看文档
const showCheckDoc = ref(false);
const handleCheckDoc = async (index: number) => {
  const id = knowledgeList.value[index].collectionId;
  currentLibId.value = id;
  await getDocumentList(id);
  showCheckDoc.value = true;
};

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

const docTypesForUnstructuredData = ['faq.xlsx', 'docx', 'pptx', 'pdf', 'markdown', 'txt'];
const docTypesForStructuredData = ['csv', 'xlsx', 'jsonl'];

// 删除文档
const handleClickDeleteDoc = async (docId: string) => {
  try {
    await message.delConfirm();

    const id = currentLibId.value;
    await postDeleteDoc({
      collectionId: id,
      docId
    });
    message.success(t('common.delSuccess'));

    // 重新查询文档列表和知识库列表
    await getDocumentList(id);
    await getKnowledgeList();
  } catch (e) {
    if ('cancel' === e) {
      console.log('取消删除');
    } else {
      console.log(e);
    }
  }
};

// 删除知识库
const message = useMessage();
const { t } = useI18n();

const handleDeleteLib = async (index: number) => {
  try {
    await message.delConfirm();

    const id = knowledgeList.value[index].collectionId;
    const code = await postDeleteLib({ collectionId: id });
    switch (code) {
      case '0':
        message.success(t('common.delSuccess'));
        break;
      case '1000005':
        await deleteLibWithoutCollection(id);
        break;
    }

    await getKnowledgeList();
  } catch (e) {
    if ('cancel' === e) {
      console.log('取消删除');
    } else {
      console.log(e);
    }
  }
};

// 远端collection不存在 删除在数据库中的那条数据
const deleteLibWithoutCollection = async (collectionId: string) => {
  try {
    await message.delConfirm('该知识库在服务端不存在，是否强制删除？');
    await postForceDeleteLib({ collectionId });
    message.success(t('common.delSuccess'));
  } catch (e) {
    if ('cancel' === e) {
      console.log('取消删除');
    } else {
      console.log(e);
    }
  }
};
</script>

<template>
  <div class="w-full h-full knowledge-bg">
    <div v-if="showLibPage" class="w-full h-full">
      <div
        class="h-[63px] px-[24px] flex items-center justify-between font-bold"
        style="border-bottom: 1px solid #e0e3eb"
      >
        <div>知识库</div>
        <el-button type="primary" @click="handleClickCreateLib">
          <el-icon class="mr-[3px]"><Plus /></el-icon>
          创建知识库
        </el-button>
      </div>

      <div class="p-[16px] pr-0 w-full h-[calc(100%-64px)] box-border">
        <el-scrollbar class="pr-[16px]">
          <div class="w-full">
            <div
              class="w-full flex justify-between items-center px-[27px] pb-[16px] box-border text-[14px] text-[#666]"
            >
              <span class="text-[12px]">
                知识库提供知识管理的能力，将本地存储、TOS
                中存储或指定链接的多个文档导入到知识库中，并对文档执行解析、切片、向量化、构建索引等处理流程，处理完成后即可进行知识检索。
              </span>
              <div
                class="flex-none flex items-center ml-[16px] cursor-pointer"
                @click="handleClickGuideArrow"
              >
                <span>{{ showGuide ? '收起' : '展开' }}教程</span>
                <div
                  class="down-arrow transition-all"
                  :class="showGuide ? 'rotate-180' : 'rotate-0'"
                ></div>
              </div>
            </div>
            <img
              v-show="showGuide"
              :src="GuideImg"
              alt="教程"
              class="w-full mb-[16px] object-contain"
            />
          </div>

          <div
            v-if="knowledgeList.length <= 0"
            class="w-full h-full flex flex-col justify-center items-center mt-[72px]"
          >
            <div class="no-lib"></div>
            <div class="mt-[8px]">暂未创建知识库</div>
            <div class="text-[#666] text-[14px] mt-[8px]">
              您还没有创建知识库，点击下方按钮快速创建
            </div>
            <el-button type="primary" class="mt-[24px]" @click="handleClickCreateLib">
              <el-icon class="mr-[3px]"><Plus /></el-icon>
              创建知识库
            </el-button>
          </div>

          <div v-else class="grid grid-cols-2 xl:grid-cols-3 gap-[16px]">
            <div
              v-for="(item, index) in knowledgeList"
              :key="item.name"
              class="rounded-[6px] overflow-hidden shadow-lg relative"
            >
              <div class="pb-[27.85%] relative w-full">
                <el-image
                  :src="DefaultLibImg"
                  :alt="item.name + '-' + item.tag"
                  fit="cover"
                  class="!absolute top-0 left-0 w-full h-full"
                />
              </div>
              <div
                class="absolute top-[16px] left-[16px] 2xl:top-[31px] 2xl:left-[24px] cursor-default"
              >
                <div class="text-[24px]">{{ item.collectionName }}</div>
                <div class="tag">{{ dataTypeMap[item.dataType] }}</div>
              </div>
              <div class="flex items-center justify-between p-[16px] bg-[#fff]">
                <div class="flex items-center">
                  <span>文档数量: {{ item.docNum ? item.docNum : 0 }}</span>
                  <div
                    class="right-arrow-circle cursor-pointer"
                    @click="handleCheckDoc(index)"
                  ></div>
                </div>
                <div class="flex items-center space-x-[8px]">
                  <el-button type="primary" @click="handleClickImport(index)">导入文档</el-button>
                  <el-button @click="handleDeleteLib(index)">删除</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>

    <div v-else class="w-full h-full">
      <knowledge-lib-create-or-update
        @back-to-lib-page="handleShowLibPage"
        @create-success="handleCreateLibSuccess"
      />
    </div>

    <Dialog
      v-model="showImportDialog"
      title="导入文档"
      @close="
        currentLibId = '';
        currentDocTypes = [];
      "
    >
      <div class="w-full h-full flex flex-col justify-center items-center">
        <UploadFile v-model="docUrl" :limit="1" :fileType="currentDocTypes" />
        <el-button class="self-end" type="primary" @click="handleSubmitImport">立即导入</el-button>
      </div>
    </Dialog>

    <Dialog
      v-model="showCheckDoc"
      title="查看文档"
      :width="600"
      top="20px"
      @close="currentLibId = ''"
    >
      <div class="w-full h-[400px]">
        <el-scrollbar v-if="docList.length > 0">
          <div v-for="item in docList" :key="item.docId">
            <div class="w-full flex justify-between items-center cursor-default">
              <div class="w-3/4 flex items-center">
                <div class="flex-none" :class="docIconClassMap[item.docType]"></div>
                <div class="truncate">{{ item.docName }}</div>
              </div>
              <div class="flex items-center space-x-[10px]">
                <span>{{ item.size }}</span>
                <el-button link v-show="item.fileManagement">
                  <a
                    :href="item.fileManagement"
                    :style="{ color: 'var(--el-color-primary)' }"
                    class="active:opacity-50"
                  >
                    <el-icon><Download /></el-icon>
                  </a>
                </el-button>
                <el-button link @click="handleClickDeleteDoc(item.docId)">
                  <el-icon><Close /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="my-[16px] ml-[30px] mr-[5px] h-[1px] bg-[#F5F6FA]"></div>
          </div>
        </el-scrollbar>
        <div v-else class="w-full h-full flex flex-col justify-center items-center">
          <div class="no-data"></div>
          <div class="tracking-widest">暂无数据</div>
        </div>
      </div>
    </Dialog>

    <Dialog
      v-model="showCreateLibSuccessDialog"
      :show-close="false"
      class="no-header"
      :width="433"
      @close="
        createLibSuccessDialogLibName = '';
        addIndex = -1;
      "
    >
      <template #header><div></div></template>
      <div>
        <div class="flex items-center">
          <div class="create-lib-success-icon"></div>
          <span class="font-bold">知识库【{{ createLibSuccessDialogLibName }}】创建成功</span>
        </div>
        <div class="ml-[40px] mt-[12px] text-[#666]">是否立即导入文档?</div>
        <div class="mt-[45px] flex justify-end space-x-[8px]">
          <el-button @click="handleClickNoImport">暂不导入</el-button>
          <el-button type="primary" @click="handleClickImportImmediate">立即导入</el-button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.knowledge-bg {
  background-image: url(./assets/knowledge-bg.png);
  background-size: 100% 100%;
}

.down-arrow {
  width: 11px;
  height: 8px;
  background-image: url(./assets/knowledge-arrow-down.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-left: 8px;
}

.no-lib {
  width: 234px;
  height: 247px;
  background-image: url(./assets/knowledge-no-lib.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.right-arrow-circle {
  width: 14px;
  height: 14px;
  background-image: url(./assets/knowledge-right-arrow.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-left: 8px;
}

.tag {
  width: 104px;
  height: 24px;
  border: 1px solid;
  border-image: linear-gradient(135deg, rgba(0, 199, 132, 1), rgba(0, 150, 136, 1)) 1 1;
  background-image: linear-gradient(45deg, #00c784 0%, #009688 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  margin-top: 12px;
  padding: 3px 13px;
  text-align: center;
}

.doc-icon {
  width: 22px;
  height: 24px;
  margin-right: 10px;
  background-size: 100% 100%;
}

.csv-icon {
  @extend .doc-icon;
  background-image: url(./assets/knowledge-csv.png);
}

.excel-icon {
  @extend .doc-icon;
  background-image: url(./assets/knowledge-excel.png);
}

.jsonl-icon {
  @extend .doc-icon;
  background-image: url(./assets/knowledge-jsonl.png);
}

.md-icon {
  @extend .doc-icon;
  background-image: url(./assets/knowledge-md.png);
}

.pdf-icon {
  @extend .doc-icon;
  background-image: url(./assets/knowledge-pdf.png);
}

.ppt-icon {
  @extend .doc-icon;
  background-image: url(./assets/knowledge-ppt.png);
}

.txt-icon {
  @extend .doc-icon;
  background-image: url(./assets/knowledge-txt.png);
}

.word-icon {
  @extend .doc-icon;
  background-image: url(./assets/knowledge-word.png);
}

:deep(.no-header .el-dialog__header) {
  display: none;
}

.create-lib-success-icon {
  background-image: url(./assets/knowledge-create-lib-success.png);
  background-size: 100% 100%;
  width: 24px;
  height: 24px;
  margin-right: 16px;
}

.no-data {
  width: 180px;
  height: 180px;
  background-image: url(/images/noData.png);
  background-size: 100% 100%;
}
</style>
