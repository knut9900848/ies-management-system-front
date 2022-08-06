<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { api } from '../boot/axios';
// import Company from './../types/Company';
import CompanyEdit from '../components/teleport/CompanyEdit.vue';
import { QTableProps } from 'quasar';

interface Company {
  id: number;
  name: string;
  image: string;
  code: string;
  is_active: boolean;
  description: string;
}

interface Param {
  company: Company;
  formData: FormData;
}

const CompanyListOption: QTableProps['columns'] = [
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

const companies = ref<Company[]>([]);

onMounted((): void => {
  api.get('/companies').then((response) => {
    companies.value = response.data.companies;
    console.log(companies.value);
  });
});

const editedIndex = ref<number>(-1);
const editedItem = reactive<Company>({
  id: 0,
  name: '',
  image: '',
  code: '',
  is_active: false,
  description: '',
});

const resetEditedItem = reactive<Company>({
  id: 0,
  name: '',
  image: '',
  code: '',
  is_active: false,
  description: '',
});

const companyEditModal = ref(false);

const openCompanyEditModal = (company: Company | null): void => {
  if (company !== null) editedIndex.value = companies.value.indexOf(company);
  Object.assign(editedItem, company) ?? company;
  companyEditModal.value = true;
};

const closeCompanyEditModal = (): void => {
  companyEditModal.value = false;
  Object.assign(editedItem, resetEditedItem);
  editedIndex.value = -1;
};

const saveCompany = async (param: Param): Promise<void> => {
  if (editedIndex.value > -1) {
    try {
      const response = await api.put(
        `/companies/${param.company.id}`,
        param.company
      );
      Object.assign(companies.value[editedIndex.value], response.data.company);

      if (param.formData.get('attached') === 'yes') {
        console.log('files');
        param.formData.append('model', 'Company');
        param.formData.append('modelId', response.data.company.id);
        param.formData.append('storage', 'company_image');

        const fileResponse = await api.post('/files', param.formData);
        companies.value[editedIndex.value].image = fileResponse.data.image;
      }

      closeCompanyEditModal();
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      const response = await api.post('/companies', param.company);
      companies.value.push(response.data.company);

      if (param.formData.get('attached') === 'yes') {
        param.formData.append('model', 'Company');
        param.formData.append('modelId', response.data.company.id);
        param.formData.append('storage', 'company_image');

        const fileResponse = await api.post('/files', param.formData);
        editedIndex.value = companies.value.findIndex(
          (item) => item.id === response.data.company.id
        );

        companies.value[editedIndex.value].image = fileResponse.data.image;
      }

      closeCompanyEditModal();
    } catch (error) {
      console.log(error);
    }
  }
};
</script>

<template>
  <div class="q-pa-md">
    <q-table
      title="Treats"
      :rows="companies"
      :columns="CompanyListOption"
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
        <h2 class="text-h5">CLIENTS v{{ $q.version }}</h2>
        <q-space></q-space>
        <q-btn
          @click="openCompanyEditModal(null)"
          icon="mdi-plus"
          round
          outline
          color="primary"
          size="sm"
        ></q-btn>
      </template>

      <template v-slot:body-cell-name="props">
        <q-td key="name" :props="props" :id="props.row.id">
          <q-img
            v-if="props.row.image"
            :src="`http://localhost/storage/company/images/${props.row.image}`"
            style="width: 35px; height: 35px"
          ></q-img>
          <q-img
            v-else
            src="../assets/images/default_logo.png"
            style="width: 35px; height: 35px"
          ></q-img>
          <span class="q-ml-sm">{{ props.row.name }}</span>
        </q-td>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td key="action" :props="props" :id="props.row.id">
          <q-btn
            color="primary"
            label="Detail"
            flat
            outlie
            rounded
            @click="openCompanyEditModal(props.row)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
  <teleport to="#portal">
    <q-dialog v-model="companyEditModal" persistent>
      <CompanyEdit
        :editedItem="editedItem"
        title="Edit Company Information"
        subTitle="Sub title"
        @saveCompany="saveCompany"
        @closeCompanyEditModal="closeCompanyEditModal"
      />
    </q-dialog>
  </teleport>
</template>
