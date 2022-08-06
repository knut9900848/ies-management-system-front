<script setup lang="ts">
import { reactive } from 'vue';
import { Company } from '../types/Company';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import EditorModule from '../CommonEditor.vue';
import FileUpload from '../FileUpload.vue';

const props = defineProps<{
  title: string;
  editedItem: object;
}>();

const emit = defineEmits<{
  (e: 'saveCompany', company: Company): void;
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

const selectFile = (): void => {
  console.log('selectFile');
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
      <div class="row">
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
          <FileUpload @selectFile="selectFile"></FileUpload>
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
          <EditorModule
            v-model="company.description"
            :modelValue="company.description"
          ></EditorModule>
          {{ company.description }}
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn
        label="Save"
        @click="emit('saveCompany', company)"
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
