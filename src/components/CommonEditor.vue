<script setup lang="ts">
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { ref, onMounted, defineProps, defineEmits } from 'vue';

const editorRef = ref();
const editor = ref<Editor | null>();
const props = defineProps<{ modelValue: string }>();
const emits = defineEmits<{ (e: 'update:modelValue', value: string): void }>();

onMounted(() => {
  editor.value = new Editor({
    el: editorRef.value as HTMLDivElement,
    height: '450px',
    initialEditType: 'wysiwyg',
    previewStyle: 'vertical',
    initialValue: props.modelValue,
    events: {
      change: () => {
        if (!editor.value) return;
        emits('update:modelValue', editor.value?.getHTML());
      },
    },
  });
});
</script>

<template>
  <div ref="editorRef" />
</template>
