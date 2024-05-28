<template>
	<div class="container mt-5 main-container">
        <div class="page__signin signin">
            <div class="signin__container container">
              <form class="main-login__form" action="#">
                <div class="mb-3">
                  <label for="InputLogin" class="form-label">Логін</label>
                  <input class="form-control" type="text" v-model="this.signin.nickname" id="InputLogin" placeholder="Введіть логін">
                </div>
                <div class="mb-3">
                  <label for="InputPassword1" class="form-label">Пароль</label>
                  <input type="password" class="form-control" v-model="this.signin.password" id="InputPassword1" placeholder="Введіть пароль">
                </div>
                <button type="submit" class="btn btn-primary" @click="this.logUser()">Увійти</button>
                <button type="reset" class="btn btn-secondary">Скинути</button>
              </form>
            </div>
          </div>
		<footer class="footer bg-primary">
    		2024 ЧасоМетр ©
		</footer>
    </div>
</template>

<script>

import { ref } from 'vue';
import api from '@/services/api';
import store from '../store';
import router from '../router';

export default {
  name: 'Signin',
  
  data() {
	  return {
		  signin:{
			nickname: ref(''),
			password: ref(''),
		  }	
	  }
  },
  methods: {
	  async logUser() {
		  const user = {
			  name: this.signin.nickname,
			  password: this.signin.password, 
		 };
		const response = await api.getUserByName(user.name);
		const userData = response.data.data;
		if (!userData) {
			alert('Логін не знайдено!');
			router.push({ path: 'signin' });
		}
		else if (user.name === userData.name && user.password === userData.password) {
		  store.state.currentUser = userData;
		  router.push({ path: 'profile' })
		  alert('Вхід успішний!');
		}
		else if (user.name === userData.name && user.password !== userData.password) {
		  alert('Пароль неправильний!');
			router.push({ path: 'signin' });
		}
	  }
  }
}
</script>
