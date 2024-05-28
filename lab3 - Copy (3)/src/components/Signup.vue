<template>
	<div class="container mt-5 main-container">
        <div class="signup__container container">
		  <form class="signup__form" action="#">
			<div class="mb-3">
			  <label for="InputNickname1" class="form-label">Логін</label>
			  <input class="form-control" type="text" v-model="this.signup.nickname" id="InputNickname1"   placeholder="Введіть логін">
			</div>
			<div class="mb-3">
			  <label for="InputEmail1" class="form-label" >Email</label>
			  <input type="email" class="form-control" id="InputEmail1" v-model="this.signup.email" placeholder="Введіть email" aria-describedby="emailHelp">
			</div>
			<div class="mb-3">
			  <label for="InputTel1" class="form-label" >Телефон</label>
			  <input type="tel" class="form-control" id="InputTel1" v-model="this.signup.phone" placeholder="Введіть телефон">
			</div>
			<div class="mb-3">
			  <label for="InputPassword1" class="form-label" >Пароль</label>
			  <input type="password" class="form-control" id="InputPassword1" v-model="this.signup.password" placeholder="Введіть пароль">
			</div>
			<button type="submit" class="btn btn-primary" @click="this.addUser()">Ок</button>
			<button type="reset" class="btn btn-secondary">Скинути</button>
		  </form>
		</div>
		<footer class="footer bg-primary">
    		2024 ЧасоМетр ©
		</footer>
    </div>
</template>

<script>
import { ref } from 'vue';
import api from '@/services/api';
import router from '../router';

export default {
  name: 'Signup',
  
  data() {
	  return {
		  signup:{
			nickname: ref(''),
			email: ref(''),
			phone: ref(''),
			password: ref(''),
			sessions: '[]',
		  }	
	  }
  },
  methods: {
	  addUser() {
		  const user = {
			  name: this.signup.nickname,
			  email: this.signup.email, 
			  phone: this.signup.phone, 
			  password: this.signup.password, 
			  sessions: this.signup.sessions
		 };
		const res = api.addUser(user);
		alert('Реєстрація успішна!');
		router.push({ path: 'signin' })
	  }
  }
}
</script>
