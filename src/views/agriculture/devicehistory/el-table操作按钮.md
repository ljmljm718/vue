# 操作按钮小于等于3个

```vue
<el-table-column label="操作" align="center" fixed="right" min-width="154px">
  <template #default="scope">
    <div class="flex items-center justify-center">
      <!-- 按钮 -->
      <el-button
        link
        type="primary"
        @click="openForm('update', scope.row.id)"
        v-hasPermi="['agriculture:device-history-status:update']"
      >
        编辑
      </el-button>
      <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
      <el-button
        link
        type="danger"
        @click="handleDelete(scope.row.id)"
        v-hasPermi="['agriculture:device-history-status:delete']"
      >
        删除
      </el-button>
      <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
      <el-button
        link
        type="danger"
        @click="handleDelete(scope.row.id)"
        v-hasPermi="['agriculture:device-history-status:delete']"
      >
        删除
      </el-button>      
    </div>
  </template>
</el-table-column>
```



# 操作按钮大于3个

```vue
<el-table-column label="操作" align="center" fixed="right" min-width="154px">
  <template #default="scope">
    <div class="flex items-center justify-center">
      <!-- 显示的两个按钮 -->
      <el-button
        link
        type="primary"
        @click="openForm('update', scope.row.id)"
        v-hasPermi="['agriculture:device-history-status:update']"
      >
        编辑
      </el-button>
      <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
      <el-button
        link
        type="danger"
        @click="handleDelete(scope.row.id)"
        v-hasPermi="['agriculture:device-history-status:delete']"
      >
        删除
      </el-button>
      <div class="mx-[12px] w-[1px] h-[24px] bg-[#e6e6e6]"></div>
      
      <el-popover :width="104" trigger="hover" popper-style="min-width: 0">
        <template #reference>
          <div class="flex items-center">
            <div class="w-[2px] h-[2px] mx-[1px] rounded-full" style="background-color: var(--el-color-primary)"></div>
            <div class="w-[2px] h-[2px] mx-[1px] rounded-full" style="background-color: var(--el-color-primary)"></div>
            <div class="w-[2px] h-[2px] mx-[1px] rounded-full" style="background-color: var(--el-color-primary)"></div>
          </div>
        </template>

        <div class="flex flex-col items-start space-y-[8px] space-x-0">
          
          <!-- 隐藏的其他按钮 -->
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:device-history-status:delete']"
          >
            删除
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:device-history-status:delete']"
          >
            删除
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['agriculture:device-history-status:delete']"
          >
            删除
          </el-button>
        </div>
      </el-popover>
    </div>
  </template>
</el-table-column>
```

