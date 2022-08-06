<script setup lang="ts">
import { ref, Ref } from 'vue';

const props = defineProps<{
  accept: string;
}>();

const emit = defineEmits<{
  (e: 'attachFiles', files: Ref<Blob[]>): void;
}>();

const files: Ref<Blob[]> = ref([]);

const selectFiles = (): void => {
  emit('attachFiles', files);
};
</script>

<template>
  <q-file
    v-model="files"
    label="Select image"
    @update:model-value="selectFiles"
    multiple
    use-chips
    max-files="1"
    :accept="props.accept"
  >
    <template #prepend>
      <q-icon name="mdi-attachment"></q-icon>
    </template>
  </q-file>
</template>
