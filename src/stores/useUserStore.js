import { defineStore } from 'pinia'
import { auth, db } from "../configs/firebase/index"
import { fetchSignInMethodsForEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, setPersistence, browserLocalPersistence } from "firebase/auth"
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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
          this.user['profile_image'] = await this.getProfileImage(user.uid);

        })
      }).catch((error) => {
        throw error
      });
    },
    async logout() {
      return await signOut(auth).then(() => {
        // this.user = null;
      }).catch((error) => {
        throw error
      });
    },
    setUser() {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          this.user = (await getDoc(doc(db, "users", user.uid))).data();
          this.user['profile_image'] = await this.getProfileImage(user.uid);
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

    },
    async updateProfile(data) {

      return await updateDoc(doc(db, "users", auth.currentUser.uid), {
        full_name: data['full_name'],
        address: data['address'],
        contact_no: data['contact_no'],
        nic: data['nic'],
      }).then(async (res) => {

        await uploadBytes(ref(getStorage(), auth.currentUser.uid), data['profile_image']).then(async (res) => {
          this.user['profile_image'] = await this.getProfileImage(auth.currentUser.uid);
        });

        this.user['full_name'] = data['full_name']
        this.user['address'] = data['address']
        this.user['contact_no'] = data['contact_no']
        this.user['nic'] = data['nic']

      }).catch((error) => {
        throw error
      })
    },
    async getProfileImage(name) {
      return getDownloadURL(ref(getStorage(), name))
        .then((url) => {
          return url
        })
    },
    async updateEmergencyContact(data) {

      return await updateDoc(doc(db, "users", auth.currentUser.uid), {
        police: data['police'],
        hospital: data['hospital'],
        ambulance: data['ambulance'],
      }).then(async (res) => {

        this.user['police'] = data['police']
        this.user['hospital'] = data['hospital']
        this.user['ambulance'] = data['ambulance']
  
      }).catch((error) => {
        throw error
      })
    }
  },

});
