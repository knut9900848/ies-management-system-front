<script setup lang="ts">
import { reactive, ref, Ref } from 'vue';
import Company from '../../types/Company';
import CompanyObj from '../../types/CompanyObj';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

const props = defineProps<{
  title: string;
  editedItem: object;
}>();

const emit = defineEmits<{
  (e: 'saveCompany', companyObj: CompanyObj): void;
  (e: 'closeCompanyEditModal'): void;
}>();

const company: Company = reactive({
  id: 0,
  name: '',
  logo: '',
  code: '',
  is_active: false,
  description: '',
});

Object.assign(company, props.editedItem);

const rules = {
  name: { required },
  code: { required },
};

const v$ = useVuelidate(rules, company);

const selectedFiles: Ref<Blob[]> = ref([]);

const formData = new FormData();

const selectFile = (): void => {
  selectedFiles.value.forEach((item, index) => {
    formData.append(`selectedFiles[${index}]`, item);
  });

  // formData.append('_method', 'patch');

  // for (const [key, value] of formData) {
  //   console.log('»', key, value);
  // }
};
</script>

<template>
  <q-card style="max-width: 800px; width: 100%">
    <q-card-section
      class="bg-primary text-white text-uppercase row items-center"
    >
      <div>
        <div class="text-h6">{{ props.title }}</div>
        <div class="text-subtitle2">
          {{ company.name ? company.name : 'Add New Client' }}
        </div>
      </div>

      <q-space />

      <q-btn
        icon="close"
        flat
        round
        dense
        @click="emit('closeCompanyEditModal')"
      />
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-form class="row">
        <div class="col-6 q-pa-xs">
          <q-input
            label="Name *"
            v-model="company.name"
            @blur="v$.name.$touch()"
            no-error-icon
            :error="v$.name.$error"
          ></q-input>
        </div>

        <div class="col-6 q-pa-xs">
          <q-input
            label="Code *"
            v-model="company.code"
            @blur="v$.code.$touch()"
            no-error-icon
            :error="v$.code.$error"
          ></q-input>
        </div>

        <div class="col-12 q-pa-xs">
          <q-file
            v-model="selectedFiles"
            label="Upload Image File"
            @update:model-value="selectFile"
            multiple
          >
            <template #prepend>
              <q-icon name="mdi-attachment"></q-icon>
            </template>
          </q-file>
        </div>
        <div class="col-12 q-pa-xs">
          <q-toggle
            label="Activation"
            v-model="company.is_active"
            :true-value="1"
            :false-value="0"
          />
        </div>
        <div class="col-12 q-pa-xs">
          <q-input v-model="company.description" type="textarea"></q-input>
        </div>
      </q-form>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn
        label="Save"
        @click="emit('saveCompany', { company: company, formData: formData })"
        flat
        color="primary"
        :disabled="v$.$invalid"
      ></q-btn>
      <q-btn
        label="Close"
        flat
        color="danger"
        @click="emit('closeCompanyEditModal')"
      ></q-btn>
    </q-card-actions>
  </q-card>
</template>
