const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const libroController = require('./controllers/libroController');
const app = express();
const multer = require('multer');

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost/dbapilados');

const conn = mongoose.connection;

conn.once('open', () =>{
    console.log('Conexión exitosa');
});

conn.on('error', (err) =>{
    console.log('Error de conexión', err);
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') // Directorio donde se almacenarán las imágenes
    },
    filename: function (req, file, cb) {
      // Genera un nombre de archivo único
      cb(null, file.fieldname + '-' + Date.now())
    }
  });
  
  const upload = multer({ storage: storage });


app.get('/getAll', libroController.getAllLibros);
app.get('/getById/:id', libroController.getLibroById);
app.get('/getCustom', libroController.getCustomLibros);
app.post('/add', upload.single('portada'), libroController.addLibro);

app.put('/update/:id', libroController.updateLibro);
app.delete('/delete/:id', libroController.deleteLibro);

app.listen(3000, () => {
    console.log('Servidor listo...');
});