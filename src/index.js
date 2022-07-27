const express = require("express");
const app = express();
const fs = require("fs");
var storage = require("@azure/storage-blob")


const { BlobServiceClient, StorageSharedKeyCredential, StorageSharedKeyCredentialPolicy, BlobSASPermissions } = require('@azure/storage-blob');    

// optional but suggested - connect with managed identity
const { DefaultAzureCredential } = require('@azure/identity');

//Blob SAS token
//sp=r&st=2022-07-05T06:38:32Z&se=2022-07-05T14:38:32Z&spr=https&sv=2021-06-08&sr=c&sig=Xyqnokm35A3koX8oqU%2BroaJlUtrrrf%2F9of9H53Hi86c%3D

//Blob SAS URL
//https://sccvideofeasibility2.blob.core.windows.net/sccvideo?sp=r&st=2022-07-05T06:38:32Z&se=2022-07-05T14:38:32Z&spr=https&sv=2021-06-08&sr=c&sig=Xyqnokm35A3koX8oqU%2BroaJlUtrrrf%2F9of9H53Hi86c%3D

var accountName = "sccvideofeasibility2";
var accountKey = "I/cUcIn+KEseCcl0nveqOHBKOygj81+davq2Hf/rhXcouwSzBmYCSd4dnewM5q85Qcvv33wqB/gG+AStuGcbJA==";//DefaultEndpointsProtocol=https;AccountName=sccvideofeasibility2;AccountKey=I/cUcIn+KEseCcl0nveqOHBKOygj81+davq2Hf/rhXcouwSzBmYCSd4dnewM5q85Qcvv33wqB/gG+AStuGcbJA==;EndpointSuffix=core.windows.net


//accountName = "dhdcsccstr02dev";
//accountKey = "cv/2mUWCsRk/kl3FjJoTbGVX79o45HJexxz3mVlkI95fAxGexehesFAe9XSZWyK5WV+zLef5Oxco9vOxbTJ0RQ==";


//accountName = "dhdcsccstr02dev";
//accountKey = "cv/2mUWCsRk/kl3FjJoTbGVX79o45HJexxz3mVlkI95fAxGexehesFAe9XSZWyK5WV+zLef5Oxco9vOxbTJ0RQ==";
const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

//container: sccvideo
//pexels-thirdman-8485240.mp4
//production ID.mp4

var containerName = "sccvideo";
var blobName = "4480817189177213-productionID.mp4";

//containerName = "scc-nwrdev-blob-001";
//blobName = "100000000007/VideoMaster/エシックスカードの唱和/videovui.mp4";


var connString = "DefaultEndpointsProtocol=https;AccountName=sccvideofeasibility2;AccountKey=I/cUcIn+KEseCcl0nveqOHBKOygj81+davq2Hf/rhXcouwSzBmYCSd4dnewM5q85Qcvv33wqB/gG+AStuGcbJA==;EndpointSuffix=core.windows.net";
//connString = "DefaultEndpointsProtocol=https;AccountName=dhdcsccstr02dev;AccountKey=cv/2mUWCsRk/kl3FjJoTbGVX79o45HJexxz3mVlkI95fAxGexehesFAe9XSZWyK5WV+zLef5Oxco9vOxbTJ0RQ==;EndpointSuffix=core.windows.net";

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

async function downloadBlobAsStream(containerClient, blobName, writableStream) {

    const blobClient = await containerClient.getBlobClient(blobName);

    const downloadResponse = await blobClient.download();

    downloadResponse.readableStreamBody.pipe(writableStream);
    console.log(`download of ${blobName} succeeded`);
}

app.get("/video", function (req, res) {
		
    //const videoStream = fs.createReadStream(videoPath, { start, end });
	const blobServiceClient = BlobServiceClient.fromConnectionString(connString);
	const containerClient = blobServiceClient.getContainerClient(containerName);
	const blobClient = containerClient.getBlockBlobClient(blobName);
	

	
	
	var range = req.headers.range;
    if (!range) {
        range=bytes="200-1000"
    }
   
    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;
	const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
    "VideoSize":videoSize
	};
	res.writeHead(200, headers);
	downloadBlobAsStream(containerClient,blobName, res);
    //videoStream.pipe(res);
});

app.get("/video2", async (req, res) => {
    
    try {
        // Create the BlobServiceClient object which will be used to create a container client
        const blobServiceClient = BlobServiceClient.fromConnectionString(
            connString
        );
        
        // Get a reference to a container
        const containerClient = blobServiceClient.getContainerClient(containerName);
        
        // Get a block blob client
        const blobClient = containerClient.getBlockBlobClient(blobName);
        var kk = (await blobClient.getProperties()).contentLength;
        var bb = (await blobClient.getProperties()).metadata.Range;
        var cc = (await blobClient.getProperties()).contentLength;

        console.log('\nDownloaded blob content1...');
            const downloadResponse = await blobClient.download();
            //res.writeHead(200, {"Content-Type": "video/mp4"}); 
            
        res.writeHead(200, {"Content-Type": downloadResponse.contentType,
            "accept-ranges":"bytes", "Range": "bytes=0-1"
        })
        downloadResponse.readableStreamBody.pipe(res);			
        
    } catch (err) {
        console.error(err);
        //res.sendStatus(500);
    }

});


