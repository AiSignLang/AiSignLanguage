

wordRouter.get("/:levelId", (req,res)=>{

    const levelId = req.params.levelId;
    if(!levelId || !isIDValid(levelId)){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    
})