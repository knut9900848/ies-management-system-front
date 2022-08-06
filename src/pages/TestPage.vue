<script setup lang="ts">
import { ref } from 'vue';
import EditorModule from '../components/CommonEditor.vue';

const text = ref('내용을 입력해 주세요.');
const submit = (): void => {
  console.log(text.value);
};
</script>

<template>
  <h2>File upload2</h2>
  <EditorModule v-model="text" />
  <q-card>{{ text }}</q-card>
  <q-btn label="submit" @click="submit"></q-btn>
</template>
