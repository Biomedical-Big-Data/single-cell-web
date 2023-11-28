<template>
  <a-modal
    v-model:open="open"
    title="Create Cell Type"
    style="width: 600px"
    @cancel="handleResetForm"
  >
    <a-form
      ref="cellTypeFormRef"
      :model="form"
      :rules="rules"
      :label-col="{ style: { width: '200px' } }"
    >
      <a-form-item
        label="cell_type_id"
        name="cell_type_id"
        required
      >
        <a-input v-model:value="form.cell_type_id"></a-input>
      </a-form-item>
      <a-form-item
        label="species_id"
        name="species_id"
        required
      >
        <a-input v-model:value="form.species_id"></a-input>
      </a-form-item>
      <a-form-item
        label="marker_gene_symbol"
        name="marker_gene_symbol"
      >
        <a-textarea v-model:value="form.marker_gene_symbol"></a-textarea>
      </a-form-item>
      <a-form-item
        label="cell_taxonomy_id"
        name="cell_taxonomy_id"
      >
        <a-input v-model:value="form.cell_taxonomy_id"></a-input>
      </a-form-item>
      <a-form-item
        label="cell_taxonomy_url"
        name="cell_taxonomy_url"
      >
        <a-input v-model:value="form.cell_taxonomy_url"></a-input>
      </a-form-item>
      <a-form-item
        label="cell_ontology_id"
        name="cell_ontology_id"
      >
        <a-input v-model:value="form.cell_ontology_id"></a-input>
      </a-form-item>
      <a-form-item
        label="cell_type_name"
        name="cell_type_name"
      >
        <a-input v-model:value="form.cell_type_name"></a-input>
      </a-form-item>
      <a-form-item
        label="cell_type_description"
        name="cell_type_description"
      >
        <a-input v-model:value="form.cell_type_description"></a-input>
      </a-form-item>
      <a-form-item
        label="cell_type_ontology_label"
        name="cell_type_ontology_label"
      >
        <a-input v-model:value="form.cell_type_ontology_label"></a-input>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button
        key="back"
        @click="handleCancel"
      >
        Cancel
      </a-button>
      <a-button
        key="submit"
        type="primary"
        :loading="loading"
        @click="handleOk"
      >
        Submit
      </a-button>
    </template>
  </a-modal>
</template>

<script setup>
import { ref } from "vue"
import { createCellType } from "@/api/meta.js"
import { message } from "ant-design-vue"

const rules = {
  cell_type_id: [{ required: true, message: "Please input cell_type_id" }],
  species_id: [{ required: true, message: "Please input species_id" }],
}

const loading = ref(false)
const open = ref(false)
const cellTypeFormRef = ref()
const form = ref({
  cell_type_id: "",
  species_id: undefined,
  marker_gene_symbol: "",
  cell_taxonomy_id: "",
  cell_taxonomy_url: "",
  cell_ontology_id: "",
  cell_type_name: "",
  cell_type_description: "",
  cell_type_ontology_label: "",
})

const openModal = (val) => {
  if (val) {
    form.value = val
  }
  open.value = true
}

const handleOk = async () => {
  try {
    loading.value = true
    await cellTypeFormRef.value.validate()
    await createCellType(form.value)
    message.success("Save success")
    handleCancel()
  } finally {
    loading.value = false
  }
}

const handleResetForm = () => {
  cellTypeFormRef.value.resetFields()
}

const handleCancel = () => {
  open.value = false
  handleResetForm()
}

defineExpose({
  openModal,
})
</script>

<style lang="scss" scoped></style>
