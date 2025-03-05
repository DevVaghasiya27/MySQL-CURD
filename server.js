const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

app.set("view engine", "ejs")

const connection = require('./config/db.js')

app.use(express.static(__dirname + "/public"))
app.use(express.static(__dirname + "/views"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.redirect("/create.html")
})

app.get('/data', (req, res) => {
    connection.query("SELECT * FROM users", (error, rows) => {
        if (error) {
            console.log(error);
        } else {
            res.render("read.ejs", { rows })
        }
    })
})

app.post('/create', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    try {
        connection.query(
            "Insert into users (name, email) values(?, ?)",
            [name, email],
            (error, rows) => {
                if (error) {
                    console.log(error);
                } else {
                    res.redirect("/data")
                }
            }
        )
    } catch (error) {
        console.log(error)
    }
})

app.get('/delete-data', (req, res) => {
    const id = req.query.id;
    const deleteQuery = "DELETE FROM users WHERE id =?";
    try {
        connection.query(deleteQuery, [id],
            (error, rows) => {
                if (error) {
                    console.log(error);
                } else {
                    res.redirect("/data")
                }
            }
        )
    } catch (error) {
        console.log(error)
    }
})

app.get('/update-data', (req, res) => {
    const id = req.query.id;
    connection.query("SELECT * FROM users WHERE id =?", [id], (error, eachRow) => {
        if (error) {
            console.log(error);
        } else {
            result = JSON.parse(JSON.stringify(eachRow[0]));
            res.render("edit.ejs", { result })
        }
    })
})

// update route
app.post('/final-update', (req, res) => {
    const id = req.body.hidden_id;
    const name = req.body.name;
    const email = req.body.email;
    try {
        connection.query(
            "UPDATE users SET name=?, email=? WHERE id=?",
            [name, email, id],
            (error, rows) => {
                if (error) {
                    console.log(error);
                } else {
                    res.redirect("/data")
                }
            }
        )
    } catch (error) {
        console.log(error)
    }
})

const PORT = process.env.PORT || 4000;
app.listen(PORT, (req, res, error) => {
    if (error) throw error;

    console.log(`Server is running on http://localhost:${PORT}`);
})