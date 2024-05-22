const mongoose = require('mongoose');

const Libro = mongoose.model('Libro', {
  isbn: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  autor: {
    type: String,
    required: true
  },
  editorial: {
    type: String,
    required: true
  },
  portada: {
    type: String,
    required: false 
  },
  paginas: {
    type: Number,
    default: false
  }
});

module.exports = Libro;
