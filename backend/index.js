// ovo treba biti pokrenuto kako bi Axios radio
// pokreće se sa: node index.js

const mysql = require('mysql');
const express = require('express');
const app = express();
var cors = require('cors')
var bodyParser = require('body-parser');
//const conn=require('./connection')
const jwt = require('jsonwebtoken');
const config = require("./auth.config.js");
const authJwt = require("./authJwt.js");

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
const dbConfig = require("./dbConfig");

app.use(cors());
//const cors = require('cors');
app.use(cors({ origin: "*" }));




var dbConn = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

//spajanje s bazom
dbConn.connect();





// Ovo riješava problem:
// Origin <origin> is not allowed by Access-Control-Allow-Origin
// from origin 'http://localhost:4200' has been blocked by CORS policy
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// kraj fix-a

app.post('/unosAtrakcija', authJwt.verifyToken("admin, korisnik"), function (request, response) {
  const data = request.body;

  // Pripremamo niz s atributima atrakcije, uključujući id_korisnika
  const atrakcija = [
    [
      data.naziv,
      data.opis,
      data.slika,
      data.prosjecna_ocjena || null, // Pretpostavimo da prosječna ocjena može biti null
      data.geografska_duzina,
      data.geografska_sirina,
      data.adresa,
      data.id_korisnika // Koristimo ID korisnika koji dolazi iz zahtjeva
    ]
  ];

  // SQL upit koji uključuje id_korisnika
  dbConn.query(
    'INSERT INTO atrakcije (naziv, opis, slika, prosjecna_ocjena, geografska_duzina, geografska_sirina, adresa, id_korisnika) VALUES ?',
    [atrakcija],
    function (error, results, fields) {
      if (error) {
        console.error('Error inserting attraction:', error);
        return response.status(500).send({ error: true, message: 'Došlo je do pogreške prilikom unosa atrakcije.' });
      }

      return response.send({ error: false, data: results, message: 'Atrakcija uspješno unesena.' });
    }
  );
});




app.post('/dodajSliku/:id', (req, res) => {
  const data = [req.body.slika_s, req.params.id];
  console.log('Received data:', data);

  dbConn.query("INSERT INTO slike(id_atrakcije_s, slika_s) VALUES (?,?)", data, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error');
    } else {
      console.log('Insert result:', result);
      res.send(result);
    }
  });
});


app.post("/api/unos-slike", function (req, res) {
  const data = req.body;
  const slika = data.slika;

  connection.query(
    "INSERT INTO predmet (slika) VALUES (?)",
    [slika],
    function (error, results, fields) {
      if (error) {
        console.error(error);
        return res.status(500).send({
          error: true,
          message: "Dogodila se greška prilikom dodavanja teksta.",
        });
      }
      return res.send({
        error: false,
        data: results,
        message: "Slika je dodana.",
      });
    }
  );
});
app.get('/dohvati_slike/:id_atrakcije', function (request, response) {
  const id_atrakcije = request.params.id_atrakcije;

  dbConn.query('SELECT * FROM slike WHERE id_atrakcije_s = ?', [id_atrakcije], function (error, results, fields) {
    if (error) throw error;
    return response.send({ error: false, data: results, message: 'Slike dohvaćene.' });
  });
});

//uzimanje podataka o atrakcijama
app.get('/atrakcije', (req, res) => {
  const idKorisnika = req.query.id_korisnika;
  console.log("id korisnika: " + idKorisnika);
  if (!idKorisnika) {
    return res.status(400).send({ error: 'ID korisnika je potreban' });
  }

  dbConn.query("SELECT * FROM atrakcije WHERE id_korisnika = ?", [idKorisnika], (err, result) => {
    if (err) {
      res.status(500).send('Error in fetching attractions');
    } else {
      res.send(result);
    }
  });
});

app.get('/natrakcije/:id', (req, res) => {
  const { id } = req.params;
  console.log("Request received for ID:", req.params.id);

  dbConn.query("SELECT * FROM atrakcije WHERE id_atrakcije = ? ", [id], (err, result) => {
    if (err) {
      return res.status(500).send('Error in fetching attraction');
    }
    if (result.length === 0) {
      return res.status(404).send('Attraction not found');
    }
    res.send(result[0]); // Assuming the query returns an array
  });
});



