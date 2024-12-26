<script setup lang="ts">
import {
  getCollectionList,
  getDocList,
  postDeleteLib,
  postDeleteDoc,
  postAddDoc,
  postForceDeleteLib
} from '../../apis';
// @ts-ignore
import KnowledgeLibCreateOrUpdate from './kowledgeLibCreateOrUpdate.vue';

// false 则显示创建知识库页面
const showLibPage = ref(true);

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

// 展示教程
const showGuide = ref(false);

// 知识库列表
const knowledgeList = ref<any[]>([]);
const getKnowledgeList = async () => {
  knowledgeList.value = [];
  const res = await getCollectionList();
  // const res = [];
  knowledgeList.value = Array.isArray(res) ? res : [];
  console.log(knowledgeList.value.length, 0 === knowledgeList.value.length);
};
getKnowledgeList();

// 数据类型英文到中文的映射
const dataTypeMap = {
  unstructured_data: '非结构化数据',
  structured_data: '结构化数据'
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
  <div class="w-full h-full text-[10px]" :class="showLibPage ? 'lib-bg' : 'create-lib-bg'">
    <template v-if="showLibPage">
      <!-- header -->
      <div class="h-[5.7em] p-[2.4em] pl-[3.6em] flex justify-between items-start">
        <div class="grow flex items-start h-full">
          <div class="flex-none logo w-[4.8em] h-[4.8em]"></div>
          <div class="grow pl-[1.6em] flex flex-col justify-between h-[5.7em]">
            <h1 class="m-0 text-[2.4em]">知识库</h1>
            <div
              class="text-[1.4em] text-[#999999] line-clamp-1"
              title="知识库提供知识管理的能力，将多个文档导入到知识库中，并对文档执行解析、切片、向量化、构建索引等处理流程，处理完成后即可进行知识检索。"
            >
              知识库提供知识管理的能力，将多个文档导入到知识库中，并对文档执行解析、切片、向量化、构建索引等处理流程，处理完成后即可进行知识检索。
            </div>
          </div>
        </div>
        <div class="flex-none flex space-x-[1.6em]">
          <div
            class="create-btn flex items-center px-[2em] py-[0.8em] cursor-pointer"
            @click="showLibPage = false"
          >
            <el-icon><Plus /></el-icon>
            <span class="pl-[0.6em] text-[1.4em]">创建知识库</span>
          </div>
          <div
            class="flex items-center px-[1.7em] py-[0.8em] rounded-[2em] cursor-pointer"
            style="border: 0.1em solid #ebecf2"
            @click="showGuide = !showGuide"
          >
            <div
              class="collapse-arrow w-[1.4em] h-[1.4em] transition-all"
              :style="{ transform: showGuide ? 'rotate(0deg)' : 'rotate(180deg)' }"
            ></div>
            <span class="text-[1.4em] ml-[0.3em] pl-[0.6em]">
              {{ showGuide ? '收起教程' : '展开教程' }}
            </span>
          </div>
        </div>
      </div>
      <!-- content -->
      <div class="h-[calc(100%-10.5em)] relative">
        <div
          :class="showGuide ? 'h-[19.8em] guide-border' : 'h-0'"
          style="width: calc(100% - 6em)"
          class="mx-[3.3em] rounded-[1.6em] overflow-hidden transition-all absolute left-0 top-0 z-20 w-full bg-white !dark:bg-[#121725]"
        >
          <el-scrollbar>
            <div class="flex px-[3.7em] pt-[1.7em] space-x-[8.5em]">
              <div class="flex space-x-[3.5em]">
                <div class="space-y-[1.2em] w-[30em]">
                  <div class="text-[1.4em] text-[#635E9E] fix-text-white">第1步</div>
                  <div class="text-[#33315A] text-[1.8em] fix-text-white">创建知识库</div>
                  <div class="text-[1.4em] text-[#252059] fix-text-white">
                    按特定场景/领域管理知识库，支持结构化和非结构化类型知识库
                  </div>
                </div>
                <div class="guide-img-1 w-[16.1em] h-[17.1em] self-end"></div>
              </div>
              <div class="flex space-x-[3.5em]">
                <div class="space-y-[1.2em] w-[30em]">
                  <div class="text-[1.4em] text-[#635E9E] fix-text-white">第2步</div>
                  <div class="text-[#33315A] text-[1.8em] fix-text-white">上传文档</div>
                  <div class="text-[1.4em] text-[#252059] fix-text-white">
                    非结构化文档支持类型：txt、doc、docx、pdf、markdown/md、faq.xlsx、pptx；结构化文档支持类型：xlsx、csv、
                    jsonl
                  </div>
                </div>
                <div class="guide-img-2 w-[16.1em] h-[17.1em] self-end"></div>
              </div>
              <div class="flex space-x-[3.5em]">
                <div class="space-y-[1.2em] w-[30em]">
                  <div class="text-[1.4em] text-[#635E9E] fix-text-white">第3步</div>
                  <div class="text-[#33315A] text-[1.8em] fix-text-white">检索问答</div>
                  <div class="text-[1.4em] text-[#252059] fix-text-white">
                    基于知识库，通过切片检索及大模型问答，调试检查回答效果
                  </div>
                </div>
                <div class="guide-img-3 w-[16.1em] h-[17.1em] self-end"></div>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <el-scrollbar @click="showGuide = false">
          <!-- no knowledge lib -->
          <template v-if="knowledgeList.length <= 0">
            <div class="relative">
              <div
                class="absolute top-[6.8em] left-1/2 -translate-x-1/2 flex flex-col items-center"
              >
                <div class="no-lib"></div>
                <div class="text-[2.4em] text-[#33315A] fix-text-white">暂未创建知识库</div>
                <div class="text-[#635E9E] fix-text-white text-opacity-70 text-[1.4em] mt-[0.5em]">
                  您还没有创建知识库，点击右上方按钮快速创建
                </div>
                <!-- <div
                  class="create-btn mt-[2.4em] flex items-center px-[2em] py-[0.8em] cursor-pointer"
                  @click="showLibPage = false"
                >
                  <el-icon><Plus /></el-icon>
                  <span class="pl-[0.3em] text-[1.6em]">创建知识库</span>
                </div> -->
              </div>
            </div>
          </template>
          <!-- knowledge lib list -->
          <template v-else>
            <div
              class="mt-[2.4em] grid grid-cols-2 2xl:grid-cols-3 gap-[1.6em] pl-[3.9em] pr-[2.4em] pb-20px"
            >
              <div
                v-for="(item, index) in knowledgeList"
                :key="item.name"
                class="rounded-[1.2em] card-bg overflow-hidden shadow-lg"
              >
                <div class="flex justify-between pt-[2em] pl-[2.5em] pb-[2.5em] pr-[4.3em]">
                  <div class="flex flex-col justify-center">
                    <div class="flex">
                      <span class="text-[2.4em] text-[#33315A] fix-text-white">
                        {{ item.collectionName }}
                      </span>
                      <div class="tag">{{ dataTypeMap[item.dataType] }}</div>
                    </div>
                    <div class="pt-[0.8em] flex items-center">
                      <span class="text-[#9998AC] dark:text-[#9998AC] text-[1.6em]">
                        文档数量：{{ item.docNum ? item.docNum : 0 }}
                      </span>
                      <div
                        class="right-arrow-circle cursor-pointer"
                        @click="handleCheckDoc(index)"
                      ></div>
                    </div>
                  </div>
                  <div class="card-logo w-[6.6em] h-[7.3em]"></div>
                </div>
                <div class="grid grid-cols-3">
                  <div
                    class="card-btn-border-top card-btn-border-right flex justify-center items-center py-[0.8em] cursor-pointer text-[1.6em] text-[#33315A] fix-text-white"
                    @click="handleClickImport(index)"
                  >
                    导入文档
                  </div>
                  <div class="card-btn-border-top card-btn-border-right"></div>
                  <div
                    class="card-btn-border-top flex justify-center items-center py-[0.8em] cursor-pointer text-[1.6em] text-[#33315A] fix-text-white"
                    @click="handleDeleteLib(index)"
                  >
                    删除
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-scrollbar>
      </div>
    </template>

    <template v-else>
      <knowledge-lib-create-or-update
        @back-to-lib-page="handleShowLibPage"
        @create-success="handleCreateLibSuccess"
      />
    </template>

    <Dialog
      v-model="showImportDialog"
      title="导入文档"
      @close="
        currentLibId = '';
        currentDocTypes = [];
      "
      width="60em"
    >
      <div class="w-full h-full flex flex-col justify-center items-center">
        <UploadFile
          class="scale-120 up-btn"
          v-model="docUrl"
          :limit="1"
          :fileType="currentDocTypes"
        />
        <el-button class="self-end" color="#615ced" @click="handleSubmitImport">立即导入</el-button>
      </div>
    </Dialog>

    <Dialog v-model="showCheckDoc" title="查看文档" width="60em" @close="currentLibId = ''">
      <div class="w-full h-[40em]">
        <el-scrollbar v-if="docList.length > 0" view-class="pr-[1.6em]">
          <div v-for="item in docList" :key="item.docId">
            <div class="w-full flex justify-between items-center cursor-default">
              <div class="w-3/4 flex items-center">
                <div class="flex-none" :class="docIconClassMap[item.docType]"></div>
                <div class="truncate">{{ item.docName }}</div>
              </div>
              <div class="flex items-center space-x-[1em]">
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
            <div class="my-[1.6em] ml-[3em] mr-[0.5em] h-[0.1em] bg-[#F5F6FA]"></div>
          </div>
        </el-scrollbar>
        <div v-else class="w-full h-full flex flex-col justify-center items-center">
          <div class="no-data"></div>
          <div class="tracking-widest text-[1.4em]">暂无数据</div>
        </div>
      </div>
    </Dialog>

    <Dialog
      v-model="showCreateLibSuccessDialog"
      :show-close="false"
      class="no-header"
      width="60em"
      @close="
        createLibSuccessDialogLibName = '';
        addIndex = -1;
      "
    >
      <div>
        <div class="flex items-center">
          <div class="create-lib-success-icon"></div>
          <span class="font-bold text-[1.4em]">
            知识库【{{ createLibSuccessDialogLibName }}】创建成功
          </span>
        </div>
        <div class="ml-[4em] mt-[1.2em] text-[#666]">
          <span class="text-[1.4em]">是否立即导入文档?</span>
        </div>
        <div class="mt-[4.5em] flex justify-end space-x-[0.8em]">
          <el-button @click="handleClickNoImport">暂不导入</el-button>
          <el-button color="#615ced" @click="handleClickImportImmediate">立即导入</el-button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.lib-bg {
  background: linear-gradient(to bottom, #ffffff 30%, #ededfd 100%);
}

.create-lib-bg {
  background: linear-gradient(to top, #ffffff 70%, #ededfd 100%);
}

.create-btn {
  background: linear-gradient(90deg, #9362da 0%, #4378ff 100%);
  border-radius: 2em;
  color: white;
}

.logo {
  background-image: url(../../assets/knowledge-logo.svg);
  background-size: 100% 100%;
}

.collapse-arrow {
  background-image: url(../../assets/knowledge-collapse.svg);
  background-size: 100% 100%;
}

.ai-light {
  .guide-border {
    border: 0.1em solid #ebecf2;
  }
}

@for $i from 1 through 3 {
  .guide-img-#{$i} {
    background-image: url(../../assets/knowledge-guide-#{$i}.svg);
    background-size: 100% 100%;
  }
}

.card-bg {
  background-image: url(../../assets/knowledge-card-bg.png);
  background-size: 100% 100%;
  border: 1px solid #ebecf2;
}

.card-logo {
  background-image: url(../../assets/knowledge-card-logo.svg);
  background-size: 150% 150%;
  background-position: center;
}

.no-lib {
  width: 23.4em;
  height: 24.7em;
  background-image: url(../../assets/knowledge-no-lib.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.right-arrow-circle {
  width: 1.4em;
  height: 1.4em;
  background-image: url(../../assets/knowledge-right-arrow.svg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-left: 0.8em;
}

.tag {
  margin-left: 1.6em;
  display: flex;
  align-items: center;
  border-radius: 0.8em;
  background-color: #f1f1fd;
  padding-left: 1.3em;
  padding-right: 1.3em;
  color: #615ced;
  font-size: 1.3em;
}

.card-btn-border-top {
  border-top: 0.1em solid #ebecf2;
}

.card-btn-border-right {
  border-right: 0.1em solid #ebecf2;
}

.doc-icon {
  width: 2.2em;
  height: 2.4em;
  margin-right: 1em;
  background-size: 100% 100%;
}

.csv-icon {
  @extend .doc-icon;
  background-image: url(../../assets/knowledge-csv.png);
}

.excel-icon {
  @extend .doc-icon;
  background-image: url(../../assets/knowledge-excel.png);
}

.jsonl-icon {
  @extend .doc-icon;
  background-image: url(../../assets/knowledge-jsonl.png);
}

.md-icon {
  @extend .doc-icon;
  background-image: url(../../assets/knowledge-md.png);
}

.pdf-icon {
  @extend .doc-icon;
  background-image: url(../../assets/knowledge-pdf.png);
}

.ppt-icon {
  @extend .doc-icon;
  background-image: url(../../assets/knowledge-ppt.png);
}

.txt-icon {
  @extend .doc-icon;
  background-image: url(../../assets/knowledge-txt.png);
}

.word-icon {
  @extend .doc-icon;
  background-image: url(../../assets/knowledge-word.png);
}

:deep(.no-header .el-dialog__header) {
  display: none;
}

.create-lib-success-icon {
  background-image: url(../../assets/knowledge-create-lib-success.png);
  background-size: 100% 100%;
  width: 2.4em;
  height: 2.4em;
  margin-right: 1.6em;
}

.no-data {
  width: 18em;
  height: 18em;
  background-image: url(/images/noData.png);
  background-size: 100% 100%;
}

.ai-dark {
  .fix-text-white {
    color: white !important;
  }
  .lib-bg {
    background: linear-gradient(180deg, rgba(147, 98, 218, 0) 0%, rgba(67, 120, 255, 0.3) 100%),
      #0f121b;
  }

  .create-lib-bg {
    background: radial-gradient(
        circle at 100% -1%,
        rgba(147, 98, 218, 0.2) 0%,
        rgba(67, 120, 255, 0) 100%
      ),
      #0f121b;
  }

  .collapse-arrow {
    background-image: url(../../assets/knowledge-collapse-dark.svg);
    background-size: 100% 100%;
  }

  .guide-border {
    border: 0.1em solid #2d2e62;
    background: rgba(23, 28, 49, 0.5);
  }

  .no-lib {
    width: 23.4em;
    height: 24.7em;
    background-image: url(../../assets/knowledge-no-lib-dark.png);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  @for $i from 1 through 3 {
    .guide-img-#{$i} {
      background-image: url(../../assets/knowledge-guide-#{$i}-dark.png);
      background-size: 100% 100%;
    }
  }

  .card-bg {
    background-image: url(../../assets/knowledge-card-bg-dark.png);
    background-size: 100% 100%;
    border: none;
  }

  .tag {
    margin-left: 1.6em;
    display: flex;
    align-items: center;
    border-radius: 0.8em;
    background-color: transparent;
    padding-left: 1.3em;
    padding-right: 1.3em;
    color: #786df5;
    font-size: 1.3em;
    border: 0.1em solid #786df5;
  }

  .card-btn-border-top {
    border-top: 0.1em solid #2d2e62;
  }

  .card-btn-border-right {
    border-right: 0.1em solid #2d2e62;
  }
}

:deep(.el-dialog__body) {
  font-size: 1em;
}

:deep(.el-dialog__header) {
  font-size: 1.6em;
}

:deep(.el-dialog .el-dialog__body .upload-file .upload-file-uploader > div) {
  font-size: 1.2em !important;
}

:deep(.up-btn .upload-file-uploader .el-upload .el-button) {
  border-color: #615ced;
  background-color: #615ced;
}
:deep(.up-btn .upload-file-uploader .el-upload .el-button:hover),
:deep(.up-btn .upload-file-uploader .el-upload .el-button:focus) {
  border-color: rgb(144, 141, 242);
  background-color: rgb(144, 141, 242);
}

:deep(.el-button:focus),
:deep(.el-button:hover) {
  color: #615ced;
  border-color: #615ced;
  background-color: transparent;
}
</style>
