<template>
  <q-input v-model="user.email" label="Login"></q-input>
  <q-input v-model="user.password" label="Password"></q-input>
  <q-btn label="Login" @click="login" />
</template>

<script lang="ts">
import axios from 'axios';
import { api } from 'src/boot/axios';
import { defineComponent, reactive } from 'vue';
import User from '../../types/User';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const user = reactive<User>({
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

    const router = useRouter();

    const login = () => {
      axios
        .get('http://localhost/sanctum/csrf-cookie')
        .then(() => {
          api
            .post('/auth/login', {
              email: user.email,
              password: user.password,
            })
            .then((response2) => {
              localStorage.setItem('email', response2.data.user.email);
              localStorage.setItem('token', response2.data.token);
              router.push({ name: 'user.list' });
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => {
          console.log(error);
        });
    };

    return {
      user,
      login,
    };
  },
});
</script>
