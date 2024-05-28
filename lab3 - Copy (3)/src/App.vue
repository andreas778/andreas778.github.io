<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
  <div class="container">
            <a class="navbar-brand" href="#">ЧасоМетр</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <router-link to="/" class="nav-link" >Головна</router-link>
                    </li>
                    <li class="nav-item">
                         <router-link to="/about" class="nav-link" >Про нас</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/profile" class="nav-link" >Профіль</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/signin"  class="nav-link" v-if="!store.state.currentUser">Увійти</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/signup" class="nav-link" v-if="!store.state.currentUser">Зареєструватися</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to=""  class="nav-link" v-if="store.state.currentUser" @click="store.commit('logOut')">Вийти</router-link>
                    </li>
                </ul>
            </div>
        </div>   
  </nav>
  <router-view/>
</template>

<script setup>
import store from './store';
</script>

