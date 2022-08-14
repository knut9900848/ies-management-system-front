<script setup lang="ts">
import { reactive, ref, defineExpose } from 'vue';
import { QTableProps } from 'quasar';
import { api } from '../boot/axios';
import SubCategoryEdit from './teleport/SubCategoryEdit.vue';

interface SubCategory {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
  description: string;
  category_id: number;
}

const subCategoryListOption: QTableProps['columns'] = [
  {
    name: 'id',
    label: 'ID',
    field: 'id',
    required: true,
    align: 'center',
    sortable: true,
  },
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    required: true,
    align: 'left',
    sortable: true,
  },
  {
    name: 'code',
    label: 'Code',
    field: 'code',
    required: true,
    align: 'center',
    sortable: true,
  },
  {
    name: 'is_active',
    label: 'Activation',
    field: 'is_active',
    required: true,
    align: 'center',
    sortable: true,
  },
  {
    name: 'action',
    label: 'ACTION',
    field: 'action',
    required: true,
    align: 'left',
    sortable: false,
  },
];

const subCategories = ref<SubCategory[]>([]);

const editedIndex = ref<number>(-1);
const editedItem = reactive<SubCategory>({
  id: 0,
  name: '',
  code: '',
  is_active: false,
  description: '',
  category_id: 0,
});

const resetEditedItem = reactive<SubCategory>({
  id: 0,
  name: '',
  code: '',
  is_active: false,
  description: '',
  category_id: 0,
});

const categoryId = ref<number | null>(null);

const getSubCategories = (id: number): void => {
  categoryId.value = id;

  api.get(`/admin/categories/${id}/sub-categories`).then((response) => {
    console.log(response.data);
    subCategories.value = response.data.subCategories;
  });
};

defineExpose({ getSubCategories });

const subCategoryEditModal = ref(false);

const openSubCategoryEditModal = (subCategory: SubCategory | null): void => {
  if (subCategory !== null) {
    editedIndex.value = subCategories.value.indexOf(subCategory);
    Object.assign(editedItem, subCategory);
  }

  subCategoryEditModal.value = true;
};

const closeSubCategoryEditModal = (): void => {
  subCategoryEditModal.value = false;
  Object.assign(editedItem, resetEditedItem);
  editedIndex.value = -1;
};

/**
 *
 * @param subCategory
 *
 */

const saveSubCategory = (subCategory: SubCategory): void => {
  if (editedIndex.value > -1) {
    api
      .put(
        `/admin/categories/${categoryId.value}/sub-categories/${subCategory.id}`,
        subCategory
      )
      .then((response) => {
        Object.assign(
          subCategories.value[editedIndex.value],
          response.data.subCategory
        );
        closeSubCategoryEditModal();
      });
  } else {
    api
      .post(`/admin/categories/${categoryId.value}/sub-categories`, subCategory)
      .then((response) => {
        subCategories.value.push(response.data.subCategory);
        closeSubCategoryEditModal();
      });
  }
};
</script>

<template>
  <q-table
    title="Sub Categories"
    :rows="subCategories"
    :columns="subCategoryListOption"
    row-key="name"
    separator="cell"
    color="primary"
    flat
    bordered
    square
    :rows-per-page-options="[0]"
    table-header-style="background-color: #007bff; color: #fff; font-weight: bold"
  >
    <template v-slot:top>
      <h2 class="text-h5">SUB CATEGORY</h2>
      <q-space></q-space>
      <q-btn
        v-if="categoryId"
        @click="openSubCategoryEditModal(null)"
        icon="mdi-plus"
        round
        outline
        color="primary"
        size="sm"
      ></q-btn>
    </template>

    <template v-slot:body-cell-action="props">
      <q-td key="action" :props="props" :id="props.row.id">
        <q-btn
          color="primary"
          label="Detail"
          flat
          outlie
          rounded
          @click="openSubCategoryEditModal(props.row)"
        />
      </q-td>
    </template>
  </q-table>

  <teleport to="#portal">
    <q-dialog v-model="subCategoryEditModal" persistent>
      <SubCategoryEdit
        :editedItem="editedItem"
        title="Edit Sub Category"
        subTitle="Sub title"
        @saveSubCategory="saveSubCategory"
        @closeSubCategoryEditModal="closeSubCategoryEditModal"
      />
    </q-dialog>
  </teleport>
</template>
