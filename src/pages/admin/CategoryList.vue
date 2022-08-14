<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { api } from '../../boot/axios';
import { Category } from '../../types/Category';
import CategoryEdit from '../../components/teleport/CategoryEdit.vue';
import SubCategoryList from '../../components/SubCategoryList.vue';
import { QTableProps } from 'quasar';

const categoryListOption: QTableProps['columns'] = [
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
  {
    name: 'subCategory',
    label: 'Sub Category',
    field: 'subCategory',
    required: true,
    align: 'left',
    sortable: false,
  },
];

const categories = ref<Category[]>([]);

/**
 * Category List Initialization
 */
onMounted((): void => {
  api.get('/admin/categories').then((response) => {
    categories.value = response.data.categories;
  });
});

/**
 * Define Target item
 */
const editedIndex = ref<number>(-1);
const editedItem = reactive<Category>({
  id: 0,
  name: '',
  code: '',
  is_active: false,
  description: '',
});

const resetEditedItem = reactive<Category>({
  id: 0,
  name: '',
  code: '',
  is_active: false,
  description: '',
});

/**
 * Define Dialog
 */
const categoryEditModal = ref(false);

const openCategoryEditModal = (category: Category | null): void => {
  if (category !== null) {
    editedIndex.value = categories.value.indexOf(category);
    Object.assign(editedItem, category);
  }

  categoryEditModal.value = true;
};

const closeCategoryEditModal = (): void => {
  categoryEditModal.value = false;
  Object.assign(editedItem, resetEditedItem);
  editedIndex.value = -1;
};

/**
 * Save Category
 * @param category
 */
const saveCategory = (category: Category): void => {
  if (editedIndex.value > -1) {
    api.put(`/admin/categories/${category.id}`, category).then((response) => {
      Object.assign(
        categories.value[editedIndex.value],
        response.data.category
      );
      closeCategoryEditModal();
    });
  } else {
    api.post('/admin/categories', category).then((response) => {
      categories.value.push(response.data.category);
      closeCategoryEditModal();
    });
  }
};

/**
 * Define Child Component
 */
const childRef = ref<InstanceType<typeof SubCategoryList>>();

/**
 * Render Child Component
 * @param id
 */
const showCategories = (id: number): void => {
  editedItem.id = id;
  childRef.value?.getSubCategories(id);
};
</script>

<template>
  <div class="q-pa-md row">
    <div class="col-7 q-pa-xs">
      <q-table
        title="Treats"
        :rows="categories"
        :columns="categoryListOption"
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
          <h2 class="text-h5">CATEGORY</h2>
          <q-space></q-space>
          <q-btn
            @click="openCategoryEditModal(null)"
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
              @click="openCategoryEditModal(props.row)"
            />
          </q-td>
        </template>

        <template v-slot:body-cell-subCategory="props">
          <q-td key="subCategory" :props="props" :id="props.row.id">
            <q-btn
              color="primary"
              label="Edit Sub Category"
              flat
              outlie
              rounded
              size="xs"
              @click="showCategories(props.row.id)"
            />
          </q-td>
        </template>
      </q-table>
    </div>
    <div class="col-5 q-pa-xs">
      <SubCategoryList ref="childRef"></SubCategoryList>
    </div>
  </div>

  <teleport to="#portal">
    <q-dialog v-model="categoryEditModal" persistent>
      <CategoryEdit
        :editedItem="editedItem"
        title="Edit Company Information"
        subTitle="Sub title"
        @saveCategory="saveCategory"
        @closeCategoryEditModal="closeCategoryEditModal"
      />
    </q-dialog>
  </teleport>
</template>
