
const Libro = require('../models/Libro');
const path = require('path');
const fs = require('node:fs');

exports.getAllLibros = async (req, res) => {
    try {
        const libros = await Libro.find();

        res.json(libros);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los libros' });
    }
};

exports.getLibroById = async (req, res) => {
    const libroId = req.params.id;

    try {
        const libro = await Libro.findById(libroId);
        if (!libro) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }

        res.json({ libro: libro });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar el libro' });
    }
};

exports.getCustomLibros = async (req, res) => {
    const { editorial, nombre, autor } = req.query;
    let filtros = {};

    if (editorial) {
        filtros.editorial = editorial;
    }
    if (nombre) {
        filtros.editorial = editorial;
    }
    if (autor) {
        filtros.autor = autor;
    }

    try {

        const libros = await Libro.find(filtros);

        res.json(libros);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar libros' });
    }
};

function saveImage(file){
    let newPath = '';
    if (file) {
        newPath = `./../crud_apilados_front/public/uploads/${file.originalname}`;
        fs.renameSync(file.path, newPath);
    }
    
    return newPath;
}

exports.addLibro = async (req, res) => {
    const nuevoLibro = new Libro(req.body);
    console.log(nuevoLibro, '____________--');
    try {
      const path = saveImage(req.file);
      if (req.file) {
        nuevoLibro.portada = path;
      }
      
      await nuevoLibro.save();
      res.json({ response: 'Libro agregado correctamente' });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const errores = Object.values(error.errors).map((err) => err.message);
        res.status(400).json({ error: errores });
      } else {
        console.error(error);

        res.status(500).json({ error: 'Error al agregar el libro' });
      }
    }
};

exports.updateLibro = async (req, res) => {
    const libroId = req.params.id;

    try {
        let updateData = req.body;
        if (req.file) {
            const path = saveImage(req.file);
            updateData.portada = path;
        }

        const libro = await Libro.findByIdAndUpdate(libroId, updateData, { new: true });

        if (!libro) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }

        res.json({ message: 'Libro actualizado correctamente', libro: libro });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map((err) => err.message);
            res.status(400).json({ error: errores });
        } else {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar el libro' });
        }
    }
};


exports.deleteLibro = async (req, res) => {
    const libroId = req.params.id;

    try {
        const libro = await Libro.findByIdAndDelete(libroId);
        if (!libro) {
            return res.status(404).json({ error: 'Libro no encontrado' });
        }

        res.json({ message: 'Libro eliminado correctamente', libro: libro });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el libro' });
    }
};
