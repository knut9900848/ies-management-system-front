<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { api } from '../boot/axios';
import Company from './../types/Company';
import CompanyObj from './../types/CompanyObj';
import CompanyEdit from '../components/teleport/CompanyEdit.vue';
import { QTableProps } from 'quasar';

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
  logo: '',
  code: '',
  is_active: false,
  description: '',
});

const resetEditedItem = reactive<Company>({
  id: 0,
  name: '',
  logo: '',
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

const saveCompany = (companyObj: CompanyObj): void => {
  companyObj.formData.append('name', companyObj.company.name);
  companyObj.formData.append('code', companyObj.company.name);
  companyObj.formData.append('description', companyObj.company.description);
  // companyObj.formData.append('is_active', companyObj.company.is_active);
  companyObj.formData.append(
    'is_active',
    new Boolean(companyObj.company.is_active).toString()
  );

  if (editedIndex.value > -1) {
    companyObj.formData.append('_method', 'PUT');
    console.log('company', companyObj.company);
    api
      .post('/companies/1', companyObj, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((response) => {
        console.log(response.data);
        // Object.assign(companies.value[editedIndex.value], response.data.company);
        // closeCompanyEditModal();
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    api.post('/companies', companyObj.formData).then((response) => {
      companies.value.push(response.data.company);
      closeCompanyEditModal();
      console.log(response.data);
    });
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
