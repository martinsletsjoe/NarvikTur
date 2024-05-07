// Import the mongodb client
const {MongoClient, GridFSBucket, ObjectId} = require("mongodb");

const Grid = require("gridfs-stream");
const fs = require("fs");

// Define the mongodb URL and databaseName
const url = "mongodb://localhost:27017";
const dbName = "gridfs-tutorial";

// Function to establish connection
async function connectToMongoDB() {
    const client = new MongoClient(url);
    try {
        // connect to the mongoDB server
        await client.connect();
        console.log("connected successfully to the mongoDB server");

        // select the database
        const db = client.db(dbName);
        console.log(`Using database: ${db.databaseName}`)
    } catch (err) {
        console.error("connection error:", err)
    }finally {
        // Close the connection
        await client.close();
    }
}

async function uploadFileToGridFS(filePath) {
    // connect to MongoDB
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(dbName);

    // create a GridFSBucket instance
    const bucket = new GridFSBucket(db, {bucketName: "uploads"});

    // Extract the file name from the path
    const fileName = filePath.split("/").pop();

    // create a read stream from the file and upload to GridFS
    const readStream = fs.createReadStream(filePath);
    const uploadStream = bucket.openUploadStream(fileName);

    // pipe the file into GridFs
    readStream.pipe(uploadStream);

    uploadStream.on("finish", () => {
        console.log("File uploaded successfully:", fileName);
        client.close();
    });

    uploadStream.on("error", (error) => {
        console.error("Error during file upload", error);
        client.close();
    })
}

async function downloadFileFromGridFS(fileName, outputPath) {
    // connect to mongoDB
    const client = new MongoClient(url);
    await client.connect();
    const db = client.db(dbName);

    // Create a gridFSbucket instance
    const bucket = new GridFSBucket(db, {bucketName: "uploads"});

    // create a write stream to save the file locally
    const writeStream = fs.createWriteStream(outputPath);

    // open a download stream from GridFS by filename
    const downloadStream = bucket.openDownloadStreamByName(fileName);

    // pipe the gridFS stream into the file system stream
    downloadStream.pipe(writeStream);

    downloadStream.on("end", () => {
        console.log("File downloadeded successfully: ", outputPath);
        client.close();
    });

    downloadStream.on("error", (error) => {
        console.error("error during file download: ", error);
        client.close();
    })
}

// connectToMongoDB();
// uploadFileToGridFS("C:/Users/M/Desktop/Narvik Tur bilder/Anders.jpg");
downloadFileFromGridFS('Anders.jpg', 'C:/Users/M/Desktop/Downloaded_Anders.jpg');

