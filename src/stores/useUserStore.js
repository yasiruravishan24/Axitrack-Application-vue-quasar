import { defineStore } from 'pinia'
import { auth, db } from "../configs/firebase/index"
import { fetchSignInMethodsForEmail, createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore";

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: null,
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
    async login() {

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
