class UserModel {
  constructor() {
    this.users = this.getUsers() || [];
  }

  saveUser(user) {
	user.sessions = [];
    this.users.push(user);
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  getUsers() {
    return JSON.parse(localStorage.getItem('users'));
  }

  getUser(login) {
    return this.users.find(user => user.nickname === login);
  }
}


class SignupView {
  constructor(model) {
    this.model = model;
    this.form = document.querySelector('.signup__form');
	if (this.form){
		this.form.addEventListener('submit', this.handleSubmit.bind(this));
	}
  }

  handleSubmit(event) {
    event.preventDefault();

    const nickname = document.getElementById('InputNickname1').value;
    const email = document.getElementById('InputEmail1').value;
    const phone = document.getElementById('InputTel1').value;
    const password = document.getElementById('InputPassword1').value;

    const user = { nickname, email, phone, password };
    this.model.saveUser(user);
    alert('Реєстрація успішна!');
    this.form.reset();
  }
}


class SigninView {
  constructor(model) {
    this.model = model;
    this.form = document.querySelector('.main-login__form');
	if (this.form){
		this.form.addEventListener('submit', this.handleSubmit.bind(this));
	}
  }

  handleSubmit(event) {
    event.preventDefault();

    const login = document.getElementById('InputLogin').value;
    const password = document.getElementById('InputPassword1').value;

    const user = this.model.getUser(login);
    if (!user) {
      alert('Логін не знайдено!');
    } else if (user.nickname === login && user.password === password) {
      alert('Вхід успішний!');
	  localStorage.setItem('currentUser', login);
      window.location.href = 'profile.html';
    } else if (user.nickname === login && user.password !== password) {
      alert('Пароль неправильний!');
    }

    this.form.reset();
  }
}

class SigninController {
  constructor() {
    this.model = new UserModel();
    this.view = new SigninView(this.model);
  }
}

class SignupController {
  constructor() {
    this.model = new UserModel();
    this.view = new SignupView(this.model);
  }
}

class ProfileView {
  constructor(model) {
    this.model = model;
	this.table = document.querySelector('.profile__table');
	
	console.log(this.table); 

	window.onload = this.handleLoad.bind(this);
  }
  
  calculateStat() {
	  const currentUser = localStorage.getItem('currentUser');
	  
	  let stat = `<li>Кількість сеансів: ${this.model.getUser(currentUser).sessions.length}</li>
	  <li>Найдовший сеанс: ${Math.floor(this.model.getUser(currentUser).sessions.reduce((max, current) => {
    return max.totalDuration > current.totalDuration ? max : current;
}).totalDuration / 60000)} хвилин</li>
	<li>Найкоротший сеанс: ${Math.floor(this.model.getUser(currentUser).sessions.reduce((min, current) => {
    return min.totalDuration < current.totalDuration ? min : current;
}).totalDuration / 60000)} хвилин</li>`;

	const totalDurationSum = this.model.getUser(currentUser).sessions.reduce((sum, current) => {return sum + current.totalDuration;}, 0);
	const averageTotalDuration = totalDurationSum / this.model.getUser(currentUser).sessions.length;
	
	stat += `<li>Середня тривалість сеансів: ${averageTotalDuration} хвилин</li>`;
	  	
	return stat;
  }
  
  setProfile(currentUser){
	let row = this.table.getElementsByTagName("tr")[0];
	let td = row.getElementsByTagName("td")[0];
	td.innerHTML = this.model.getUser(currentUser).nickname;
	row = this.table.getElementsByTagName("tr")[1];
	td = row.getElementsByTagName("td")[0];
	td.innerHTML = this.model.getUser(currentUser).email;
	row = this.table.getElementsByTagName("tr")[2];
	td = row.getElementsByTagName("td")[0];
	td.innerHTML = this.model.getUser(currentUser).phone;
	row = this.table.getElementsByTagName("tr")[3];
	td = row.getElementsByTagName("td")[0];
	td.innerHTML = this.calculateStat();//this.calculateStat();
  }
  
  
  
  updateNav(){
	const nav = document.getElementById('navbarNav');
	let ul = nav.querySelector('.navbar-nav');
	let li = ul.getElementsByTagName("li")[3];
	li.remove();
	li = ul.getElementsByTagName("li")[3];
	li.remove();
	ul.innerHTML += `<li class="nav-item"><a class="nav-link" href="profile.html" onclick="localStorage.setItem('currentUser', undefined);"> Вийти</a></li>`;
  }
  