//uzimanje podataka o atrakcijama
app.get('/sveatrakcije', (req, res) => {
  dbConn.query("SELECT * FROM atrakcije ", (err, result) => {
    if (err) {
      res.send('error');
    } else {
      res.send(result);
    }
  });
});

app.get('/slike/:VK_ID_atrakcije', (req, res) => {
  const { VK_ID_atrakcije } = req.params;
  const sql = 'SELECT ID_Slike, VK_ID_atrakcije, slike FROM Slike WHERE VK_ID_atrakcije = ?';

  dbConn.query(sql, [VK_ID_atrakcije], (err, results) => {
    if (err) {
      console.error('Greška prilikom izvršavanja upita: ' + err.message);
      res.status(500).json({ error: 'Greška prilikom dohvata podataka' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Nema slika za dani VK_ID_atrakcije' });
    } else {
      res.json(results);
    }
  });
});


app.post('/slikee', (req, res) => {
  const { VK_ID_atrakcije, slike } = req.body;

  if (!VK_ID_atrakcije || !slike) {
    res.status(400).json({ error: 'Nedostaju potrebni podaci' });
    return;
  }

  const sql = 'INSERT INTO Slike (VK_ID_atrakcije, slike) VALUES (?, ?)';

  dbConn.query(sql, [VK_ID_atrakcije, slike], (err, results) => {
    if (err) {
      console.error('Greška prilikom izvršavanja upita: ' + err.message);
      res.status(500).json({ error: 'Greška prilikom unosa podataka' });
      return;
    }

    res.status(201).json({ message: 'Slika uspješno dodana', insertId: results.insertId });
  });
});
app.get('/prikazikomentari/:id', (req, res) => {
  let id_atrakcije = req.params.id;
  dbConn.query("SELECT * FROM Komentari WHERE VK_ID_atrakcije = ?", [id_atrakcije], (error, results) => {
    if (error) throw error;
    res.send({
      error: false,
      data: results,
      message: "Lista komentara."
    });
  });
});

// Dodavanje komentara za atrakciju po ID-u

app.post('/dodajKomentar/:id', (req, res) => {
  const data = [req.body.Komentar, req.body.Ocjena, req.params.id]; // Dodavanje ocjene u podatke
  console.log('Received data:', data);  // Log the received data
  dbConn.query("INSERT INTO Komentari(Komentar, ocjena, VK_ID_atrakcije) VALUES (?,?,?)", data, (err, result) => { // Dodavanje Ocjena u SQL upit
    if (err) {
      console.error('Error inserting data:', err);  // Log the error
      res.status(500).send('Error');
    } else {
      console.log('Insert result:', result);  // Log the result
      res.send(result);
    }
  });
});

//registracija korisnika
app.post('/dodajKorisnika', (req, res) => {
  const data = [req.body.Komentar, req.params.id]
  dbConn.query("INSERT INTO users ( email, password) VALUES (?,?)", data, (err, result) => {
    if (err) {
      res.send('Error')
    } else {
      res.send(result)
    }
  })
});



//uzimanje podataka o korisnicima
app.get("/korisnici", function (request, response) {
  dbConn.query("SELECT * FROM korisnici", function (error, results, fields) {
    if (error) throw error;
    return response.send({
      error: false,
      data: results,
      message: "lista korisnika.",
    });
  });
});






/*
app.delete('/atrakcije/id', function (request, response) {
    let id_atrakcije = request.params.id;
    if (!id_atrakcije) {
    return response.status(400).send({ error: true, message:
    'nedostaje id atrakcije' });
    }
    dbConn.query("DELETE * FROM atrakcije WHERE id_atrakcije = ?",[id_atrakcije],s) {
    if (error) throw
    function (error, resulterror;
    return response.send({ error: false, data: results, message:
    'atrakcija je obrisana.' });
    });
});*/



app.delete('/obrisi_atrakcije/:id_atrakcije', function (request, response) {
  const id_atrakcije = request.params.id_atrakcije;
  const id_korisnika = request.query.id_korisnika;
  const uloga = request.query.uloga;

  console.log(`Received request to delete atrakcija with id: ${id_atrakcije} by user: ${id_korisnika}, role: ${uloga}`);

  if (!id_atrakcije || (!id_korisnika && uloga !== 'admin')) {
    return response.status(400).send({ error: true, message: 'Missing id_atrakcije or id_korisnika' });
  }

  if (uloga === 'admin') {
    // Admin case: bypass user check and delete any attraction by id
    const adminDeleteQuery = "DELETE FROM atrakcije WHERE id_atrakcije = ?";
    dbConn.query(adminDeleteQuery, [id_atrakcije], function (error, deleteResults) {
      if (error) {
        console.log(`Error when executing the admin delete query: ${error}`);
        return response.status(500).send({ error: true, message: 'Error deleting attraction' });
      }

      console.log(`Admin deletion result: ${JSON.stringify(deleteResults)}`);
      return response.send({ error: false, data: deleteResults, message: 'Atrakcija je obrisana by admin.' });
    });
  } else {
    // Regular user case: ensure the user is authorized to delete the attraction
    const selectQuery = "SELECT * FROM atrakcije WHERE id_atrakcije = ? AND id_korisnika = ?";
    dbConn.query(selectQuery, [id_atrakcije, id_korisnika], function (error, results) {
      if (error) {
        console.log(`Error fetching data: ${error}`);
        return response.status(500).send({ error: true, message: 'Error retrieving attraction' });
      }

      if (results.length === 0) {
        return response.status(403).send({ error: true, message: 'User not authorized to delete this attraction' });
      }

      const deleteQuery = "DELETE FROM atrakcije WHERE id_atrakcije = ? AND id_korisnika = ?";
      dbConn.query(deleteQuery, [id_atrakcije, id_korisnika], function (error, deleteResults) {
        if (error) {
          console.log(`Error when executing the user delete query: ${error}`);
          return response.status(500).send({ error: true, message: 'Error deleting attraction' });
        }

        console.log(`User deletion result: ${JSON.stringify(deleteResults)}`);
        return response.send({ error: false, data: deleteResults, message: 'Atrakcija je obrisana by user.' });
      });
    });
  }
});



// Dodavanje ocjene za atrakciju

app.put('/dodajOcjenu/:id', (req, res) => {
  const data = [req.body.prosjecna_ocjena, req.params.id]
  dbConn.query("UPDATE atrakcije SET ocjena = ? WHERE id_atrakcije = ?", data, (err, result) => {
    if (err) {
      res.send('Error')
    } else {
      res.send(result)
    }
  })
});

//DOHVAT PROSJEČNE OCJENE ZA ATRAKCIJU

app.get('/atrakcijeProsjecneOcjene/:id_atrakcije', (req, res) => {
  const id_atrakcije = req.params.id_atrakcije;
  const sql = "SELECT AVG(ocjena) AS prosjecna_ocjena FROM Komentari WHERE VK_ID_atrakcije = ?";
  dbConn.query(sql, [id_atrakcije], (err, result) => {
    if (err) {
      console.error('Error fetching average rating:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (result.length === 0 || result[0].prosjecna_ocjena === null) {
      res.json({ prosjecna_ocjena: 0 }); // Ako nema ocjena, vraćamo prosjek 0
    } else {
      res.json({ prosjecna_ocjena: parseFloat(result[0].prosjecna_ocjena.toFixed(2)) });
    }
  });
});
// Dodavanje ocjene za atrakciju u tablicu OCJENE

app.post('/dodajOcjenuOcjene/:id', (req, res) => {
  const data = [req.body.prosjecna_ocjena, req.params.id]
  //INSERT INTO `Ocjena`( `ocjena`, `VK_ID_Atrakcije`) VALUES (2,141)
  dbConn.query("INSERT INTO Ocjena (ocjena, VK_ID_Atrakcije) VALUES ( ? , ?)", data, (err, result) => {
    if (err) {
      res.send('Error')
    } else {
      res.send(result)
    }
  })
});





app.delete('/obrisi_sliku_atrakcije/:id', function (request, response) {

  let id_atrakcije = request.params.id;

  console.log(`Received request to delete atrakcija with id: ${id_atrakcije}`); // Log the received id

  if (!id_atrakcije) {
    return response.status(400).send({ error: true, message: 'nedostaje id atrakcije' });
  }

  const deleteQuery = "UPDATE atrakcije SET slika = NULL WHERE id_atrakcije = ?";
  //const deleteQuery = "DELETE  FROM atrakcije WHERE id_atrakcije = '${id}'";
  dbConn.query(deleteQuery, [id_atrakcije], function (error, results) {
    if (error) {
      console.log(`Error when executing the delete query: ${error}`); // Log any error from the query
      throw error;
    }

    console.log('Deletion result: ${JSON.stringify(results)}'); // Log the result of the deletion

    return response.send({ error: false, data: results, message: 'slika atrakcija je obrisana ' });
  });
});





app.delete('/obrisi_ocjenu_atrakcije/:id', function (request, response) {

  let id_atrakcije = request.params.id;

  console.log(`Received request to delete atrakcija with id: ${id_atrakcije}`); // Log the received id

  if (!id_atrakcije) {
    return response.status(400).send({ error: true, message: 'nedostaje id atrakcije' });
  }

  const deleteQuery = "UPDATE atrakcije SET prosjecna_ocjena = NULL WHERE id_atrakcije = ?";
  //const deleteQuery = "DELETE  FROM atrakcije WHERE id_atrakcije = '${id}'";
  dbConn.query(deleteQuery, [id_atrakcije], function (error, results) {
    if (error) {
      console.log(`Error when executing the delete query: ${error}`); // Log any error from the query
      throw error;
    }

    console.log('Deletion result: ${JSON.stringify(results)}'); // Log the result of the deletion

    return response.send({ error: false, data: results, message: 'ocjena atrakcija je obrisana ' });
  });
});
/*
  app.put('/dodaj_sliku_atrakcije/:id', function (request, response){
 
   
    let id_atrakcije = request.params.id;
 
    console.log(`Received request to delete atrakcija with id: ${id_atrakcije}`); // Log the received id
 
    if (!id_atrakcije) {
      return response.status(400).send({ error: true, message: 'nedostaje id atrakcije' });
    }
 
   const deleteQuery = "UPDATE atrakcije SET slika = ? WHERE id_atrakcije = ?";
     //const deleteQuery = "DELETE  FROM atrakcije WHERE id_atrakcije = '${id}'";
    dbConn.query(deleteQuery,[slika],[id_atrakcije], function (error, results) {
      if (error) {
        console.log(`Error when executing the delete query: ${error}`); // Log any error from the query
        throw error;
      }
 
      console.log('Deletion result: ${JSON.stringify(results)}'); // Log the result of the deletion
 
      return response.send({ error: false, data: results, message: 'slika atrakcija je obrisana ' });
    });
  });*/

app.delete('/obrisi_ocjenu_atrakcije/:id', function (request, response) {

  let id_atrakcije = request.params.id;

  console.log(`Received request to delete atrakcija with id: ${id_atrakcije}`); // Log the received id

  if (!id_atrakcije) {
    return response.status(400).send({ error: true, message: 'nedostaje id atrakcije' });
  }

  const deleteQuery = "UPDATE atrakcije SET prosjecna_ocjena = NULL WHERE id_atrakcije = ?";
  //const deleteQuery = "DELETE  FROM atrakcije WHERE id_atrakcije = '${id}'";
  dbConn.query(deleteQuery, [id_atrakcije], function (error, results) {
    if (error) {
      console.log(`Error when executing the delete query: ${error}`); // Log any error from the query
      throw error;
    }

    console.log('Deletion result: ${JSON.stringify(results)}'); // Log the result of the deletion

    return response.send({ error: false, data: results, message: 'ocjena atrakcija je obrisana ' });
  });
});
//brisanje komentara

app.delete('/obrisi_komentar/:id', function (request, response) {

  let id_komentara = request.params.id;

  console.log(`Received request to delete komentar with id: ${id_komentara}`); // Log the received id

  if (!id_komentara) {
    return response.status(400).send({ error: true, message: 'nedostaje id komentara' });
  }

  const deleteQuery = "DELETE  FROM Komentari WHERE ID_komentara = ?";
  dbConn.query(deleteQuery, [id_komentara], function (error, results) {
    if (error) {
      console.log(`Error when executing the delete query: ${error}`); // Log any error from the query
      throw error;
    }

    console.log('Deletion result: ${JSON.stringify(results)}'); // Log the result of the deletion

    return response.send({ error: false, data: results, message: 'komentar je obrisan obrisi komentar.' });
  });
});

app.put('/atrakcije/azuriraj/:id', (req, res) => {
  console.log(req.body)
  const data = [req.body.naziv, req.body.opis, req.body.slika, req.body.prosjecna_ocjena, req.body.geografska_sirina, req.body.geografska_duzina, req.body.adresa, req.params.id]
  dbConn.query("UPDATE atrakcije SET naziv = ?, opis = ?,  slika = ?,  prosjecna_ocjena = ?,  geografska_sirina = ?,  geografska_duzina = ?,  adresa = ? WHERE id_atrakcije = ?", data, (err, result) => {
    if (err) {
      res.send('Error' + err)
    } else {
      res.send(result)
    }
  })
});
//port na kojem je app
app.listen(4200, function () {
  console.log('Node app is running on port 4200');
});
//module.exports = app;




// API endpoint za spremanje emaila i lozinke
app.post('/register', (req, res) => {
  const { korisnicko_ime, lozinka } = req.body;
  const uloga = 'korisnik';  // Postavljanje default vrijednosti 'korisnik' za uloga

  // Prvo hashiramo lozinku
  bcrypt.hash(lozinka, saltRounds, function (err, hashedPassword) {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).send({ status: 'error', message: 'Greška prilikom hashiranja lozinke.', error: err.message });
    }

   

    // Ako nema greške, nastavljamo s upisom u bazu
    dbConn.query('INSERT INTO users (korisnicko_ime, lozinka, uloga) VALUES (?, ?, ?)',
      [korisnicko_ime, hashedPassword, uloga], (error, results, fields) => {
        if (error) {
          console.error("Database error:", error);
          res.status(500).send({ status: 'error', message: 'Greška prilikom registracije.', error: error.sqlMessage });
        } else {
          res.send({ status: 'success', message: 'Uspješna registracija' });
        }
      });
  });
});

const bcrypt = require('bcrypt');
const saltRounds = 10;


app.get('/users', (req, res) => {
  dbConn.query('SELECT * FROM users', (error, results, fields) => {
    if (error) {
      console.error("Database error:", error);
      res.status(500).send({ status: 'error', message: 'Greška prilikom dohvata korisnika.', error: error.sqlMessage });
    } else {
      res.send({ status: 'success', data: results });
    }
  });
});

app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'DELETE FROM users WHERE id_korisnika = ?';

  dbConn.query(sql, userId, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Greška prilikom brisanja korisnika' });
      return;
    }

    console.log(`Deleted user with ID: ${userId}`);
    res.status(200).json({ message: 'Korisnik uspješno obrisan' });
  });
});


