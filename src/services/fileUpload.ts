import { storage, firebase } from './firebase'

export class WavFileUpload {
  file: File
  size: number
  name: string
  progress: number
  snapshot: firebase.storage.UploadTaskSnapshot
  task: firebase.storage.UploadTask
  state: string
  downloadURL: string
  constructor (file: File) {
    this.file = file
    this.size = file.size
    this.name = file.name
    this.progress = 0
    this.snapshot = {} as firebase.storage.UploadTaskSnapshot
    this.state = 'Not Uploaded'
    this.task = {} as firebase.storage.UploadTask
    this.downloadURL = ''
  }
  uploadFile = () => {
    const storageRef = storage.ref()
    const fileRef = storageRef.child('uploads/' + this.name)
    this.task = fileRef.put(this.file)
    this.task.on('state_changed', 
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        this.snapshot = snapshot
        // console.log(this.snapshot)
        this.state = snapshot.state
        this.progress = (snapshot.bytesTransferred / snapshot.totalBytes)
        // console.log('Upload is ' + this.progress.toString() + '% done');
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            // console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            // console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        console.log(error)
        // Handle unsuccessful uploads
      },
      () => {
        this.state = 'Uploaded'
        void this.task.snapshot.ref.getDownloadURL().then((downloadURL: string) => {
          console.log('File available at', downloadURL)
          this.downloadURL = downloadURL
        })
      })
    }
    status = () => {
      return this.snapshot
    }
}