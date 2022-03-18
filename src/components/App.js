import React, {useState, useEffect} from 'react';
import './App.css';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
//import DialogContent from '@material-ui/core/DialogContent';
//import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


function App() {

  //ipfs instance
  const ipfsClient = require('ipfs-http-client')

  const ipfs = ipfsClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https'
  })

  //file input ref
  let inputRef;

  //states
  const [initialUpload, setInitialUpload] = useState(false)
  const [fileUploaded, setFileUploaded] = useState(false)
  const [fileBuffer, setFileBuffer] = useState(null)
  const [uploadedToIPFS, setUploadedToIPFS] = useState(false)
  const [ipfsURI, setIpfsURI] = useState('undefined')

  const [open, setOpen] = useState(false)

  //reset state
  const resetState = () =>{
    console.log('resetting state...')
    setFileUploaded(false)
    setUploadedToIPFS(false)
    setFileBuffer(null)
  }

  //handle dialog actions
  const openDialog = () => {
    setOpen(true)
  }

  const closeDialog = () => {
    setOpen(false)
    resetState()
  }
  
  //"Upload" button click event
  const uploadFile = (event) =>{
    event.preventDefault()
    setFileUploaded(true)

    console.log('onChange: File is captured')
    console.log(event.target.files[0])

    //process uploaded file
    const file = event.target.files[0]
    const reader = new window.FileReader()

    reader.readAsArrayBuffer(file)

    reader.onloadend = () =>{
      setFileBuffer(Buffer(reader.result))
    }

  }

  //add file to IPFS
  const addToIPFS = () =>{
    console.log("Adding the file to IPFS...")
    ipfs.add(fileBuffer, (err, res) => {
      if(err) console.error("Error: ", err)

      console.log('IPFS result: ', res)
      const hash = res[0].hash
      setIpfsURI('https://ipfs.infura.io/ipfs/' + hash)
      setInitialUpload(true)
      setUploadedToIPFS(true)
    })
  }

    //callback function when value changed
    useEffect(()=>{
      console.log('fileUploaded status: ', fileUploaded)
    }, [fileUploaded])
  
    useEffect(()=>{
      console.log('File Buffer: ', fileBuffer)
      if(fileUploaded){
        //open "File Upload" information box, after user uploaded file
        openDialog()
        addToIPFS()
      }
    }, [fileBuffer])
  
    useEffect(() => {
      console.log('uploadedToIPFS status: ', fileUploaded)
    }, [uploadedToIPFS])

    useEffect(() => {
      console.log('ipfs URI: ', ipfsURI)
    }, [ipfsURI])

  return (
    <div className='App'>

      {/* Title */}

      <h1 className='header'>IPFS File Uploader</h1>

      {/* Content */}

      <h3 className='content'>
        <i class="fa-solid fa-angle-right"/>
        <i className='content-link'>{initialUpload ? ipfsURI : "Your url will be available here"}</i>
      </h3>

      {/* File upload Button */}

      <input
        type="file"
        hidden={true}
        ref={refParam => inputRef = refParam}
        onChange={uploadFile}
      />

        <button 
          className='btn btn--primary btn--medium '
          onClick={() => inputRef.click()}
        >
          UPLOAD
        </button>

        <div className='github-icon'>
              {/* GitHub, Source Code Link*/}
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/jacc-cyc/ipfs-uploader" className="source-code">
              <i class="fa-brands fa-github" /></a>
        </div>

        {/* "File Uploaded Successfully" Information Box */}
          
        <Dialog
            open={open}
            onClose={closeDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
          
          {uploadedToIPFS ?
          <DialogTitle id="alert-dialog-title">{"Done! URL is available now."}</DialogTitle>
           :
           <DialogTitle id="alert-dialog-title">{"Uploading your file to IPFS..."}</DialogTitle>}

          { uploadedToIPFS ? 
          <DialogActions>
            <Button onClick={closeDialog} color="primary" autoFocus>
              Ok
            </Button>
          </DialogActions> : 

          <DialogActions>
            
          </DialogActions>}

        </Dialog>

    </div>
  );
}

export default App;
