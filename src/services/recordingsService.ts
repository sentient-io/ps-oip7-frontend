import  { reactive, computed } from '@vue/composition-api'
import { helperService } from './helpers'
import { FileUploadInterface, MeetingsInterface } from './types'
import { DbService } from './firebase'
import axios from 'axios'

const helpers = helperService()
const { meetings } = DbService()
const argoUri = 'https://asia-southeast2-imdaoip7-dev.cloudfunctions.net/argoservice'
const recordingState = reactive({
  currentRecording: {} as MeetingsInterface
})

const recordingService = () => {
  const newRecording = async (meeting: MeetingsInterface) => {
    console.log(meeting)
    const files = <FileUploadInterface[]>[]
    meeting.uploads.forEach(m => {
      files.push({
        document: helpers.extractSpeakerFromFile(m),
        inputfile: 'uploads/' + m,
        outputfile: 'transcripts/' + helpers.changeExtToTxt(m)
      })
    })
    const params = {
      files: files,
      collection: meeting.name,
      recepients: { to: meeting.recepients }
    }
    const res = await axios.post<string>(argoUri, params)
    return res.data
  }
  const setRecording = (name:string) => {
    recordingState.currentRecording = meetings.value.find(rec => rec.name == name) as MeetingsInterface
  }
  return {
    recState: computed(() => recordingState),
    newRecording,
    setRecording
  }
}

export {
  recordingService
}