app.get("/safari", async (req, res) => {
    
    try {
        // Create the BlobServiceClient object which will be used to create a container client
        const blobServiceClient = BlobServiceClient.fromConnectionString(
            connString
        );
        
        // Get a reference to a container
        const containerClient = blobServiceClient.getContainerClient(containerName);
        
        // Get a block blob client
        const blobClient = containerClient.getBlockBlobClient(blobName);
        var bb = (await blobClient.getProperties()).metadata.Range;
        var contentLength = (await blobClient.getProperties()).contentLength;

        console.log('\nDownloaded blob content1...');
        const downloadResponse = await blobClient.download();
        //res.writeHead(200, {"Content-Type": "video/mp4"}); 
        
        const options = {};

        let start;
        let end;

        const range = req.headers.range;
        if (range) {
            const bytesPrefix = "bytes=";
            if (range.startsWith(bytesPrefix)) {
                const bytesRange = range.substring(bytesPrefix.length);
                const parts = bytesRange.split("-");
                if (parts.length === 2) {
                    const rangeStart = parts[0] && parts[0].trim();
                    if (rangeStart && rangeStart.length > 0) {
                        options.start = start = parseInt(rangeStart);
                    }
                    const rangeEnd = parts[1] && parts[1].trim();
                    if (rangeEnd && rangeEnd.length > 0) {
                        options.end = end = parseInt(rangeEnd);
                    }
                }
            }
        }

        res.setHeader("Content-Type", "video/mp4");

        if (req.method === "HEAD") {
            res.statusCode = 200;
            res.setHeader("accept-ranges", "bytes");
            res.setHeader("content-length", contentLength);
            res.end();
        }
        else {       
            // Listing 5.
            let retrievedLength;
            if (start !== undefined && end !== undefined) {
                retrievedLength = (end+1) - start;
            }
            else if (start !== undefined) {
                retrievedLength = contentLength - start;
            }
            else if (end !== undefined) {
                retrievedLength = (end+1);
            }
            else {
                retrievedLength = contentLength;
            }

            // Listing 6.
            res.statusCode = start !== undefined || end !== undefined ? 206 : 200;

            res.setHeader("content-length", retrievedLength);

            if (range !== undefined) {  
                res.setHeader("content-range", `bytes ${start || 0}-${end || (contentLength-1)}/${contentLength}`);
                res.setHeader("accept-ranges", "bytes");
            }

            // Listing 7.
            downloadResponse.readableStreamBody.pipe(res);	
        }
       		
        
    } catch (err) {
        console.error(err);
        //res.sendStatus(500);
    }

});


app.get("/getSasUrl", async (req, res) => {

    try {
        // Create the BlobServiceClient object which will be used to create a container client
        const blobServiceClient = BlobServiceClient.fromConnectionString(
            connString
        );
        
        // Get a reference to a container
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Get a block blob client
        const blobClient = containerClient.getBlockBlobClient(blobName);

        const blobSAS = storage.generateBlobSASQueryParameters({
            containerName, 
            blobName, 
            permissions: storage.BlobSASPermissions.parse("racwd"), 
            startsOn: new Date(),
            expiresOn: new Date(new Date().valueOf() + 86400*10)
          },
          sharedKeyCredential 
        ).toString();
      
          const sasUrl= blobClient.url+"?"+blobSAS;
          var a = new Date().valueOf();
          console.log(a);
          console.log(new Date(a + 86400).valueOf());
          console.log(sasUrl);
          res.write(sasUrl);
        
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }

});
	
app.get("/video3", async (req, res) => {
    
        try {
            // Create the BlobServiceClient object which will be used to create a container client
            //const blobServiceClient = BlobServiceClient.fromConnectionString(
            //    connString
            //);

			const blobServiceClient = new BlobServiceClient(
			  `https://${accountName}.blob.core.windows.net`,
			  sharedKeyCredential
			);
            // Get a reference to a container
            const containerClient = blobServiceClient.getContainerClient(containerName);
    
            // Get a block blob client
            const blobClient = containerClient.getBlockBlobClient(blobName);
    
            console.log('\nDownloaded blob content1...');
			 const downloadResponse = await blobClient.download();
             //res.writeHead(200, {"Content-Type": "video/mp4"});             
            
            res.writeHead(200, {"Content-Type": downloadResponse.contentType})
			downloadResponse.readableStreamBody.pipe(res);			
    
        } catch (err) {
            console.error(err);
            //res.sendStatus(500);
        }
    
    });
	
app.get("/download", async (req, res) => {
    
        try {
            // Create the BlobServiceClient object which will be used to create a container client
            const blobServiceClient = BlobServiceClient.fromConnectionString(
                connString
            );
    


    
            // Get a reference to a container
            const containerClient = blobServiceClient.getContainerClient(containerName);
    
            // Get a block blob client
            const blobClient = containerClient.getBlockBlobClient(blobName);
    
            console.log('\nDownloaded blob content...');
			 const downloadResponse = await blobClient.download();
			//res.writeHead(200, {"Content-Type": "application/octet-stream"});
			downloadResponse.readableStreamBody.pipe(res);			
    
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    
    });

app.listen(8000, function () {
    console.log("Listening on port 8000!");
});