// Dodajemo endpoint za prijavu
app.post("/prijavi", function (req, res) {
  const { korisnicko_ime, lozinka } = req.body;

  dbConn.query(
    "SELECT * FROM `users` WHERE `korisnicko_ime` = ?",
    [korisnicko_ime],
    function (error, results) {
      if (error) {
        console.error("Error logging in:", error);
        return res.status(501).send({ error: true, message: "Problem prilikom prijave.", detailedError: error.sqlMessage });
      }
      if (results.length > 0) {
        bcrypt.compare(lozinka, results[0].lozinka, function (err, isMatch) {
          if (err) {
            console.error("Error comparing password:", err);
            console.log(lozinka);
            console.log(results[0].lozinka);
            return res.status(500).send({ error: true, message: "Problem prilikom provjere lozinke.", detailedError: err.message });
          }
          if (isMatch) {
            const token = jwt.sign({ id: results[0].id_korisnika, uloga: results[0].uloga }, config.secret, { expiresIn: '24h' });
            res.status(200).json({ success: true, message: "Login successful", token: token });
          } else {
            res.status(401).send({ success: false, message: 'Neispravno korisničko ime ili lozinka.' });
          }
        });
      } else {
        res.status(404).send({ success: false, message: 'Korisničko ime nije pronađeno.' });
      }
    }
  );
});

app.put('/updateOpis/:id', (req, res) => {
  const id = req.params.id;
  const { opis } = req.body;
  dbConn.query("UPDATE atrakcije SET opis = ? WHERE id_atrakcije = ?", [opis, id], (err, result) => {
    if (err) {
      console.error('Error updating opis:', err);
      res.status(500).send({ error: true, message: 'Error updating opis.' });
    } else {
      res.send({ error: false, message: 'Opis successfully updated.' });
    }
  });
});

//edit slika
app.put('/update-slika/:id', (req, res) => {
  const id = req.params.id;
  const { newImageUrl } = req.body;

  dbConn.query("UPDATE atrakcije SET slika = ? WHERE id_atrakcije = ?", [newImageUrl, id], (err, result) => {
    if (err) {
      console.error('Error updating image:', err);
      res.status(500).send({ error: true, message: 'Error updating image.' });
    } else {
      res.send({ error: false, message: 'Image successfully updated.' });
    }
  });
});
