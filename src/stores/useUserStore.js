import { defineStore } from 'pinia'
import { auth, db } from "../configs/firebase/index"
import { fetchSignInMethodsForEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore";

import util from '../utils/index';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: {},
  }),
  getters: {
    getUser: (state) => state.user,
  },
  actions: {
    async register(data) {

      return await createUserWithEmailAndPassword(auth, data['email'], data['password']).then(async (res) => {
        const { user } = res

        await setDoc(doc(db, "users", user.uid), {
          full_name: data['full_name'],
        })

      }).catch((error) => {
        throw error
      });
    },
    async login(email, password) {
      return await signInWithEmailAndPassword(auth, email, password).then(async (res) => {
        const { user } = res

        this.user = (await getDoc(doc(db, "users", user.uid))).data();

        this.user['uid'] = user.uid;

        await auth.currentUser.getIdToken(true).then((token) => {
          this.user['token'] = token
        });

        const encryptedData = util.crypto.encryptData(process.env.APP_SECRET_KEY, JSON.stringify({
          uid: user.uid,
          token: this.user['token']
        }))

        localStorage.setItem('axitrack', encryptedData)

      }).catch((error) => {
        throw error
      });
    },
    async logout() {
      return await signOut(auth).then(() => {
        this.user = null;
      }).catch((error) => {
        throw error
      });
    },
    async emailCheck(email) {

      return await fetchSignInMethodsForEmail(auth, email).then((result) => {
        return result && result.length > 0;
      }).catch((error) => {
        return false
      });
    }
  },
});
