require('dotenv').config()
const express = require('express');
const axios = require('axios').default;
const multer = require('multer');
const upload = multer({ dest: '../uploads' })
const {uploadFile} = require('./s3Client')
const cors = require('cors')
const PORT = process.env.PORT
let app = express();

app.use(cors({ origin: '*'}));

async function sendImageOpenalpr(imgUrl){
  const secret_key = process.env.SECRET_KEY
  let url = `https://api.openalpr.com/v3/recognize_url?image_url=${imgUrl}&recognize_vehicle=0&country=us&return_image=0&topn=10&secret_key=${secret_key}`;
  
  try{
    const response = await axios.post(url);
    let plateData = response.data.results[0];
    return plateData;
  }catch(err){
    console.log(err);
  }
}

app.post('/', upload.single('file'), async (req, res) => {
  
  const file = req.file

  if(!file) return res.status(400).send("No file uploaded!")

  console.log('originalname', file.originalname)
  console.log('mimetype', file.mimetype)
  console.log('path', file.path)
  
  let result = await uploadFile(file);
  let url = result.Location
  let plateData = await sendImageOpenalpr(url)

  if(!plateData) return res.status(400).send("Error parsing plate!")

  console.log(plateData)
  return res.status(200).send(plateData)
})

app.get('/', (req, res) => {
  res.send("hello world");
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
})