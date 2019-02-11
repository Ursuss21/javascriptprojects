var Game = function(){
    
    var blockArray = [];
    var border;
    var block;
    var blockRotation;
    var blockColor = "blue";
    var nextBlockColor = "blue";
    var blockNumber = 0;
    var nextBlockNumber = 0;
    var nextRotation = 1;
    var first = true;
    var defeat = false;
    var points = 1;
    var lines = 0;
    var combo = 0;
    var score = document.getElementById("score");
    var line = document.getElementById("lines");
    var nextBlock;
    var isIntro = false;
    var isName = false;
    var playerName = "";
    var bestPlayer = document.cookie.split(';')[0].split('=')[1];
    var bestScore = document.cookie.split(';')[1].split('=')[1];

    function loadIntro(){
        isIntro = true;
        first = true;
        points = 1;
        lines = 0;
        score.innerHTML = "0000000";
        line.innerHTML = "00000";
        ctx1.clearRect(0,0,176,384);
        ctx2.clearRect(0,0,200,392);
        ctx3.clearRect(0,0,200,392);
        document.getElementById("intro").style.opacity = 1;
        document.getElementById("name").style.opacity = 1;
        document.getElementById("entername").style.opacity = 1;
        document.onkeydown = function (e) {
            if(isName && e.which == 13){
                playerName = document.getElementById("entername").value;
                document.getElementById("player").innerHTML = playerName;
                document.getElementById("betterscore").innerHTML = bestScore;
                document.getElementById("doneby").innerHTML = bestPlayer;
                fadeOut(document.getElementById("name"));
                fadeOut(document.getElementById("entername"));
                isName = false;
                document.getElementById("entername").blur();
                defeat = false;
                setTimeout(function(){
                    clearBlockArray();
                    loadBorders();
                    blockLoadWhenReady();
                },2000);
            }
            if(isIntro){
                fadeOut(document.getElementById("intro"));
                isIntro = false;
                isName = true;
                document.getElementById("entername").focus();
            }
        }
    }

    function fadeOut(el) {
        var fadeOutEffect = setInterval(function () {
            if (el.style.opacity < 0.05) {
                clearInterval(fadeOutEffect);
            } 
            else {
                el.style.opacity -= 0.05;
            }
        }, 100);
    }

    function clearBlockArray(){
        for(var i=0;i<24;i++){
            blockArray[i] = [];
            for(var j=0;j<11;j++){
                blockArray[i][j] = 0;
            }
        }
    }

    function loadBorders(){
        var borderImage = new Image();
        border = renderer({
            context: ctx2,
            width: 200,
            height: 392,
            image: borderImage,
            offsetX: 0,
            offsetY: 0
        });
        borderImage.src = "img/boardborder.png";
        border.render();
    }
    
    function randomizeColor(){
        var color = Math.floor(Math.random() * 6);
        switch(color){
            case 0:
                nextBlockColor = "blue";
                break;
            case 1:
                nextBlockColor = "brown";
                break;
            case 2:
                nextBlockColor = "green";
                break;
            case 3:
                nextBlockColor = "red";
                break;
            case 4:
                nextBlockColor = "white";
                break;
            case 5:
                nextBlockColor = "yellow";
                break;
        }
    }

    function randomizeNumber(){
        var type = Math.floor(Math.random() * 7);
        switch(type){
            case 0:
                nextBlockNumber = 1;
                nextRotation = 2;
                break;
            case 1:
                nextBlockNumber = 7;
                nextRotation = 4;
                break;
            case 2:
                nextBlockNumber = 8;
                nextRotation = 9;
                break;
            case 3:
                nextBlockNumber = 10;
                nextRotation = 11;
                break;
            case 4:
                nextBlockNumber = 14;
                break;
            case 5:
                nextBlockNumber = 15;
                nextRotation = 16;
                break;
            case 6:
                nextBlockNumber = 17;
                nextRotation = 18;
                break;
        }
    }

    function gameLoop(){
        if(!defeat){
            window.requestAnimationFrame(gameLoop);
            border.render();
            document.onkeydown = function (e) {
                switch (e.which) {
                    case 32:
                        rotateBlock();
                        break;
                    case 37:
                        if(!leftCollision()){
                            ctx1.clearRect(block.offsetX, block.offsetY, block.width, block.height);
                            block.offsetX-=16;
                            blockRotation.offsetX-=16;
                        }
                        break;
                    case 39:
                        if(!rightCollision()){
                            ctx1.clearRect(block.offsetX, block.offsetY, block.width, block.height);
                            block.offsetX+=16;
                            blockRotation.offsetX+=16;
                        }
                        break;
                    case 40:
                        if(!defeat){
                            ctx1.clearRect(block.offsetX, block.offsetY, block.width, block.height)
                            while(!bottomCollision()){
                                block.offsetY++;
                                blockRotation.offsetY++;
                            }
                            block.context = ctx2;
                            block.offsetX += 12;
                            blockRotation.offsetX += 12;
                            block.render();
                            updateBlockArray(parseInt(block.offsetX/16), parseInt(block.offsetY/16));
                            updatePoints(checkLine(),parseInt(block.offsetY/16));
                            checkDefeat();
                            blockLoadWhenReady();
                        }
                        break;
                }
            }
            if(!bottomCollision()){
                ctx1.clearRect(block.offsetX, block.offsetY, block.width, block.height)
                block.offsetY++;
                blockRotation.offsetY++;
            }
            else{
                block.context = ctx2;
                block.offsetX += 12;
                blockRotation.offsetX += 12;
                block.render();
                updateBlockArray(parseInt(block.offsetX/16), parseInt(block.offsetY/16));
                updatePoints(checkLine(),parseInt(block.offsetY/16));
                blockLoadWhenReady();
                checkDefeat();
                return;
            }
            block.render();
        }
    }

    function renderer(options) {

        var that = {}

        that.context = options.context;
        that.width = options.width;
        that.height = options.height;
        that.image = options.image;
        that.offsetX = options.offsetX
        that.offsetY = options.offsetY

        that.render = function () {
            that.context.drawImage(
                that.image,
                0,
                0,
                that.width,
                that.height,
                that.offsetX,
                that.offsetY,
                that.width,
                that.height);
        };

        return that;
    }

    function rotateBlock(){
        var rotatedImage = new Image();
        if(!bottomRotationCollision()){
            switch(blockNumber){
                case 0:
                    blockNumber = 1;
                    nextRotation = 2;
                    block.width = 48;
                    block.height = 32;
                    blockRotation.width = 32;
                    blockRotation.height = 48;
                    if(block.offsetX>=144){
                        block.offsetX = 128;
                    }
                    break;
                case 1:
                    blockNumber = 2;
                    nextRotation = 3;
                    block.width = 32;
                    block.height = 48;
                    blockRotation.width = 48;
                    blockRotation.height = 32;
                    break;
                case 2:
                    blockNumber = 3;
                    nextRotation = 0;
                    block.width = 48;
                    block.height = 32;
                    blockRotation.width = 32;
                    blockRotation.height = 48;
                    if(block.offsetX>=144){
                        block.offsetX = 128;
                    }
                    break;
                case 3:
                    blockNumber = 0;
                    nextRotation = 1;
                    block.width = 32;
                    block.height = 48;
                    blockRotation.width = 48;
                    blockRotation.height = 32;
                    break;
                case 4:
                    blockNumber = 5;
                    nextRotation = 6;
                    block.width = 48;
                    block.height = 32;
                    blockRotation.width = 32;
                    blockRotation.height = 48;
                    if(block.offsetX>=144){
                        block.offsetX = 128;
                    }
                    break;
                case 5:
                    blockNumber = 6;
                    nextRotation = 7;
                    block.width = 32;
                    block.height = 48;
                    blockRotation.width = 48;
                    blockRotation.height = 32;
                    break;
                case 6:
                    blockNumber = 7;
                    nextRotation = 4;
                    block.width = 48;
                    block.height = 32;
                    blockRotation.width = 32;
                    blockRotation.height = 48;
                    if(block.offsetX>=144){
                        block.offsetX = 128;
                    }
                    break;
                case 7:
                    blockNumber = 4;
                    nextRotation = 5;
                    block.width = 32;
                    block.height = 48;
                    blockRotation.width = 48;
                    blockRotation.height = 32;
                    break;
                case 8:
                    blockNumber = 9;
                    nextRotation = 8;
                    block.width = 16;
                    block.height = 64;
                    blockRotation.width = 64;
                    blockRotation.height = 16;
                    break;
                case 9:
                    blockNumber = 8;
                    nextRotation = 9;
                    block.width = 64;
                    block.height = 16;
                    blockRotation.width = 16;
                    blockRotation.height = 64;
                    if(block.offsetX>=112){
                        block.offsetX = 112;
                    }
                    break;
                case 10:
                    blockNumber = 11;
                    nextRotation = 12;
                    block.width = 32;
                    block.height = 48;
                    blockRotation.width = 48;
                    blockRotation.height = 32;
                    break;
                case 11:
                    blockNumber = 12;
                    nextRotation = 13;
                    block.width = 48;
                    block.height = 32;
                    blockRotation.width = 32;
                    blockRotation.height = 48;
                    if(block.offsetX>=144){
                        block.offsetX = 128;
                    }
                    break;
                case 12:
                    blockNumber = 13;
                    nextRotation = 10;
                    block.width = 32;
                    block.height = 48;
                    blockRotation.width = 48;
                    blockRotation.height = 32;
                    break;
                case 13:
                    blockNumber = 10;
                    nextRotation = 11;
                    block.width = 48;
                    block.height = 32;
                    blockRotation.width = 32;
                    blockRotation.height = 48;
                    if(block.offsetX>=144){
                        block.offsetX = 128;
                    }
                    break;
                case 15:
                    blockNumber = 16;
                    nextRotation = 15;
                    block.width = 32;
                    block.height = 48;
                    blockRotation.width = 48;
                    blockRotation.height = 32;
                    break;
                case 16:
                    blockNumber = 15;
                    nextRotation = 16;
                    block.width = 48;
                    block.height = 32;
                    blockRotation.width = 32;
                    blockRotation.height = 48;
                    if(block.offsetX>=144){
                        block.offsetX = 128;
                    }
                    break;
                case 17:
                    blockNumber = 18;
                    nextRotation = 17;
                    block.width = 32;
                    block.height = 48;
                    blockRotation.width = 48;
                    blockRotation.height = 32;
                    break;
                case 18:
                    blockNumber = 17;
                    nextRotation = 18;
                    block.width = 48;
                    block.height = 32;
                    blockRotation.width = 32;
                    blockRotation.height = 48;
                    if(block.offsetX>=144){
                        block.offsetX = 128;
                    }
                    break;
            }
        }
        ctx1.clearRect(0, 0, 176, 384);
        rotatedImage.src = "img/"+blockColor+"/"+blockColor+"block"+blockNumber+".png";
        block.image = rotatedImage;
    }

    function leftCollision(){
        var diff = block.height/8;
        for(var i = 0;i<diff;i++){
            var validationPixel = ctx2.getImageData(
                block.offsetX +11,
                block.offsetY + (i*diff) - 1,
                1,
                1).data;
            var validationPixelNumber = "" + validationPixel[0] + validationPixel[1] + validationPixel[2]
            if(validationPixelNumber != "000"){
                return true;
            }
        }
        return false;
    }

    function rightCollision(){
        var diff = block.height/8;
        for(var i = 0;i<diff;i++){
            var validationPixel = ctx2.getImageData(
                block.offsetX + block.width + 12,
                block.offsetY + (i*diff) - 1,
                1,
                1).data;
            var validationPixelNumber = "" + validationPixel[0] + validationPixel[1] + validationPixel[2]
            if(validationPixelNumber != "000"){
                return true;
            }
        }
        return false;
    }

    function bottomCollision(){
        var diff = block.width/16;
        switch(blockNumber){
            case 2:
                var validationPixel1 = ctx2.getImageData(
                    block.offsetX + 12,
                    block.offsetY + block.height,
                    1,
                    1).data;
                var validationPixel1Number = "" + validationPixel1[0] + validationPixel1[1] + validationPixel1[2]
                var validationPixel2 = ctx2.getImageData(
                    block.offsetX + 16 + 12,
                    block.offsetY + block.height/3,
                    1,
                    1).data;
                var validationPixel2Number = "" + validationPixel2[0] + validationPixel2[1] + validationPixel2[2]
                if(validationPixel1Number != "000" || validationPixel2Number != "000"){
                    return true;
                }
                break;
            case 3:
                for(var i=0;i<2;i++){
                    var validationPixel = ctx2.getImageData(
                        block.offsetX + i*16 + 12,
                        block.offsetY + block.height/2,
                        1,
                        1).data;
                    var validationPixelNumber = "" + validationPixel[0] + validationPixel[1] + validationPixel[2]
                    if(validationPixelNumber != "000"){
                        return true;
                    }
                }
                var validationPixel = ctx2.getImageData(
                    block.offsetX + 32 + 12,
                    block.offsetY + block.height,
                    1,
                    1).data;
                var validationPixelNumber = "" + validationPixel[0] + validationPixel[1] + validationPixel[2]
                if(validationPixelNumber != "000"){
                    return true;
                }
                break;
            case 5:
                for(var i=1;i<3;i++){
                    var validationPixel = ctx2.getImageData(
                        block.offsetX + i*16 + 12,
                        block.offsetY + block.height/2,
                        1,
                        1).data;
                    var validationPixelNumber = "" + validationPixel[0] + validationPixel[1] + validationPixel[2]
                    if(validationPixelNumber != "000"){
                        return true;
                    }
                }
                var validationPixel = ctx2.getImageData(
                    block.offsetX + 12,
                    block.offsetY + block.height,
                    1,
                    1).data;
                var validationPixelNumber = "" + validationPixel[0] + validationPixel[1] + validationPixel[2]
                if(validationPixelNumber != "000"){
                    return true;
                }
                break;
            case 6:
                var validationPixel1 = ctx2.getImageData(
                    block.offsetX + 12,
                    block.offsetY + block.height/3,
                    1,
                    1).data;
                var validationPixel1Number = "" + validationPixel1[0] + validationPixel1[1] + validationPixel1[2]
                var validationPixel2 = ctx2.getImageData(
                    block.offsetX + 16 + 12,
                    block.offsetY + block.height,
                    1,
                    1).data;
                var validationPixel2Number = "" + validationPixel2[0] + validationPixel2[1] + validationPixel2[2]
                if(validationPixel1Number != "000" || validationPixel2Number != "000"){
                    return true;
                }
                break;
            case 11:
            case 16:
                var validationPixel1 = ctx2.getImageData(
                    block.offsetX + 12,
                    block.offsetY + block.height,
                    1,
                    1).data;
                var validationPixel1Number = "" + validationPixel1[0] + validationPixel1[1] + validationPixel1[2]
                var validationPixel2 = ctx2.getImageData(
                    block.offsetX + 16 + 12,
                    block.offsetY + 2*(block.height/3),
                    1,
                    1).data;
                var validationPixel2Number = "" + validationPixel2[0] + validationPixel2[1] + validationPixel2[2]
                if(validationPixel1Number != "000" || validationPixel2Number != "000"){
                    return true;
                }
                break;
            case 12:
                for(var i=0;i<3;i++){
                    if(i!=1){
                        var validationPixel = ctx2.getImageData(
                            block.offsetX + i*16 + 12,
                            block.offsetY + block.height/2,
                            1,
                            1).data;
                        var validationPixelNumber = "" + validationPixel[0] + validationPixel[1] + validationPixel[2]
                        if(validationPixelNumber != "000"){
                            return true;
                        }
                    }
                }
                var validationPixel = ctx2.getImageData(
                    block.offsetX + 16 + 12,
                    block.offsetY + block.height,
                    1,
                    1).data;
                var validationPixelNumber = "" + validationPixel[0] + validationPixel[1] + validationPixel[2]
                if(validationPixelNumber != "000"){
                    return true;
                }
                break;
            case 13:
            case 18:
                var validationPixel1 = ctx2.getImageData(
                    block.offsetX + 12,
                    block.offsetY + 2*(block.height/3),
                    1,
                    1).data;
                var validationPixel1Number = "" + validationPixel1[0] + validationPixel1[1] + validationPixel1[2]
                var validationPixel2 = ctx2.getImageData(
                    block.offsetX + 16 + 12,
                    block.offsetY + block.height,
                    1,
                    1).data;
                var validationPixel2Number = "" + validationPixel2[0] + validationPixel2[1] + validationPixel2[2]
                if(validationPixel1Number != "000" || validationPixel2Number != "000"){
                    return true;
                }
                break;
            case 15:
                for(var i=1;i<3;i++){
                    var validationPixel = ctx2.getImageData(
                        block.offsetX + i*16 + 12,
                        block.offsetY + block.height,
                        1,
                        1).data;
                    var validationPixelNumber = "" + validationPixel[0] + validationPixel[1] + validationPixel[2]
                    if(validationPixelNumber != "000"){
                        return true;
                    }
                }
                var validationPixel = ctx2.getImageData(
                    block.offsetX + 12,
                    block.offsetY + block.height/2,
                    1,
                    1).data;
                var validationPixelNumber = "" + validationPixel[0] + validationPixel[1] + validationPixel[2]
                if(validationPixelNumber != "000"){
                    return true;
                }
                break;
            case 17:
                for(var i=0;i<2;i++){
                    var validationPixel = ctx2.getImageData(
                        block.offsetX + i*16 + 12,
                        block.offsetY + block.height,
                        1,
                        1).data;
                    var validationPixelNumber = "" + validationPixel[0] + validationPixel[1] + validationPixel[2]
                    if(validationPixelNumber != "000"){
                        return true;
                    }
                }
                var validationPixel = ctx2.getImageData(
                    block.offsetX + 32 + 12,
                    block.offsetY + block.height/2,
                    1,
                    1).data;
                var validationPixelNumber = "" + validationPixel[0] + validationPixel[1] + validationPixel[2]
                if(validationPixelNumber != "000"){
                    return true;
                }
                break;
            default:
                for(var i = 0;i<diff;i++){
                    var validationPixel = ctx2.getImageData(
                        block.offsetX + i*16 + 12,
                        block.offsetY + block.height,
                        1,
                        1).data;
                    var validationPixelNumber = "" + validationPixel[0] + validationPixel[1] + validationPixel[2]
                    if(validationPixelNumber != "000"){
                        return true;
                    }
                }
        }
        return false;
    }

    function bottomRotationCollision(){
        var diff = blockRotation.width/16;
        switch(nextRotation){
            case 2:
                var validationPixel1 = ctx2.getImageData(
                    blockRotation.offsetX + 12,
                    blockRotation.offsetY + blockRotation.height,
                    1,
                    1).data;
                var validationPixel1Number = "" + validationPixel1[0] + validationPixel1[1] + validationPixel1[2]
                var validationPixel2 = ctx2.getImageData(
                    blockRotation.offsetX + 16 + 12,
                    blockRotation.offsetY + blockRotation.height/3,
                    1,
                    1).data;
                var validationPixel2Number = "" + validationPixel2[0] + validationPixel2[1] + validationPixel2[2]
                if(validationPixel1Number != "000" || validationPixel2Number != "000"){
                    return true;
                }
                break;
            case 3:
                for(var i=0;i<2;i++){
                    var validationPixel = ctx2.getImageData(
                        blockRotation.offsetX + i*16 + 12,
                        blockRotation.offsetY + blockRotation.height/2,
                        1,
                        1).data;
                    var validationPixelNumber = "" + validationPixel[0] + validationPixel[1] + validationPixel[2]
                    if(validationPixelNumber != "000"){
                        return true;
                    }
                }
                var validationPixel = ctx2.getImageData(
                    blockRotation.offsetX + 32 + 12,
                    blockRotation.offsetY + blockRotation.height,
                    1,
                    1).data;
                var validationPixelNumber = "" + validationPixel[0] + validationPixel[1] + validationPixel[2]
                if(validationPixelNumber != "000"){
                    return true;
                }
                break;
            case 5:
                for(var i=1;i<3;i++){
                    var validationPixel = ctx2.getImageData(
                        blockRotation.offsetX + i*16 + 12,
                        blockRotation.offsetY + blockRotation.height/2,
                        1,
                        1).data;
                    var validationPixelNumber = "" + validationPixel[0] + validationPixel[1] + validationPixel[2]
                    if(validationPixelNumber != "000"){
                        return true;
                    }
                }
                var validationPixel = ctx2.getImageData(
                    blockRotation.offsetX + 12,
                    blockRotation.offsetY + blockRotation.height,
                    1,
                    1).data;
                var validationPixelNumber = "" + validationPixel[0] + validationPixel[1] + validationPixel[2]
                if(validationPixelNumber != "000"){
                    return true;
                }
                break;
            case 6:
                var validationPixel1 = ctx2.getImageData(
                    blockRotation.offsetX + 12,
                    blockRotation.offsetY + blockRotation.height/3,
                    1,
                    1).data;
                var validationPixel1Number = "" + validationPixel1[0] + validationPixel1[1] + validationPixel1[2]
                var validationPixel2 = ctx2.getImageData(
                    blockRotation.offsetX + 16 + 12,
                    blockRotation.offsetY + blockRotation.height,
                    1,
                    1).data;
                var validationPixel2Number = "" + validationPixel2[0] + validationPixel2[1] + validationPixel2[2]
                if(validationPixel1Number != "000" || validationPixel2Number != "000"){
                    return true;
                }
                break;
            case 11:
            case 16:
                var validationPixel1 = ctx2.getImageData(
                    blockRotation.offsetX + 12,
                    blockRotation.offsetY + blockRotation.height,
                    1,
                    1).data;
                var validationPixel1Number = "" + validationPixel1[0] + validationPixel1[1] + validationPixel1[2]
                var validationPixel2 = ctx2.getImageData(
                    blockRotation.offsetX + 16 + 12,
                    blockRotation.offsetY + 2*(blockRotation.height/3),
                    1,
                    1).data;
                var validationPixel2Number = "" + validationPixel2[0] + validationPixel2[1] + validationPixel2[2]
                if(validationPixel1Number != "000" || validationPixel2Number != "000"){
                    return true;
                }
                break;
            case 12:
                for(var i=0;i<3;i++){
                    if(i!=1){
                        var validationPixel = ctx2.getImageData(
                            blockRotation.offsetX + i*16 + 12,
                            blockRotation.offsetY + blockRotation.height/2,
                            1,
                            1).data;
                        var validationPixelNumber = "" + validationPixel[0] + validationPixel[1] + validationPixel[2]
                        if(validationPixelNumber != "000"){
                            return true;
                        }
                    }
                }
                var validationPixel = ctx2.getImageData(
                    blockRotation.offsetX + 16 + 12,
                    blockRotation.offsetY + blockRotation.height,
                    1,
                    1).data;
                var validationPixelNumber = "" + validationPixel[0] + validationPixel[1] + validationPixel[2]
                if(validationPixelNumber != "000"){
                    return true;
                }
                break;
            case 13:
            case 18:
                var validationPixel1 = ctx2.getImageData(
                    blockRotation.offsetX + 12,
                    blockRotation.offsetY + 2*(blockRotation.height/3),
                    1,
                    1).data;
                var validationPixel1Number = "" + validationPixel1[0] + validationPixel1[1] + validationPixel1[2]
                var validationPixel2 = ctx2.getImageData(
                    blockRotation.offsetX + 16 + 12,
                    blockRotation.offsetY + blockRotation.height,
                    1,
                    1).data;
                var validationPixel2Number = "" + validationPixel2[0] + validationPixel2[1] + validationPixel2[2]
                if(validationPixel1Number != "000" || validationPixel2Number != "000"){
                    return true;
                }
                break;
            case 15:
                for(var i=1;i<3;i++){
                    var validationPixel = ctx2.getImageData(
                        blockRotation.offsetX + i*16 + 12,
                        blockRotation.offsetY + blockRotation.height,
                        1,
                        1).data;
                    var validationPixelNumber = "" + validationPixel[0] + validationPixel[1] + validationPixel[2]
                    if(validationPixelNumber != "000"){
                        return true;
                    }
                }
                var validationPixel = ctx2.getImageData(
                    blockRotation.offsetX + 12,
                    blockRotation.offsetY + blockRotation.height/2,
                    1,
                    1).data;
                var validationPixelNumber = "" + validationPixel[0] + validationPixel[1] + validationPixel[2]
                if(validationPixelNumber != "000"){
                    return true;
                }
                break;
            case 17:
                for(var i=0;i<2;i++){
                    var validationPixel = ctx2.getImageData(
                        blockRotation.offsetX + i*16 + 12,
                        blockRotation.offsetY + blockRotation.height,
                        1,
                        1).data;
                    var validationPixelNumber = "" + validationPixel[0] + validationPixel[1] + validationPixel[2]
                    if(validationPixelNumber != "000"){
                        return true;
                    }
                }
                var validationPixel = ctx2.getImageData(
                    blockRotation.offsetX + 32 + 12,
                    blockRotation.offsetY + blockRotation.height/2,
                    1,
                    1).data;
                var validationPixelNumber = "" + validationPixel[0] + validationPixel[1] + validationPixel[2]
                if(validationPixelNumber != "000"){
                    return true;
                }
                break;
            default:
                for(var i = 0;i<diff;i++){
                    var validationPixel = ctx2.getImageData(
                        blockRotation.offsetX + i*16 + 12,
                        blockRotation.offsetY + blockRotation.height,
                        1,
                        1).data;
                    var validationPixelNumber = "" + validationPixel[0] + validationPixel[1] + validationPixel[2]
                    if(validationPixelNumber != "000"){
                        return true;
                    }
                }
        }
        return false;
    }

    function blockLoadWhenReady() {
        block = undefined;
        if(!first){
            blockColor = nextBlockColor;
            blockNumber = nextBlockNumber;
        }
        randomizeColor();
        randomizeNumber();
        if(first){
            blockColor = nextBlockColor;
            blockNumber = nextBlockNumber;
            randomizeColor();
            randomizeNumber();
        }
        nextBlockImage();
        var blockImage = new Image();
        switch(blockNumber){
            case 8:
                block = renderer({
                    context: ctx1,
                    width: 64,
                    height: 16,
                    image: blockImage,
                    offsetX: 64,
                    offsetY: 0
                });
                break;
            case 14:
                block = renderer({
                    context: ctx1,
                    width: 32,
                    height: 32,
                    image: blockImage,
                    offsetX: 64,
                    offsetY: 0
                });
                break;
            default:
                block = renderer({
                    context: ctx1,
                    width: 48,
                    height: 32,
                    image: blockImage,
                    offsetX: 64,
                    offsetY: 0
                });
        }
        switch(nextRotation){
            case 9:
                blockRotation = {
                    width: 16,
                    height: 64,
                    offsetX: 64,
                    offsetY: 0
                };
                break;
            case 14:
                blockRotation = {
                    width: 32,
                    height: 32,
                    offsetX: 64,
                    offsetY: 0
                };
                break;
            default:
                blockRotation = {
                    width: 32,
                    height: 48,
                    offsetX: 64,
                    offsetY: 0
                };
        }
        blockImage.src = "img/"+blockColor+"/"+blockColor+"block"+blockNumber+".png";
        if(first){
            blockImage.addEventListener("load", gameLoop());
            first = false;
        }
        block.render();
    }

    function updateBlockArray(x, y){
        switch(blockNumber){
            case 0:
                blockArray[y+2][x] = 1;
                blockArray[y][x+1] = 1;
                blockArray[y+1][x+1] = 1;
                blockArray[y+2][x+1] = 1;
                break;
            case 1:
                blockArray[y][x] = 1;
                blockArray[y+1][x] = 1;
                blockArray[y+1][x+1] = 1;
                blockArray[y+1][x+2] = 1;
                break;
            case 2:
                blockArray[y][x] = 1;
                blockArray[y+1][x] = 1;
                blockArray[y+2][x] = 1;
                blockArray[y][x+1] = 1;
                break;
            case 3:
                blockArray[y][x] = 1;
                blockArray[y][x+1] = 1;
                blockArray[y][x+2] = 1;
                blockArray[y+1][x+2] = 1;
                break;
            case 4:
                blockArray[y][x] = 1;
                blockArray[y+1][x] = 1;
                blockArray[y+2][x] = 1;
                blockArray[y+2][x+1] = 1;
                break;
            case 5:
                blockArray[y][x] = 1;
                blockArray[y+1][x] = 1;
                blockArray[y][x+1] = 1;
                blockArray[y][x+2] = 1;
                break;
            case 6:
                blockArray[y][x] = 1;
                blockArray[y][x+1] = 1;
                blockArray[y+1][x+1] = 1;
                blockArray[y+2][x+1] = 1;
                break;
            case 7:
                blockArray[y+1][x] = 1;
                blockArray[y+1][x+1] = 1;
                blockArray[y][x+2] = 1;
                blockArray[y+1][x+2] = 1;
                break;
            case 8:
                blockArray[y][x] = 1;
                blockArray[y][x+1] = 1;
                blockArray[y][x+2] = 1;
                blockArray[y][x+3] = 1;
                break;
            case 9:
                blockArray[y][x] = 1;
                blockArray[y+1][x] = 1;
                blockArray[y+2][x] = 1;
                blockArray[y+3][x] = 1;
                break;
            case 10:
                blockArray[y+1][x] = 1;
                blockArray[y][x+1] = 1;
                blockArray[y+1][x+1] = 1;
                blockArray[y+1][x+2] = 1;
                break;
            case 11:
                blockArray[y][x] = 1;
                blockArray[y+1][x] = 1;
                blockArray[y+2][x] = 1;
                blockArray[y+1][x+1] = 1;
                break;
            case 12:
                blockArray[y][x] = 1;
                blockArray[y][x+1] = 1;
                blockArray[y+1][x+1] = 1;
                blockArray[y][x+2] = 1;
                break;
            case 13:
                blockArray[y+1][x] = 1;
                blockArray[y][x+1] = 1;
                blockArray[y+1][x+1] = 1;
                blockArray[y+2][x+1] = 1;
                break;
            case 14:
                blockArray[y][x] = 1;
                blockArray[y+1][x] = 1;
                blockArray[y][x+1] = 1;
                blockArray[y+1][x+1] = 1;
                break;
            case 15:
                blockArray[y][x] = 1;
                blockArray[y][x+1] = 1;
                blockArray[y+1][x+1] = 1;
                blockArray[y+1][x+2] = 1;
                break;
            case 16:
                blockArray[y+1][x] = 1;
                blockArray[y+2][x] = 1;
                blockArray[y][x+1] = 1;
                blockArray[y+1][x+1] = 1;
                break;
            case 17:
                blockArray[y+1][x] = 1;
                blockArray[y][x+1] = 1;
                blockArray[y+1][x+1] = 1;
                blockArray[y][x+2] = 1;
                break;
            case 18:
                blockArray[y][x] = 1;
                blockArray[y+1][x] = 1;
                blockArray[y+1][x+1] = 1;
                blockArray[y+2][x+1] = 1;
                break;
        }
    }

    function checkLine(){
        var blocksInLine = 0;
        var broken = false;
        for(var i=0;i<24;i++){
            for(var j=0;j<11;j++){
                if(blockArray[i][j]==1){
                    blocksInLine++;
                }
                if(blocksInLine==11){
                    lineBreak(i);
                    broken = true;
                    combo++;
                }
            }
            blocksInLine = 0;
        }
        return broken;
    }

    function lineBreak(i){
        blockArray.splice(i, 1);
        blockArray.unshift([0,0,0,0,0,0,0,0,0,0,0]);
        canvas3.width = 200;
        canvas3.height = i*16;
        ctx3.drawImage(canvas2, 0,0);
        ctx2.clearRect(0,0,200, (i+1)*16)
        ctx2.drawImage(canvas3, 0,16);
        ctx1.clearRect(0, 0, 176, 384);
    }

    function updatePoints(isLine, row){
        if(isLine){
            points+= combo*100;
            lines+= combo;
            combo = 0;
            var zeros = addZeros(points, true);
            score.innerHTML = ""+zeros+points;
            var zeros = addZeros(lines, false);
            line.innerHTML = ""+zeros+lines;
        }
        else{
            points+= (25-row);
            var zeros = addZeros(points, true);
            score.innerHTML = ""+zeros+points;
        }
    }

    function addZeros(number, isScore){
        var counter = number.toString().length;
        if(isScore){
            counter = 7-counter;
        }
        else{
            counter = 5-counter;
        }
        var zeros = "";
        for(var i=0;i<counter;i++){
            zeros+="0";
        }
        return zeros;
    }

    function checkDefeat(){
        for(var i=0;i<3;i++){
            for(var j=0;j<11;j++){
                if(blockArray[i][j]==1){
                    defeat = true;
                    window.cancelAnimationFrame(gameLoop);
                    if(points>bestScore){
                        setCookie();
                    }
                    break;
                }
            }
        }
        if(defeat){
            isIntro = true;
            loadIntro();
        }
    }

    function setCookie() {
        var d = new Date();
        d.setTime(d.getTime() + (1000000*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = "player="+playerName+";" + expires + ";path=/";
        document.cookie = "score="+points+";" + expires + ";path=/";
    }
    
    function nextBlockImage(){
        var nextBlockImageDiv = document.getElementById("nextblock");
        nextBlockImageDiv.innerHTML = "<img src='img/"+nextBlockColor+"/"+nextBlockColor+"block"+nextBlockNumber+".png' alt='nextBlock'/>";
    }

    this.start = function(){
        loadIntro();
    }
}