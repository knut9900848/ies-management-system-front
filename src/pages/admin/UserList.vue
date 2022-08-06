<template>
  <h1>User</h1>
  <div>{{ users }}</div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { api } from '../../boot/axios';
import User from '../../types/User';

let users = reactive<User>({
  id: 0,
  name: '',
  email: '',
  email_verified_at: '',
  two_factor_confirmed_at: null,
  two_factor_recovery_codes: null,
  created_at: '',
  updated_at: '',
  password: '',
});

api.get('/user').then((response) => {
  console.log(response.data);
  Object.assign(users, response.data);
  console.log('User', users);
});
</script>
