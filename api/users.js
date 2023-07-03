const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const app = express()
const port = 4000
const crypto = require('crypto');

// Create a MySQL connection pool
const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'test',
});

app.use(cors())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/', (req, res) => {
	const { firstName, lastName, email, password, pincode, address } = req.body;
	const created_at = new Date();

	const plainPassword = password

	// Create a MySQL connection from the connection pool
	pool.getConnection((err, connection) => {
		if (err) {
			console.error('Error getting MySQL connection: ', err);
			return res.status(500).json({ error: 'Failed to get MySQL connection.' });
		}

		// Define the SQL query
		const sql = 'INSERT INTO users (firstName, lastName, email, password, pincode, address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)';


		// Create the MD5 hash
		const md5Hash = crypto.createHash('md5').update(password).digest('hex');

		console.log('MD5 Hash:', md5Hash);

		// Execute the query with the provided inputs
		connection.query(sql, [firstName, lastName, email, md5Hash, pincode, address, created_at], (err, results) => {
			connection.release(); // Release the connection back to the pool

			if (err) {
				console.error('Error executing MySQL query: ', err);
				return res.status(500).json({
					error: 'Failed to execute MySQL query.'
				});
			}

			return res.status(200).json({
				message: 'Data inserted successfully.'
			});
		});
	});
})

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})