<script setup lang="ts">
import { reactive } from 'vue';
import { Category } from '../../types/Category';
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

const props = defineProps<{
  title: string;
  editedItem: object | undefined;
}>();

const emit = defineEmits<{
  (e: 'saveCategory', category: Category): void;
  (e: 'closeCategoryEditModal'): void;
}>();

const category: Category = reactive({
  id: 0,
  name: '',
  code: '',
  is_active: false,
  description: '',
});

Object.assign(category, props.editedItem);

const rules = {
  name: { required },
  code: { required },
};

const v$ = useVuelidate(rules, category);
</script>

<template>
  <q-card style="max-width: 800px; width: 100%">
    <q-card-section
      class="bg-primary text-white text-uppercase row items-center"
    >
      <div>
        <div class="text-h6">{{ props.title }}</div>
        <div class="text-subtitle2">
          {{ category.name ? category.name : 'Add New Asset Category' }}
        </div>
      </div>

      <q-space />

      <q-btn
        icon="close"
        flat
        round
        dense
        @click="emit('closeCategoryEditModal')"
      />
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-form class="row">
        <div class="col-6 q-pa-xs">
          <q-input
            label="Name *"
            v-model="category.name"
            @blur="v$.name.$touch()"
            no-error-icon
            :error="v$.name.$error"
          ></q-input>
        </div>

        <div class="col-6 q-pa-xs">
          <q-input
            label="Code *"
            v-model="category.code"
            @blur="v$.code.$touch()"
            no-error-icon
            :error="v$.code.$error"
          ></q-input>
        </div>

        <div class="col-12 q-pa-xs">
          <q-toggle
            label="Activation"
            v-model="category.is_active"
            :true-value="1"
            :false-value="0"
          />
        </div>
        <div class="col-12 q-pa-xs">
          <q-input v-model="category.description" type="textarea"></q-input>
        </div>
      </q-form>
    </q-card-section>

    <q-separator />

    <q-card-actions align="right">
      <q-btn
        label="Save"
        @click="emit('saveCategory', category)"
        flat
        color="primary"
        :disabled="v$.$invalid"
      ></q-btn>
      <q-btn
        label="Close"
        flat
        color="danger"
        @click="emit('closeCategoryEditModal')"
      ></q-btn>
    </q-card-actions>
  </q-card>
</template>
