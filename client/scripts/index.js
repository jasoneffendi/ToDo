Vue.component('list-item', {
    props: ['todo'],
    template: `
    <li class="list-group-item">{{ todo.description }}<button @click.prevent="del(todo)">Delete</button></li>
    `,
    methods: {
        del(params) {
            this.$emit('del', params)
        }
    }
})

Vue.component('main-item', {
    template: `
    <div>
    <div v-if="token == ''">
        <button v-on:click="login">Login with facebook</button>
    </div>
    <div v-else>
        <button v-on:click="logout">Logout</button>
    </div>
    <div class=col-md-4>
    <ul class="list-group">
    <list-item
    v-for="(todo, index) in tasks"
    v-bind:todo="todo"
    v-bind:index="index"
    v-bind:key="todo.id"
    @del="del"
    >
    </list-item>
    </ul>
    </div>
    <input type="text" placeholder="ToDo" ref="Todo">
    <button type="submit" @click.prevent="post">Submit</button>    
    </div>
    `,
    data() {
        return {
            tasks: [],
            token: ''
        }
    },
    methods: {
        hasLogin: function() {
            var retrievedObject = localStorage.getItem('todoToken');
            this.token = retrievedObject
            if(typeof retrievedObject !== 'string') {
                alert('Please log in')
                return false
                // console.log('keluar lu')            
                // window.location.href = "login.html"
            }
            return true
        },
        load: function() {
            var retrievedObject = localStorage.getItem('todoToken');
            if(typeof retrievedObject == 'string') {
                axios.get(`http://localhost:3000/list?token=${retrievedObject}`)
                .then(({data}) => {
                    this.tasks = data
                    console.log(this.tasks)
                })
                .catch(err => {
                    console.log(err)
                })
            } else {
                alert('Please log in')
            }
           
        },
        login: function() {
            function statusChangeCallback(response) {
                console.log('statusChangeCallback');
                if (response.status === 'connected') {
                    console.log(response.authResponse.accessToken)
                    axios.post('http://localhost:3000/fb', {
                        accessToken: response.authResponse.accessToken
                    })
                    .then(function (response) {
                        localStorage.setItem('todoToken', response.data)
                        this.token = response.data
                        var retrievedObject = localStorage.getItem('todoToken');
                        axios.get(`http://localhost:3000/list?token=${retrievedObject}`)
                        .then(result => {
                            this.tasks = result.data
                            console.log(this.tasks)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                        this.load
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                } else {
                // The person is not logged into your app or we are unable to tell.
                document.getElementById('status').innerHTML = 'Please log ' +
                    'into this app.';
                }
            }
    
            window.fbAsyncInit = function() {
                FB.init({
                appId            : 129091131123493,
                autoLogAppEvents : true,
                xfbml            : true,
                version          : 'v2.10'
                });
                FB.AppEvents.logPageView();
    
                FB.getLoginStatus(function(response) {
                    statusChangeCallback(response);
                });
    
                function checkLoginState() {
                    FB.getLoginStatus(function(response) {
                        statusChangeCallback(response);
                    });
                }
            };
            
            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "https://connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
                }(document, 'script', 'facebook-jssdk'));
        },
        logout: function () {
          localStorage.removeItem('todoToken')
          this.token = ''
        },
        post: function () {
          var retrievedObject = localStorage.getItem('todoToken');            
          axios.post('http://localhost:3000/', {
            token: retrievedObject,
            task: this.$refs.Todo.value
          })
          .then(({data})=> {
              this.tasks.push(data)
              console.log(data)
          })
          .catch(err => {
              console.log(err)
          })
        },
        del: function(item) {
          this.tasks.splice(this.tasks.indexOf(item), 1)
          axios.delete('http://localhost:3000/' + item._id)
          .then(({data})=> {
              console.log(data)
          })
          .catch(err => {
              console.log(err)
          })
        }
    },
    mounted: function() {
        // localStorage.removeItem('todoToken')
        // console.log(response.data)
        this.hasLogin()
        this.load()
    }
})

new Vue({
    el: "#app"
})