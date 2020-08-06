import React,{useEffect,useRef,useState,useLayoutEffect,useCallback} from 'react';
import './Main.css';

const Main = () => {
    const [score, setScore] = useState(0);

    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    const [goalX, setGoalX] = useState(0);
    const [goalY, setGoalY] = useState(0);

    const [firstTime, setFirstTime] = useState(true);


    let wid,hei,ctx;
    // let ctx,x,y,wid,hei;
    // let goalx = getRandomInt(70,560);
    // let goaly = getRandomInt(70,420);
    const canvasRef = useRef(null);

    let prevPosArr = [];
   
    // x = 0; //intial horizontal position of drawn rectangle
    // y = 0; //intial vertical position of drawn rectangle
    wid = 70; //width of the drawn rectangle
    hei = 70; //height of the drawn rectangle
   
    // 
    if(localStorage.getItem('prevPosArr')&& firstTime===true){
        let arr = JSON.parse(localStorage.getItem('prevPosArr'));
        prevPosArr = [...arr];
        
        // setting postion game to last know state
        let l =prevPosArr.length;
        //  x= prevPosArr[l-1].x;
        //  y= prevPosArr[l-1].y;
        //  goalx = prevPosArr[l-1].goalx;
        //  goaly = prevPosArr[l-1].goaly;
        
        setX(()=>(prevPosArr[l-1].x));
        setY(()=>(prevPosArr[l-1].y));
        setGoalX(()=>(prevPosArr[l-1].goalx));
        setGoalY(()=>(prevPosArr[l-1].goaly));
        setFirstTime(()=>(false));
    };

    // fetching prevPosArr from localStorage; 
    useEffect(() => {
        if(localStorage.getItem('prevPosArr')){
            let arr = JSON.parse(localStorage.getItem('prevPosArr'));
            prevPosArr = [...arr];
            let l =prevPosArr.length;
            setScore(()=>(prevPosArr[l-1].score))
            drawBothRectangle(ctx);      
        };
    },[]);

    useLayoutEffect(() => {
        ctx = canvasRef.current.getContext('2d');
    });
    
    useEffect(() => {
        if(firstTime === false){
            drawBothRectangle(ctx);
        }
    },[x,y,goalX,goalY,score,]);

    const drawBothRectangle = (ctx) =>{
        ctx.clearRect(0,0,630, 490);
        drawRectPlayer(x,y,wid,hei); //Drawing rectangle on initial load
        drawRectGoal(goalX,goalY,wid,hei); //Drawing rectangle on initial load
    }

     // genrating random variable between given range and multiple of 70
     function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        let number=Math.floor(Math.random() * (max - min + 1)) + min;
        let res = number -number%70;
        return res;
    }

    // function to store prev Position
    const prevPostion = () =>{
        let l = prevPosArr.length;
        let obj={
            "x": x,
            "y": y,
            "goalx": goalX,
            "goaly": goalY,
            "score": score,
        };
        if(l<5){
            prevPosArr.push(obj);
        }else{
            prevPosArr.shift();
            prevPosArr.push(obj);
        }
        localStorage.setItem("prevPosArr",JSON.stringify(prevPosArr));
    }

    useEffect(() => {
        drawBothRectangle(ctx);
    }, [score])

    const collaspse=()=> {
        if(x===goalX  && y===goalY){
            setX(0);
            setY(0);
            setGoalX(()=>(getRandomInt(70,560)));
            setGoalY(()=>(getRandomInt(70,420)));
            setScore(()=>(score+1));
            ctx.clearRect(0,0,630, 490);
        };               
    };


    //Draw Rectangle function		
    function drawRectPlayer(x,y,wid,hei) {
        ctx.fillStyle = '#ffffff'; // Fill color of rectangle drawn
        ctx.fillRect(x, y, wid, hei); //This will draw a rectangle of 20x20
        drawTextBG(ctx,'Player',x,y);
    }

    function drawRectGoal(x,y,wid,hei) {
        ctx.fillStyle = '#15ff00'; // Fill color of rectangle drawn
        ctx.fillRect(x, y, wid, hei); //This will draw a rectangle of 40x40
        drawTextBG(ctx,'Goal',x,y);
    }
    
    function drawTextBG(ctx, txt, x, y) {
        let font = 'normal 20px Arial';
        /// lets save current state as we make a lot of changes        
        ctx.save();
    
        /// set font
        ctx.font = font;
    
        /// draw text from top - makes life easier at the moment
        ctx.textBaseline = 'top';  
        /// color for background
        ctx.fillStyle = '#f50';
        
        /// get width of text
        var width = ctx.measureText(txt).width;
        
        let leftOfwidth= (70-width)/2; 
        /// draw background rect assuming height of font
        ctx.fillRect(x, y, width, parseInt('font', 10));
        
        /// text color
        ctx.fillStyle = '#000';
    
        /// draw text on top
        ctx.fillText(txt, x+leftOfwidth, y+25);
        
        /// restore original state
        ctx.restore();
    }

    //move rectangle inside the canvas using arrow keys
    window.onkeydown = function(event) {
        var keyPr = event.keyCode; //Key code of key pressed
        if(keyPr === 39 && x<560){ 
            // x = x+70; //right arrow add 70 from current
            setX((x)=>(x+70));
        }
        else if(keyPr === 37 && x>0){
            // x = x-70; //left arrow subtract 70 from current
            setX((x)=>(x-70));
        }
        else if(keyPr === 38 && y>0) {
            // y = y-70; //top arrow subtract 70 from current
            setY((y)=>(y-70));
        }
        else if(keyPr === 40 && y<420){
            // y = y+70; //bottom arrow add 70 from current
            setY((y)=>(y+70));
        }
                
        // clearing anything drawn on canvas
        ctx.clearRect(0,0,630, 490);

        //Drawing rectangles at new position
        drawRectPlayer(x,y,wid,hei);
        drawRectGoal(goalX,goalY,wid,hei);
        // drawBothRectangle(ctx);
        prevPostion();
        setTimeout(() => {
            collaspse();    
        },100);
    
    };

    return (
        <div className="main-wrapper">
            <div className="score-undo-wrapp">
                <button type="button">undo</button>
                <span>Score : <span className="score-style">{score}</span></span>
            </div>
            <canvas id="svs" width="630" height="490" ref={canvasRef} className="canvas-style"></canvas>
            <div>
                <button>&uarr;</button> Move Up
                <button>&darr;</button> Move Down
                <button>&larr;</button> Move Left
                <button>&rarr;</button> Move Right
            </div>
           
        </div>
    )
}

export default Main

