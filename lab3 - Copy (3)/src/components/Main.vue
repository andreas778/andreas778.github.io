<template>
  <div class="container mt-5 main-container">
        <div class="row">
            <div class="col">
                <h1>Таймер</h1>
                <div id="timer">{{this.timer.currentTime}}</div>
                <div class="mt-3">
                    <button id="startBtn" class="btn btn-primary" @click="this.startTimer()">Старт</button>
                    <button id="pauseBtn" class="btn btn-secondary" @click="pauseTimer()">Пауза</button>
                    <button id="stopBtn" class="btn btn-danger" @click="stopTimer()">Стоп</button>
                    <button id="saveBtn" class="btn btn-success" @click="saveSession()">Зберегти</button>
                </div>
            </div>
            <div class="col">
                <h1>Інформація про робочий час</h1>
                <p id="workLog" v-html="this.timer.workLog"></p>
                <h1>Історія сеансів</h1>
                <ul id="sessionHistory" v-html="this.timer.sessionHistory"></ul>
            </div>
        </div>
		<footer class="footer bg-primary">
    		2024 ЧасоМетр ©
		</footer>
    </div>
</template>

<script>
import api from '@/services/api';
import store from '../store';

export default {
  name: 'Main', 
  data() {
		return {
			timer:{
				startTime: 0,
				startTimeDate: 0,
				currentTime: this.formatTime(0),
				pauseTime: null,
				pauseDurations: [],
				currentSession: {
				  startTime: null,
				  pauseDurations: []
				},
				sessions: [],
				timeoutId: null,
				workLog: ``,
				sessionHistory: ``,
			}
		}
	},
	
	mounted() {
		if (store.state.currentUser !== null) {
			this.timer.sessions = JSON.parse(store.state.currentUser.sessions);
			
			this.timer.sessions.forEach((session) => {
				this.updateSessionHistory(session)
			});
		}
	},
	
	methods: {		
		startTimer() {
			//this.fetchUsers();
			if (this.timer.startTime === 0 || this.timer.pauseTime !== null) {
				if (this.timer.pauseTime !== null) {
					this.resumeTimer();
				}
				else {
					this.timer.currentSession.startTime = new Date();
					this.timer.workLog = `Початок: ${this.formatDateTime(this.timer.currentSession.startTime)}`;
				}
				this.timer.currentTime = this.formatTime(this.timer.startTime);
				this.countTimer ();
			}
		},
	  
	  countTimer () {
			this.timer.timeoutId = setTimeout(() => {
				this.timer.startTime += 1000;
				this.timer.currentTime = this.formatTime(this.timer.startTime);
				this.countTimer()
			}, 1000)             
	  },
		
	  pauseTimer() {
		  if (this.timer.pauseTime === null && this.timer.startTime > 0) {
			this.timer.pauseTime = new Date();
			clearTimeout(this.timer.timeoutId);	
		  }
	  },

	  resumeTimer() {
		if (!this.timer.pauseDurations.length){
			 this.timer.workLog += `<br>Паузи:`
		}
		const pauseDuration = {
			pauseStartTime: this.timer.pauseTime,
			pauseEndTime: new Date()
		};
		this.timer.pauseDurations.push(pauseDuration);
		this.timer.currentSession.pauseDurations.push(pauseDuration);
		this.timer.workLog += `<li>${this.formatDateTime(this.timer.pauseTime)} - ${this.formatDateTime(new Date())}</li>`;
		this.timer.pauseTime = null;
	  },
	  
	  
	saveUserSession() {
		store.state.currentUser.sessions = JSON.stringify(this.timer.sessions);
		const response = api.updateUserSessions(store.state.currentUser.name, store.state.currentUser.sessions);
	  },
	  
	stopTimer() {
		if (confirm('Чи бажаєте ви зберегти сеанс?')) {		
			if (store.state.currentUser === null) {
				alert('Для ціє дії треба увійти!');
				return;
			}
			const sessionName = prompt('Введіть назву сеансу:');
			if (sessionName) {
				const endTime = new Date();
				const totalDuration = endTime.getTime() - this.timer.currentSession.startTime.getTime();
				const session = {
					name: sessionName,
					startTime: this.timer.currentSession.startTime,
					pauseDurations: this.timer.currentSession.pauseDurations,
					endTime: endTime,
					totalDuration: totalDuration
				};
				this.updateSessionHistory(session);
				this.timer.sessions.push(session);
				this.saveUserSession();
			}
		}
		clearTimeout(this.timer.timeoutId);
		this.resetTimer();	
	},
	
		
	saveSession() {
		if (store.state.currentUser === null) {
			alert('Для ціє дії треба увійти!');
			return;
		}
		const sessionName = prompt('Введіть назву сеансу:');
		if (sessionName) {
			const currentTime = new Date();
			const session = {
				name: sessionName,
				startTime: this.timer.currentSession.startTime,
				pauseDurations: this.timer.currentSession.pauseDurations,
				endTime: currentTime,
				totalDuration: currentTime.getTime() - this.timer.currentSession.startTime.getTime()
			};
			this.updateSessionHistory(session);
			this.timer.sessions.push(session);
			this.saveUserSession();
		}
	},

	updateSessionHistory(session) {
		const startTime = new Date(session.startTime);
		const endTime = new Date(session.endTime);
		const totalDuration = new Date(session.totalDuration);
		const pauseDurations = session.pauseDurations;
		if (pauseDurations.length) {
			this.timer.sessionHistory += `<li>${session.name}<br>Початок: ${this.formatDateTime(startTime)}<br>Паузи:<ul>`;
			pauseDurations.forEach(pauseDuration => {
				this.timer.sessionHistory += `<li>${this.formatDateTime(pauseDuration.pauseStartTime)} - ${this.formatDateTime(pauseDuration.pauseEndTime)}</li>`;
			});
		}
		else {
			this.timer.sessionHistory += `<li>${session.name}<br>Початок: ${this.formatDateTime(startTime)}<ul>`;
		}

		this.timer.sessionHistory += `</ul>Завершено: ${this.formatDateTime(endTime)}
		<br>Тривалість: ${this.formatTime(totalDuration)} </li>`;
	},

	  resetTimer() {
		this.timer.startTime = 0;
		this.timer.pauseTime = null;
		this.timer.currentTime = this.formatTime(0),
		this.timer.pauseDurations = [];
		this.timer.currentSession = {
		  startTime: null,
		  pauseDurations: []
		};
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
	  },

	  formatDateTime(dateTime) {
		dateTime = new Date(new Date);
		const year = dateTime.getFullYear();
		const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
		const day = dateTime.getDate().toString().padStart(2, '0');
		const hours = dateTime.getHours().toString().padStart(2, '0');
		const minutes = dateTime.getMinutes().toString().padStart(2, '0');
		const seconds = dateTime.getSeconds().toString().padStart(2, '0');
		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
	  },
	}
}
</script>


