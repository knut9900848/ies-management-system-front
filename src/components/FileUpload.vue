<script setup lang="ts">
import { ref, Ref } from 'vue';

const emit = defineEmits<{
  (e: 'attachFiles', selectedFiles: Ref<Blob[]>): void;
}>();

const selectedFiles: Ref<Blob[]> = ref([]);

// const formData = new FormData();

const selectFiles = (): void => {
  // selectedFiles.value.forEach((item, index) => {
  //   formData.append(`selectedFiles[${index}]`, item);
  // });

  emit('attachFiles', selectedFiles);
};
</script>

<template>
  <q-file
    v-model="selectedFiles"
    label="Select logo image"
    @update:model-value="selectFiles"
    multiple
  >
    <template #prepend>
      <q-icon name="mdi-attachment"></q-icon>
    </template>
  </q-file>
</template>