  restoreNav(){
	const nav = document.getElementById('navbarNav');
	let ul = nav.querySelector('.navbar-nav');
	let li = ul.getElementsByTagName("li")[3];
	li.remove();
	ul.innerHTML += `<li class="nav-item"><a class="nav-link" href="signin.html">Увійти</a></li>`;
	ul.innerHTML += `<li class="nav-item"><a class="nav-link" href="signup.html">Зареєструватися</a></li>`;
  }
  
  handleLoad(event) {
    event.preventDefault();
	
	const currentUser = localStorage.getItem('currentUser');

	try {
		this.updateNav();
		if (this.table){
			this.setProfile(currentUser);
		}
	}
	catch {
		this.restoreNav();
	}
  } 
}


class ProfileController {
  constructor() {
    this.model = new UserModel();
    this.view = new ProfileView(this.model);
  }
}


class TimeTracker {
  constructor(model) {
    this.startTime = null;
    this.pauseTime = null;
    this.pauseDurations = [];
	this.model = model;
    this.currentSession = {
      startTime: null,
      pauseDurations: []
    };
	try {
		this.sessions = this.model.getUser(localStorage.getItem('currentUser')).sessions;
	}
	catch {
		this.sessions = [];
	}
  }

  startTimer() {
    this.startTime = new Date();
    this.currentSession.startTime = this.startTime;
  }

  pauseTimer() {
    this.pauseTime = new Date();
  }

  resumeTimer() {
    const pauseDuration = new Date() - this.pauseTime;
    this.pauseDurations.push(pauseDuration);
    this.currentSession.pauseDurations.push(pauseDuration);
    this.pauseTime = null;
  }
  
  saveUserSession() {
    let users = this.model.getUsers();

    for(let i = 0; i < users.length; i++) {
        if(users[i].nickname === localStorage.getItem('currentUser')) {
            users[i].sessions = this.sessions;
            localStorage.setItem('users', JSON.stringify(users));
			break;
        }
    }
  }

  stopTimer(sessionName) {
    const endTime = new Date();
    const totalDuration = endTime - this.startTime - this.getTotalPauseDuration();
    const session = {
        name: sessionName,
        startTime: this.currentSession.startTime,
        pauseDurations: this.currentSession.pauseDurations,
        endTime: endTime,
        totalDuration: totalDuration
    };
    this.sessions.push(session);
	this.saveUserSession();
    this.resetTimer();
	}
	
  saveSession() {
	const sessionName = prompt('Введіть назву сеансу:');
	if (sessionName) {
		const currentTime = new Date();
		const session = {
			name: sessionName,
			startTime: this.currentSession.startTime,
			pauseDurations: this.currentSession.pauseDurations,
			endTime: currentTime,
			totalDuration: currentTime - this.startTime - this.getTotalPauseDuration()
		};
		this.sessions.push(session);
		this.saveUserSession();
	}
}

  getTotalPauseDuration() {
    return this.pauseDurations.reduce((total, duration) => total + duration, 0);
  }

  resetTimer() {
    this.startTime = null;
    this.pauseTime = null;
    this.pauseDurations = [];
    this.currentSession = {
      startTime: null,
      pauseDurations: []
    };
  }
}

class TimerView {
  constructor() {
    this.timerElement = document.getElementById('timer');
    this.workLogElement = document.getElementById('workLog');
    this.sessionHistoryElement = document.getElementById('sessionHistory');
  }

  updateTimer(time) {
    this.timerElement.textContent = this.formatTime(time);
  }

  updateWorkLog(startTime, pauseDurations) {
    if (!startTime) {
        this.workLogElement.innerHTML = '';
        return;
    }

    const startTimeString = this.formatDateTime(startTime);
    let workLogHTML = `Початок: ${startTimeString}<br>Паузи:<ul>`;

    pauseDurations.forEach(pauseDuration => {
        const startPauseTime = new Date(startTime.getTime() + this.getTotalPauseDuration(pauseDurations, pauseDuration));
        const endPauseTime = new Date(startPauseTime.getTime() + pauseDuration);
        workLogHTML += `<li>${this.formatDateTime(startPauseTime)} - ${this.formatDateTime(endPauseTime)}</li>`;
    });

    workLogHTML += '</ul>';
    this.workLogElement.innerHTML = workLogHTML;
	}

