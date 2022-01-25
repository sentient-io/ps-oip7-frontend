// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase/app'
import * as firebaseui from 'firebaseui'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/firestore'
import 'firebaseui/dist/firebaseui.css'
import { computed, reactive } from '@vue/composition-api'
import { helperService } from './helpers'
import { WavFileUpload } from './fileUpload'

const helpers = helperService()

// firebaseConfig
const firebaseConfig = {
  apiKey: 'AIzaSyBHeaw7zNcoqDUSKq3Ak4WlB08aKhcAYHc',
  authDomain: 'imdaoip7-dev.firebaseapp.com',
  projectId: 'imdaoip7-dev',
  storageBucket: 'imdaoip7-dev.appspot.com',
  messagingSenderId: '614430383364',
  appId: '1:614430383364:web:bae23dd620333b836e8451',
  measurementId: 'G-EG5CZJ6QTX'
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// firebase UI Config
const firebaseUIConfig = {
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],
  signInSuccessUrl: '/#/sessions'
}

const ui = new firebaseui.auth.AuthUI(firebase.auth())

/****
AUTH SERVICES
****/

const auth = firebase.auth()
const userStore = reactive({
  uid: ''
})
auth.onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    userStore.uid = user.uid
    console.log('signed in')
  } else {
    // No user is signed in.
    userStore.uid = ''
    console.log('not signed in')
  }
})

const AuthService = () => {
  const signOut =  async () => {
    await auth.signOut()
  }
  const userid = async () => {
    if (!auth.currentUser) {
      return await new Promise((resolve, reject) =>
        auth.onAuthStateChanged(
          user => {
            if (user) {
              // Yes User is signed in.
              resolve(user.uid);
            } else {
              // No user is not signed in.
              reject('Not signed in');
            }
          },
          // Prevent console errors
          error => {
            console.log(error)
            reject('error')
          }))
    }
    return auth.currentUser ? auth.currentUser.uid : ''
  }
  return {
    signOut,
    userid
  }
}

/****
STORAGE and UPLOAD SERVICES
****/

const storage = firebase.app().storage('gs://imda-oip7')

const UploadService = () => {
  const uploadFactoryFn = async (files: File[]) => {
    const storageRef = storage.ref()
    return await Promise.all(files.map(async (file) => {
      try {
        const fileRef = storageRef.child('uploads/' + file.name)
        await fileRef.put(file)
        return true
      } catch (error) {
        console.log(error)
        return false
      }
    }))
  }
  return {
    uploadFactoryFn
  }
}

const StorageService = () => {
  const downloadFileUrl = async (ref: string) => {
    const storageRef = storage.ref()
    const pathRef = storageRef.child(ref)
    /* eslint-disable-next-line */
    const url = await pathRef.getDownloadURL()
    window.open(url)
    return url as string
  }
  return {
    downloadFileUrl
  }
}
/****
DB SERVICES
****/
import { MeetingsInterface, MeetingFilesInterface } from './types'

const db = firebase.firestore()
const meetingsStore = reactive({
  meetings: <MeetingsInterface[]>[],
  activeMeeting: <MeetingFilesInterface[]>[]
})
const DbService = () => {
  const getMeetings = async () => {
    const collections = db.collection('Meetings')
    const querySnapshot = await collections.where('user', '==', userStore.uid).get()
    querySnapshot.forEach((data) => {
      meetingsStore.meetings.push(data.data() as MeetingsInterface)
    })
    console.log(meetingsStore.meetings)
    trackMeetings()
  }
  const trackMeetings = () => {
    const collections = db.collection('Meetings')
    collections.onSnapshot((snapshot) => {
      // snapshot.docChanges().forEach((change) => {
      //   if (change.type === 'added') {
      //     meetingsStore.meetings.push(change.doc.data())
      //   }
      // })
      const meetings: MeetingsInterface[] = []
      snapshot.forEach((doc) => {
          meetings.push(doc.data() as MeetingsInterface)
      })
      meetingsStore.meetings = meetings
    })
  }

  const createMeeting = (meeting: MeetingsInterface) => {
    const collections = db.collection('Meetings')
    const docref = collections.doc(meeting.name)
    void docref.set(meeting, { merge: true })
    return 'OK'
  }

  const initFiles = (meeting: MeetingsInterface, files: WavFileUpload[]) => {
    const batch = db.batch()
    const newCollection = db.collection(meeting.name)
    for (const f of files){
      const trackRef = newCollection.doc(helpers.extractSpeakerFromFile(f.file.name))
      batch.set(trackRef, { status: 'Uploaded', size: f.file.size, uploadedOn: meeting.created, type: f.file.type, src: 'uploads/' + f.file.name })
    }
    void batch.commit()
    return 'OK'
  }

  const createSnapshot = (collection: string) => {
    const collectionRef = db.collection(collection)
    return collectionRef.onSnapshot((snapshot) => {
      const docs: MeetingFilesInterface[] = []
      snapshot.forEach((doc) => {
        console.log(doc.id)
        const docRef = doc.data() as MeetingFilesInterface
        docRef.speaker = doc.id
        docs.push(docRef)
        meetingsStore.activeMeeting = docs
        console.log(docs)
      })

    })
  }
  return {
    getMeetings,
    createMeeting,
    initFiles,
    createSnapshot,
    meetings: computed(() => meetingsStore.meetings),
    activeMeeting: computed(() => meetingsStore.activeMeeting)
  }
}

export {
  firebaseUIConfig,
  ui,
  firebase,
  storage,
  AuthService,
  UploadService,
  StorageService,
  DbService
}