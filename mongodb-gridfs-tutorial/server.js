const cors = require('cors');
const express = require("express");
const {MongoClient, GridFSBucket } = require("mongodb");
const multer = require("multer");
const fs = require("fs");

const app = express();
const port = 3000
const url = "mongodb://localhost:27017";
const dbName = "gridfs-tutorial";

app.use(cors());
// configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({storage});

app.get('/', (req, res) => {
    res.send(`
        <h1>Welcome to the GridFS API</h1>
        <p>Upload a file using the form below:</p>
        <form action="/upload" method="POST" enctype="multipart/form-data">
            <input type="file" name="file">
            <button type="submit">Upload</button>
        </form>
    `);
});

// file upload endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(dbName);
    const bucket = new GridFSBucket(db, {bucketName: "uploads"});

    // open an upload stream to GridFS
    const uploadStream = bucket.openUploadStream(req.file.originalname);

    // write the file buffer to gridFS stream
    uploadStream.write(req.file.buffer);
    uploadStream.end(() => {
        client.close();
        res.send("File uploaded successfully");
    });
});

// file download endpoint
app.get("/download/:fileName", async (req, res) => {
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(dbName);
    const bucket = new GridFSBucket(db, {bucketName: "uploads"});

    // open a download stream from GridFS
    const downloadStream = bucket.openDownloadStreamByName(req.params.fileName);

    // pipe the download stream to the response
    downloadStream.pipe(res);

    downloadStream.on("end", () => client.close());
    downloadStream.on("error", (error) => {
        console.error("Error during file download", error);
        client.close();
        res.status(404).send("File not found");
    });
});

// Endpoint to list all uploaded files
app.get('/list-files', async (req, res) => {
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(dbName);
    const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

    const files = [];
    const cursor = bucket.find({});

    await cursor.forEach((file) => {
        files.push(file.filename);
    });

    res.json(files);
    client.close();
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});