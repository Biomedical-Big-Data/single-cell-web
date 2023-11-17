<template>
  <div class="list-container">
    <NavBar></NavBar>
    <div class="body-container">
      <div class="title-container">User Manage</div>
      <div class="content-container">
        <div class="search-container">
          <a-form :model="conditions" layout="vertical" autocomplete="off">
            <a-form-item
              label="User name"
              name="user_name"
              class="condition-item"
            >
              <a-input
                v-model:value="conditions.user_name"
                class="w-full"
                size="large"
                placeholder="User name"
              ></a-input>
            </a-form-item>
            <a-form-item
              label="Organization"
              name="organization"
              class="condition-item"
            >
              <a-input
                v-model:value="conditions.organization"
                class="w-full"
                size="large"
                placeholder="Organization"
              ></a-input>
            </a-form-item>
            <a-form-item
              label="Email"
              name="email_address"
              class="condition-item"
            >
              <a-input
                v-model:value="conditions.email_address"
                class="w-full"
                size="large"
                placeholder="Email"
              ></a-input>
            </a-form-item>
            <a-form-item label="Status" name="state" class="condition-item">
              <a-select
                v-model:value="conditions.state"
                :options="USER_STATUS"
                placeholder="Status"
                class="w-full"
                size="large"
                allow-clear
              ></a-select>
            </a-form-item>
            <a-form-item
              label="Create date"
              name="create_at"
              class="condition-item"
            >
              <a-date-picker
                v-model:value="conditions.create_at"
                placeholder="Create date"
                class="w-full"
                size="large"
              />
            </a-form-item>
            <div class="action">
              <a-button type="primary" class="search" @click="handleSearch">
                Search all
              </a-button>
            </div>
          </a-form>
        </div>

        <div class="table-container">
          <a-table
            size="large"
            :columns="columns"
            bordered
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
                  type="link"
                  size="large"
                  @click="handleUpdateUserPasswordModalOpen(record)"
                >
                  重设密码
                </a-button>
                <a-button
                  v-if="record.state === 1"
                  type="link"
                  danger
                  size="large"
                  class="ml-2"
                  @click="handleUpdateUserState(record, -1)"
                >
                  禁用
                </a-button>
                <a-button
                  v-if="record.state === -1"
                  type="link"
                  size="large"
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
import { ExclamationCircleOutlined } from "@ant-design/icons-vue"
import { usePagination } from "vue-request"
import { updateUserState, getUserList, updateUserPassword } from "@/api/user"
import dayjs from "dayjs"
import { message, Modal } from "ant-design-vue"
import NavBar from "@/components/NavBar.vue"

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
    title: "User name",
    dataIndex: "user_name",
  },
  {
    title: "Email",
    dataIndex: "email_address",
  },
  {
    title: "Organization",
    dataIndex: "organization",
  },
  {
    title: "Status",
    dataIndex: "state",
    width: "120px",
  },
  {
    title: "Created Date",
    dataIndex: "create_at",
    width: "120px",
  },
  {
    title: "Operation",
    dataIndex: "operation",
    width: "230px",
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
    page_size: pag.pageSize,
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
    okButtonProps: {},
    cancelButtonProps: {},
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
@import "@/assets/styles/stable.scss";
</style>
