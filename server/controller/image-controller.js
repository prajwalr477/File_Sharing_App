import File from '../models/file.js';
import dotenv from 'dotenv';

dotenv.config();

export const uploadImage = async (request, response) => {
    const fileObj = {
        path: request.file.path,
        name: request.file.originalname,
    }
    
    try {
        const file = await File.create(fileObj);
        console.log("File saved to database:", file);
        response.status(200).json({ path: `https://file-sharing-app-af8z.onrender.com/share-link/file/${file._id}`});
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ error: error.message });
    }
}

export const getImage = async (request, response) => {
    try {   
        const file = await File.findById(request.params.fileId);
        if (!file) {
            console.error("File not found in database");
            return response.status(404).json({ msg: "File not found" });
        }
        
        file.downloadCount++;

        await file.save();

        response.download(file.path, file.name);
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ msg: error.message });
    }
}