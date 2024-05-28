<template>
	<div class="container mt-5 profile-container">
		<div class="profile">
			<table class="profile__table table table-primary">
				<tbody>
				  <tr>
					<th>Логін</th>
					<td>{{this.user.name}}</td>
				  </tr>
				  <tr>
					<th>Email</th>
					<td>{{this.user.email}}</td>
				  </tr>
				  <tr>
					<th>Телефон</th>
					<td>{{this.user.phone}}</td>
				  </tr>
				  <tr>
					<th>Статистика</th>
					<td v-html="this.user.stat"></td>
				  </tr>
				</tbody>
			  </table>
		</div>
		<footer class="footer bg-primary">
			2024 ЧасоМетр ©
		</footer>
	</div>
</template>

<script>
import store from '../store';

export default {
  name: 'Profile',
  
  data() {
	return {
		user: {
			name: '-',
			email: '-',
			phone: '-',
			stat: '-',
		}
	}
  },
  
  mounted() {
		if (store.state.currentUser !== null) {
			this.user.name = store.state.currentUser.name;
			this.user.email = store.state.currentUser.email;
			this.user.phone = store.state.currentUser.phone;
			this.calculateStat();
		}
	},
	
  methods: {
	  calculateStat() {
		 if (JSON.parse(store.state.currentUser.sessions).length) {
			 this.user.stat = `Кількість сеансів: ${JSON.parse(store.state.currentUser.sessions).length}
			 <br>Найдовший сеанс: ${this.formatTime(JSON.parse(store.state.currentUser.sessions).reduce((max, current) => {
			return max.totalDuration > current.totalDuration ? max : current;
			}).totalDuration)}
				<br>Найкоротший сеанс: ${this.formatTime(JSON.parse(store.state.currentUser.sessions).reduce((min, current) => {
				return min.totalDuration < current.totalDuration ? min : current;
			}).totalDuration)}`;
			
			const totalDurationSum = JSON.parse(store.state.currentUser.sessions).reduce((sum, current) => {return sum + current.totalDuration;}, 0);
			const averageTotalDuration = totalDurationSum / JSON.parse(store.state.currentUser.sessions).length;
			
			this.user.stat += `<br>Середня тривалість сеансів: ${this.formatTime(averageTotalDuration)}`;
		 }
		 else {
			 this.user.stat = '-';
		 }
	  },
	  
	  formatTime(time) {
		const hours = Math.floor(time / 3600000)
		  .toString()
		  .padStart(2, '0');
		const minutes = Math.floor((time % 3600000) / 60000)
		  .toString()
		  .padStart(2, '0');
		const seconds = Math.floor((time % 60000) / 1000)
		  .toString()
		  .padStart(2, '0');
		return `${hours}:${minutes}:${seconds}`;
	  }
  }
}
</script>
