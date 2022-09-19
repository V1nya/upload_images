import firebase from "firebase/compat";
import 'firebase/storage'
import {upload} from './upload/upload.js'

const firebaseConfig = {
    apiKey: "AIzaSyBDPLaY6c-OhGSHBJJ8eWEWgnjjv-rxM9Y",
    authDomain: "myuploadimg-862e9.firebaseapp.com",
    projectId: "myuploadimg-862e9",
    storageBucket: "myuploadimg-862e9.appspot.com",
    messagingSenderId: "845533266692",
    appId: "1:845533266692:web:1d920bd8fb3a809cf68651"
};
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage()


upload('#file', {
    multi: true,
    accept: ['.png', '.jpg', '.jpeg', '.gif'],
    onUpload(files, blocks) {
        files.forEach((f, index) => {
            const ref = storage.ref(`image/${f.name}`)
            const task = ref.put(f)
            task.on('state_changed', snapshot => {
                const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
                const block = blocks[index].querySelector('.preview-info-progress')
                block.textContent = percentage
                block.style.width = percentage
            }, error => {
                console.log(error);
            }, () => {
                task.snapshot.ref.getDownloadURL()
                    .then(url=>{
                        console.log('Download url:',url)
                    })
            })


        })
    }
})
