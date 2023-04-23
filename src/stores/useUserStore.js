import { defineStore } from 'pinia'
import { auth, db } from "../configs/firebase/index"
import { fetchSignInMethodsForEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, setPersistence, browserLocalPersistence } from "firebase/auth"
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

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

        await auth.signOut();

      }).catch((error) => {
        throw error
      });
    },
    async login(email, password) {
      return await setPersistence(auth, browserLocalPersistence).then(async () => {
        await signInWithEmailAndPassword(auth, email, password).then(async (res) => {
          const { user } = res

          this.user = (await getDoc(doc(db, "users", user.uid))).data();

        })
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
    setUser() {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          this.user = (await getDoc(doc(db, "users", user.uid))).data();
        }
      })
    },
    async emailCheck(email) {

      return await fetchSignInMethodsForEmail(auth, email).then((result) => {
        return result && result.length > 0;
      }).catch((error) => {
        return false
      });
    },
    async addNewVehicle(data) {

      return await updateDoc(doc(db, "users", auth.currentUser.uid), {
        vehicles: arrayUnion({
          vehicle_no: data['vehicle_no'],
          device_mac: data['device_mac'],
          device_model: data['device_model'],
        })
      }).then(() => {

        if (this.user['vehicles'] == undefined) {
          this.user['vehicles'] = [
            {
              vehicle_no: data['vehicle_no'],
              device_mac: data['device_mac'],
              device_model: data['device_model'],
            }
          ];

          return;
        }

        this.user['vehicles'].push({
          vehicle_no: data['vehicle_no'],
          device_mac: data['device_mac'],
          device_model: data['device_model'],
        });


      }).catch((error) => {
        throw error
      });


    },
    async removeVehicle(id) {

      const newVehicle = this.user['vehicles'].filter((element, index) => index !== id);

      return await updateDoc(doc(db, "users", auth.currentUser.uid), {
        vehicles: [...newVehicle]
      }).then((res) => {
        this.user['vehicles'] = newVehicle;
      }).catch((error) => {
        throw error
      });

    },
    async addNewContact(data) {

      console.log(data)
      return await updateDoc(doc(db, "users", auth.currentUser.uid), {
        contacts: arrayUnion({
          contact_name: data['contact_name'],
          contact_no: data['contact_no'],
          relationship: data['relationship'],
        })
      }).then(() => {

        if (this.user['contacts'] == undefined) {
          this.user['contacts'] = [
            {
              contact_name: data['contact_name'],
              contact_no: data['contact_no'],
              relationship: data['relationship'],
            }
          ];

          return;
        }

        this.user['contacts'].push({
          contact_name: data['contact_name'],
          contact_no: data['contact_no'],
          relationship: data['relationship'],
        });


      }).catch((error) => {
        throw error
      });


    },
    async removeContact(id) {

      const newContacts = this.user['contacts'].filter((element, index) => index !== id);

      return await updateDoc(doc(db, "users", auth.currentUser.uid), {
        contacts: [...newContacts]
      }).then((res) => {
        this.user['contacts'] = newContacts;
      }).catch((error) => {
        throw error
      });

    },
    async updateSeen(id) {

      const newNotifications = this.user['notifications'].map((element, index) => {
        if (index == id) {
          element.seen = !element.seen
        }
        return element
      });

      return await updateDoc(doc(db, "users", auth.currentUser.uid), {
        notifications: [...newNotifications]
      }).then((res) => {
        this.user['notifications'] = newNotifications;
      }).catch((error) => {
        throw error
      });

    }
  },
});
