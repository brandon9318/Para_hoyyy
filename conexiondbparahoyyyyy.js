const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'n0m3l0',
    database: 'basedatos'
});

con.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/agregarUsuario', (req, res) => {
    const { id, nombre } = req.body;
    con.query(
        'INSERT INTO usuario (id_usuario, nombre) VALUES (?, ?)',
        [id, nombre],
        (err) => {
            if (err) return res.status(500).send("Error al agregar usuario");
            res.send(`<h2>Usuario agregado correctamente</h2><p>Nombre: ${nombre}</p>`);
        }
    );
});

app.get('/obtenerUsuario', (req, res) => {
    con.query('SELECT * FROM usuario', (err, respuesta) => {
        if (err) return res.status(500).send("Error al obtener usuarios");
        let tablaHTML = `
            <table border="1" cellpadding="6">
                <tr><th>ID</th><th>Nombre</th></tr>`;
        respuesta.forEach(user => {
            tablaHTML += `<tr><td>${user.id_usuario}</td><td>${user.nombre}</td></tr>`;
        });
        tablaHTML += `</table>`;
        res.send(tablaHTML);
    });
});

app.post('/borrarUsuario', (req, res) => {
    const { id } = req.body;
    con.query('DELETE FROM usuario WHERE id_usuario = ?', [id], (err, resultado) => {
        if (err) return res.status(500).send("Error al borrar usuario");
        if (resultado.affectedRows === 0) return res.status(404).send("Usuario no encontrado");
        res.send(`Usuario con ID ${id} borrado correctamente`);
    });
});

app.post('/editarUsuario', (req, res) => {
    const { nombre, nuevoNombre } = req.body;
    con.query('UPDATE usuario SET nombre = ? WHERE nombre = ?', [nuevoNombre, nombre], (err, resultado) => {
        if (err) return res.status(500).send("Error al actualizar usuario");
        if (resultado.affectedRows === 0) return res.status(404).send("Usuario no encontrado");
        res.send(`Usuario ${nombre} actualizado correctamente a ${nuevoNombre}`);
    });
});

app.listen(10000, () => {
    console.log('Servidor escuchando en http://localhost:10000');
});
