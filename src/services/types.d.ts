export interface MeetingsInterface {
    name: string
    summary: string
    created: string
    numTracks: number
    totalSize: number
    uploads: string[]
    recepients: string[]
    user: string
}

export interface FileUploadInterface {
    document: string
    inputfile: string
    outputfile: string
}
export interface NewMeetingAxiosInterface {
    files: FileUploadInterface[]
    collection: string
    recepients: {
        to: string[]
    }
}

export interface MeetingFilesInterface {
    size: number
    status: string
    txtfile: string
    type: string
    uploadedOn: string
    speaker: string
}
