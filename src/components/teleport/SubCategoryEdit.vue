<script setup lang="ts">
import { reactive } from 'vue';
// import Company from '../../types/Company';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

interface SubCategory {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
  description: string;
  category_id: number;
}

const props = defineProps<{
  title: string;
  editedItem: object | undefined;
}>();

const emit = defineEmits<{
  (e: 'saveSubCategory', subCategory: SubCategory): void;
  (e: 'closeSubCategoryEditModal'): void;
}>();

const subCategory: SubCategory = reactive({
  id: 0,
  name: '',
  code: '',
  is_active: false,
  description: '',
  category_id: 0,
});

Object.assign(subCategory, props.editedItem);

const rules = {
  name: { required },
  code: { required },
};

const v$ = useVuelidate(rules, subCategory);
</script>

<template>
  <q-card style="max-width: 800px; width: 100%">
    <q-card-section
      class="bg-primary text-white text-uppercase row items-center"
    >
      <div>
        <div class="text-h6">{{ props.title }}</div>
        <div class="text-subtitle2">
          {{ subCategory.name ? subCategory.name : 'Add New Category' }}
        </div>
      </div>

      <q-space />

      <q-btn
        icon="close"
        flat
        round
        dense
        @click="emit('closeSubCategoryEditModal')"
      />
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-form class="row">
        <div class="col-6 q-pa-xs">
          <q-input
            label="Name *"
            v-model="subCategory.name"
            @blur="v$.name.$touch()"
            no-error-icon
            :error="v$.name.$error"
          ></q-input>
        </div>

        <div class="col-6 q-pa-xs">
          <q-input
            label="Code *"
            v-model="subCategory.code"
            @blur="v$.code.$touch()"
            no-error-icon
            :error="v$.code.$error"
          ></q-input>
        </div>

        <div class="col-12 q-pa-xs">
          <q-toggle
            label="Activation"
            v-model="subCategory.is_active"
            :true-value="1"
            :false-value="0"
          />
        </div>
        <div class="col-12 q-pa-xs">
          <q-input v-model="subCategory.description" type="textarea"></q-input>
        </div>
      </q-form>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn
        label="Save"
        @click="emit('saveSubCategory', subCategory)"
        flat
        color="primary"
        :disabled="v$.$invalid"
      ></q-btn>
      <q-btn
        label="Close"
        flat
        color="danger"
        @click="emit('closeSubCategoryEditModal')"
      ></q-btn>
    </q-card-actions>
  </q-card>
</template>
