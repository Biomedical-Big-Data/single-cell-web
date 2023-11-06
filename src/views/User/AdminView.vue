<template>
  <div class="p-5">
    <div class="bg-white py-2 px-4 rounded-lg">
      <a-form :model="conditions" layout="inline" autocomplete="off">
        <a-form-item label="用户名" name="user_name">
          <a-input
            v-model:value="conditions.user_name"
            class="w-28"
            placeholder="用户名"
          ></a-input>
        </a-form-item>
        <a-form-item label="组织" name="organization">
          <a-input
            v-model:value="conditions.organization"
            class="w-28"
            placeholder="组织"
          ></a-input>
        </a-form-item>
        <a-form-item label="邮箱" name="email_address">
          <a-input
            v-model:value="conditions.email_address"
            class="w-28"
            placeholder="邮箱"
          ></a-input>
        </a-form-item>
        <a-form-item label="状态" name="state">
          <a-select
            v-model:value="conditions.state"
            :options="USER_STATUS"
            placeholder="用户状态"
            class="w-28"
            allow-clear
          ></a-select>
        </a-form-item>
        <a-form-item label="注册时间" name="create_at">
          <a-date-picker
            v-model:value="conditions.create_at"
            placeholder="注册时间"
            class="w-32"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            class="flex items-center"
            @click="handleSearch"
          >
            <template #icon>
              <SearchOutlined></SearchOutlined>
            </template>
            查询
          </a-button>
        </a-form-item>
      </a-form>
    </div>

    <div class="mt-5 rounded-lg bg-white">
      <a-table
        :columns="columns"
        :row-key="(record) => record.id"
        :data-source="list"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column: { dataIndex }, text, record }">
          <template v-if="dataIndex === 'create_at'">
            {{ dayjs(text).format("YYYY-MM-DD") }}
          </template>
          <template v-if="dataIndex === 'state'">
            {{ getStateName(text) }}
          </template>
          <template v-if="dataIndex === 'operation'">
            <a-button
              type="primary"
              
              @click="handleUpdateUserPasswordModalOpen(record)"
            >
              重设密码
            </a-button>
            <a-button
              v-if="record.state === 1"
              type="primary"
              danger
              
              class="ml-2"
              @click="handleUpdateUserState(record, -1)"
            >
              禁用
            </a-button>
            <a-button
              v-if="record.state === -1"
              type="primary"
              danger
              
              class="ml-2"
              @click="handleUpdateUserState(record, 1)"
            >
              启用
            </a-button>
          </template>
        </template>
      </a-table>
    </div>
  </div>
  <a-modal
    v-model:open="open"
    title="重置密码"
    @ok="handleUpdateUserPassword"
    @cancel="handleClearCurrentUser"
  >
    <div class="py-4">
      <a-input-password
        v-model:value="currentUser.password"
        placeholder="输入重置密码"
      ></a-input-password>
    </div>
  </a-modal>
</template>

<script setup>
import { computed, createVNode, ref } from "vue"
import {
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons-vue"
import { usePagination } from "vue-request"
import { updateUserState, getUserList, updateUserPassword } from "@/api/user"
import dayjs from "dayjs"
import { message, Modal } from "ant-design-vue"

const conditions = ref({
  user_name: "",
  organization: "",
  email_address: "",
  state: undefined,
  create_at: "",
})

const open = ref(false)
const currentUser = ref({})

const USER_STATUS = [
  {
    label: "正常",
    value: 1,
  },
  {
    label: "未激活",
    value: 0,
  },
  {
    label: "禁用",
    value: -1,
  },
]

const getStateName = function (state) {
  return USER_STATUS.find((item) => item.value === state)?.label
}

const columns = [
  {
    title: "用户名",
    dataIndex: "user_name",
  },
  {
    title: "邮箱",
    dataIndex: "email_address",
  },
  {
    title: "组织",
    dataIndex: "organization",
  },
  {
    title: "状态",
    dataIndex: "state",
    width: 100,
  },
  {
    title: "创建时间",
    dataIndex: "create_at",
    width: 120,
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: 160,
  },
]

const {
  data: dataSource,
  run,
  loading,
  current,
  pageSize,
  total,
} = usePagination(getUserList, {
  defaultParams: [
    {
      page_size: 20,
    },
  ],
  pagination: {
    currentKey: "page",
    pageSizeKey: "page_size",
  },
})

const list = computed(() => {
  return dataSource?.value?.user_list || []
})

const getConditions = function () {
  const result = {}
  const { user_name, organization, email_address, state, create_at } =
    conditions.value

  if (user_name) {
    result.user_name = user_name
  }
  if (organization) {
    result.organization = organization
  }
  if (email_address) {
    result.email_address = email_address
  }
  if (!isNaN(state)) {
    result.state = state
  }
  if (create_at) {
    result.create_at = dayjs(create_at).format("YYYY-MM-DD")
  }
  return result
}

const pagination = computed(() => ({
  total: total.value,
  current: current.value,
  pageSize: pageSize.value,

}))

const handleTableChange = (pag, filters, sorter) => {
  run({
    results: pag.pageSize,
    page: pag?.current,
    sortField: sorter.field,
    sortOrder: sorter.order,
    ...filters,
    ...getConditions(),
  })
}

const handleSearch = () => {
  run({
    page: current,
    page_size: pageSize,
    ...getConditions(),
  })
}

const handleUpdateUserPasswordModalOpen = (record) => {
  open.value = true
  currentUser.value = record
}

const handleClearCurrentUser = async () => {
  open.value = false
  currentUser.value = {}
  Modal.destroyAll()
}

const handleUpdateUserPassword = async () => {
  try {
    await updateUserPassword(currentUser.value.id, currentUser.value.password)
    message.success("操作成功")
    return true
  } finally {
    open.value = false
    currentUser.value = {}
  }
}

const handleUpdateUserState = (record, nextState) => {
  Modal.confirm({
    title:
      nextState === -1
        ? `确认禁用${record.user_name}?`
        : `确认启用${record.user_name}?`,
    icon: createVNode(ExclamationCircleOutlined),
    content:
      nextState === -1
        ? "该操作会禁止用户登录和项目操作"
        : "该操作会允许用户登录和项目操作",
    okButtonProps: {
    
    },
    cancelButtonProps: {
    
    },
    onOk: async () => {
      try {
        await updateUserState(record.id, nextState)
        message.success("操作成功")
        return true
      } finally {
        run({
          page: current,
          page_size: pageSize,
          ...getConditions(),
        })
      }
    },
    onCancel() {},
  })
}
</script>

<style scoped lang="scss">
:deep(.w-28) {
  width: 7rem !important;
}
</style>