  updateSessionHistory(sessions) {
    let sessionHistoryHTML = '';

    sessions.forEach((session, index) => {
        const startTime = new Date(session.startTime);
        const endTime = new Date(session.endTime);
        const totalDuration = session.totalDuration;
        const pauseDurations = session.pauseDurations;
        const durationInMinutes = Math.floor(totalDuration / 60000);

        sessionHistoryHTML += `<li>${session.name}<br>Початок: ${this.formatDateTime(startTime)}<br>Паузи:<ul>`;

        pauseDurations.forEach(pauseDuration => {
            const startPauseTime = new Date(startTime.getTime() + this.getTotalPauseDuration(pauseDurations, pauseDuration));
            const endPauseTime = new Date(startPauseTime.getTime() + pauseDuration);
            sessionHistoryHTML += `<li>${this.formatDateTime(startPauseTime)} - ${this.formatDateTime(endPauseTime)}</li>`;
        });

        sessionHistoryHTML += `</ul>Завершено: ${this.formatDateTime(endTime)}
		<br>Тривалість: ${durationInMinutes} хвилин</li>`;
    });

    this.sessionHistoryElement.innerHTML = sessionHistoryHTML;
	}


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

  formatDateTime(dateTime) {
    const year = dateTime.getFullYear();
    const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
    const day = dateTime.getDate().toString().padStart(2, '0');
    const hours = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');
    const seconds = dateTime.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  getTotalPauseDuration(pauseDurations, currentPauseDuration) {
    return pauseDurations.reduce((total, duration) => {
      if (duration === currentPauseDuration) {
        return total;
      }
      return total + duration;
    }, 0);
  }
}


class TimerController {
  constructor() {
    this.model = new TimeTracker(new UserModel());
    this.view = new TimerView();
    this.intervalId = null;
    this.startTime = null;
    this.totalTime = 0;

    this.bindEventListeners();
    this.updateView();
  }

  bindEventListeners() {
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const stopBtn = document.getElementById('stopBtn');
    const saveBtn = document.getElementById('saveBtn');

    startBtn.addEventListener('click', () => {
        this.startTimer();
    });

    pauseBtn.addEventListener('click', () => {
        this.pauseTimer();
    });

    stopBtn.addEventListener('click', () => {
        this.stopTimer();
    });

    saveBtn.addEventListener('click', () => {
        this.model.saveSession();
        this.updateView();
    });
}

  startTimer() {
    if (this.model.pauseTime) {
        this.model.resumeTimer();
    } else {
        this.model.startTimer();
        this.startTime = this.model.startTime;
    }
    this.intervalId = setInterval(() => {
        this.updateTimer();
    }, 1000);
    this.updateView(); 
	}

	pauseTimer() {
		this.model.pauseTimer();
		clearInterval(this.intervalId);
		this.updateView(); 
	}

	resumeTimer() {
		this.model.resumeTimer();
		this.startTime = new Date();
		this.intervalId = setInterval(() => {
			this.updateTimer();
		}, 1000);
		this.updateView();
	}

  stopTimer() {
    if (confirm('Чи бажаєте ви зберегти сеанс?')) {
        const sessionName = prompt('Введіть назву сеансу:');
        if (sessionName) {
            this.model.stopTimer(sessionName);
        }
    } else {
        this.model.resetTimer();
    }
    clearInterval(this.intervalId);
    this.updateView();
	}

  updateTimer() {
    const currentTime = new Date();
    const elapsedTime = currentTime - this.startTime - this.model.getTotalPauseDuration();
    this.totalTime += 1000;
    this.view.updateTimer(elapsedTime);
  }

  saveSession() {
    this.model.stopTimer();
    this.updateView();
  }

  updateView() {
    const currentSession = this.model.currentSession;
    const sessions = this.model.sessions;

    if (currentSession.startTime) {
        this.view.updateWorkLog(currentSession.startTime, currentSession.pauseDurations);
    } else {
        this.view.updateWorkLog(null, []);
    }

    this.view.updateSessionHistory(sessions);
	}
}


class Controller {
  constructor() {
    this.model = new UserModel();
    this.signinView = new SigninView(this.model);
	this.signiupView = new SignupView(this.model);
	this.profileView = new ProfileView(this.model);
	this.timerController = new TimerController();
  }
}

const controller = new Controller();

