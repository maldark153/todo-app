import { notify } from './utils.js';

// GUARD ADDING ACTIVITIES WITHOUT LOGGING IN!!!

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBwdFyceFjZibyR8DvUZRnpsCNU4s5A0Mg",
    authDomain: "to-do-app-965ac.firebaseapp.com",
    databaseURL: "https://to-do-app-965ac-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "to-do-app-965ac",
    storageBucket: "to-do-app-965ac.appspot.com",
    messagingSenderId: "527593974371",
    appId: "1:527593974371:web:ee8db3a1dd180cbb416656"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();

const register = (email, password, repeatPassword) => {
    if (!email.length) {
        notify('Please enter an email!', 'danger')
        return;
    }

    if (password.length < 6) {
        notify('Password should be at least 6 characters long!', 'danger')
        return;
    }

    if (password !== repeatPassword) {
        notify('Password missmatch!', 'danger')
        return;
    }

    auth
        .createUserWithEmailAndPassword(email, password)
        .then((user) => {
            notify('Successful registration!', 'success')
        })
        .catch((error) => {
            notify(error.message, 'danger')

        })
}

const login = (email, password) => {
    if (!email.length) {
        notify('Please enter an email!', 'danger')
        return;
    }

    if (!password.length) {
        notify('Please enter a password!', 'danger')
        return;
    }
    auth
        .signInWithEmailAndPassword(email, password)
        .then((user) => {
            notify('Successful login!', 'success')
        })
        .catch((error) => {
            notify(error.message, 'danger')
        })
}

const logout = () => {
    auth
        .signOut()
        .then(() => {
            notify('Successful logout!', 'success');
            userUID = null;
        })
        .catch((error) => {
            notify(error.message, 'danger')
        })
}

let userUID;
const listenUserTasks = (user) => {
    userUID = user.uid;
}

function addTask(task) {
    if (!userUID) return;
    const newPostKey = database.ref().child('users').child(userUID).push().key;
    const updates = {};
    updates[`/users/${userUID}/${newPostKey}`] = {task, done: false};

    return database.ref().update(updates, err => {
        if (err) return notify(err.message, 'danger');
        notify('Successfully added task!', 'success');
    });
}

function doneTask(id) {
    if (!userUID) return;
    const updates = {};
    updates[`/users/${userUID}/${id}/done`] = true ;

    return database.ref().update(updates, err => {
        if (err) return notify(err.message, 'danger');
        notify('Successfully doned task!', 'success');
    });
}

function deleteTask(id) {
    return database.ref(`/users/${userUID}/${id}`)
        .remove()
        .then(() => notify('You delete the task!', 'success'))
        .catch(err => notify(err.message, 'error'))
}


export { auth, database, register, login, logout, listenUserTasks, addTask, doneTask, deleteTask}