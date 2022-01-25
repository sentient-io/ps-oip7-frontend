import date from 'quasar'
const helperService = () => {
    const extractSpeakerFromFile = (filename: string) => {
        return filename.split('_')[0]
    }
    const formatDate = (datestring: string) => {
        /* eslint-disable-next-line */
        const formattedDate = date.formatDate(Date.parse(datestring), 'DD MMM YY h:MM:SS a') as string
        return formattedDate
    }
    const changeExtToTxt = (fileName: string) => {
        const pos = fileName.includes('.') ? fileName.lastIndexOf('.') : fileName.length
        const fileRoot = fileName.substr(0, pos)
        const output = `${fileRoot}.txt`
        return output
      }
    return {
        extractSpeakerFromFile,
        formatDate,
        changeExtToTxt
    }
}

export { helperService }