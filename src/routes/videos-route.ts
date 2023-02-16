import {Request, Response, Router} from "express";


export const videosRouter = Router({})


type availableResolutionsType = Array<string>

type videoType ={
    id:	number
    title:	string
    author:	string
    canBeDownloaded: boolean
    minAgeRestriction: any
    createdAt: string
    publicationDate: string
    availableResolutions: availableResolutionsType
}

let videos: Array<videoType> = [];
const resolutions: Array<string> = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];

// GET Returns All videos
videosRouter.get('/', (req: Request, res: Response) => {
    res.send(videos);
})

// POST add video
videosRouter.post('/', (req, res) => {
    let errorsMessages: Array<object> = []
    let title = req.body.title;
    if (!title || typeof title !== 'string' || title.length>40) {
        errorsMessages.push (
            {"message": "Incorrect title",
                "field": "title"} )
    }

    let author = req.body.author;
    if (!author || typeof author !== 'string' || author.length>20) {
        errorsMessages.push (
            {"message": "Incorrect author",
                "field": "author"} )
    }

    let availableResolutions = req.body.availableResolutions;
    if (!availableResolutions || !Array.isArray(availableResolutions)){
        errorsMessages.push (
            {"message": "Incorrect Resolutions",
                "field": "availableResolutions"} )
    }

    function checkAvailability(arr: any, val: any) { // попробовать через эвери
        return arr.some(function(arrVal:any) {
            return val === arrVal;
        });
    }
    for(let i = 0; i < availableResolutions.length; i++){
        if (!(checkAvailability(resolutions, availableResolutions[i]))) {
            errorsMessages.push (
                {"message": "Incorrect Resolutions Format",
                    "field": "availableResolutions"} )
        }
    }
    if (errorsMessages.length > 0){
        res.status(400).send({errorsMessages})
    }
    let currentDate = new Date();
    const day = currentDate.getDate()
    const dateInMs = currentDate.setDate(day)
    const date = new Date(dateInMs)

    let currentDatePlusOne =new Date(currentDate.setDate(currentDate.getDate() + 1));

    let newVideo = {
        id: +(new Date()),
        title: title,
        author: author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: date.toISOString(),
        publicationDate: currentDatePlusOne.toISOString(),
        availableResolutions: availableResolutions
    }
    videos.push(newVideo);
    res.status(201).send(newVideo);

})
// GET returns video by id
videosRouter.get('/:id', (req, res) => {
    let video = videos.find(v => v.id === +req.params.id);
    if (video) {
        res.send(video);
    }
    else {
        res.send(404);
    }
})

// DELETE delete video by id
videosRouter.delete('/:id', (req, res) => {
    for (let i = 0; i < videos.length; i++){
        if (videos[i].id === +req.params.id){
            videos.splice(i, 1);
            res.send(204);
            return;
        }
    }
    res.send(404);

})

// DELETE delete all data
    videosRouter.delete('/testing/all-data', (req, res) => {
    videos.splice(0);
    res.send(204);
})

// PUT update video by id
videosRouter.put('/:id', (req, res) => {
    let errorsMessages: Array<object> = [];
    let video: any = videos.find(v => v.id === +req.params.id);
    if (video){
    }
    else {
        res.send(404);
    }
    let title = req.body.title;
    if (!title || typeof title !== 'string' || title.length>40){
        errorsMessages.push (
            {"message": "Incorrect title",
                "field": "title"} )
    }

    let author = req.body.author;
    if (!author || typeof author !== 'string' || author.length>20){
        errorsMessages.push (
            {"message": "Incorrect author",
                "field": "author"} )
    }

    let canBeDownloaded = req.body.canBeDownloaded;
    if (typeof req.body.canBeDownloaded !== "boolean") {
        errorsMessages.push (
            {"message": "Incorrect canBeDownloaded",
                "field": "canBeDownloaded"} )
    }

    let minAgeRestriction = req.body.minAgeRestriction;
    if (!minAgeRestriction || typeof req.body.minAgeRestriction !== "number" || minAgeRestriction < 1 || minAgeRestriction > 18) {
        errorsMessages.push (
            {"message": "Wrong Age",
                "field": "minAgeRestriction"} )
    }
    let publicationDate = req.body.publicationDate;
    if (!publicationDate || typeof req.body.publicationDate !== "string"){
        errorsMessages.push (
            {"message": "wrong Date",
                "field": "publicationDate"} )
    }
    let availableResolutions = req.body.availableResolutions;
    if (!availableResolutions || !Array.isArray(availableResolutions)){
        errorsMessages.push (
            {"message": "Incorrect Resolutions",
                "field": "availableResolutions"} )
    }

    function checkAvailability(arr: any, val: any) {
        return arr.some(function(arrVal:any) {
            return val === arrVal;
        });
    }
    for(let i = 0; i < availableResolutions.length; i++){
        if (!(checkAvailability(resolutions, availableResolutions[i]))) {
            errorsMessages.push (
                {"message": "Incorrect Resolutions S",
                    "field": "availableResolutions"} )
            return;
        }
    }
    if (errorsMessages.length > 0){
        // let errorsField = ("errorsMessages: " + [errorsMessages]);
        res.status(400).send({errorsMessages});
    }
    video.title = title;
    video.author = author;
    video.canBeDownloaded = canBeDownloaded;
    video.minAgeRestriction = minAgeRestriction;
    video.publicationDate = publicationDate;
    video.availableResolutions = availableResolutions;
    res.status(204).send(video);
})