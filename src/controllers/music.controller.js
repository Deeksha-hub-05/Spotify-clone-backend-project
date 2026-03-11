const musicModel=require('../models/music.model');
const albumModel=require("../models/album.model");
const {uploadFile}=require('../services/storage.service');
const  jwt= require('jsonwebtoken');


async function createMusic(req,res){    

    const {title}=req.body;
    const file=req.file;

    const result=await uploadFile(file.buffer.toString('base64'))

    const music=await musicModel.create({
        uri:result.url,
        title,
        artist:req.user.id,
    })

    res.status(201).json({
        message:"Music created successfully",
        music:{
            id:music._id,
            uri:music.uri,
            title:music.title,
            artist:music.artist,
        }
    })

}

async function createAlbum(req,res){

        const {title,musics}=req.body;
        const album=await albumModel.create({
            title,
            artists:req.user.id,
            musics:musics,
        })
        
        res.status(201).json({
            message:"Album created successfully",
            album:{
                id:album._id,
                title:album.title,
                artists:album.artists,
                musics:album.musics,
            }
        })

    
}

async function getAllMusics(req,res){
    const musics=await musicModel.find().populate("artist","username email")

    res.status(200).json({
        message:"Musics fetched successfullly",
        musics:musics,
    })

}

async function getAllAlbums(req,res){
    const albums=await albumModel.find().select("title artists").populate("artists","username email")

    res.status(200).json({
        message:"Albums fetched successfully",
        albums:albums,
    })

}

async function getAlbumById(req,res){
    try {
        const {albumId}=req.params;

        if(!albumId){
            return res.status(400).json({
                message:"Album ID is required"
            })
        }

        const album=await albumModel.findById(albumId).populate("artists","username email")

        if(!album){
            return res.status(404).json({
                message:"Album not found"
            })
        }

        res.status(200).json({
            message:"Album fetched successfully",
            album:album,
        })
    } catch(error) {
        res.status(500).json({
            message:"Error fetching album",
            error:error.message
        })
    }
}
module.exports={createMusic,createAlbum,getAllMusics,getAllAlbums,getAlbumById}


