import React, { Component } from 'react'
import './Main.css';
export class Game extends Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.escFunction = this.escFunction.bind(this);
    }

    state={
            x:0,
            y:0,
            goalX:0,
            goalY:0,
            score:0,
            prevPosArr:[], // arr to store prevpostion of player etc.
            wid : 70, //of the drawn rectangle
            hei : 70, //height of the drawn rectangle
    };

    componentDidMount(){
        // adding event listner
        document.addEventListener("keydown", this.escFunction, false);
        
        // upadating the state from session storage incase of refresh;
        if(sessionStorage.getItem('prevPosArr') && sessionStorage.getItem('prevPosArr').length !==0){
            let arr = JSON.parse(sessionStorage.getItem('prevPosArr'));
            let l =arr.length;
            
            // setting postion game to last know state
            this.setState((prevState)=>({
                ...prevState,
                x:arr[l-1].x,
                y:arr[l-1].y,
                goalX:arr[l-1].goalx,
                goalY:arr[l-1].goaly,
                score:arr[l-1].score,
                prevPosArr:arr,
                wid : 70, //of the drawn rectangle
                hei : 70, //height of the drawn rectangle
            }));
        }else{
            this.setState((prevState)=>({
                ...prevState,
                goalX:this.getRandomInt(70,560),
                goalY:this.getRandomInt(70,420),
            }));
        };
        this.drawBothRectangle();
    }

    componentWillUnmount(){
        // removing event listner
        document.removeEventListener("keydown", this.escFunction, false);
    }

    componentDidUpdate(){
        this.drawBothRectangle();
    }

    // genrating the ranodm integer based on argument min and  max 
    getRandomInt=(min, max)=>{
        min = Math.ceil(min);
        max = Math.floor(max);
        let number=Math.floor(Math.random() * (max - min + 1)) + min;
        let res = number -number%70;
        return res;
    }


    // Function for undo button
    undo =(event) =>{
        let updatedState = {
            ...this.state,
        }
        let obj;
        let upadatedArr = updatedState.prevPosArr;
        if(upadatedArr.length >0){
            obj = upadatedArr.pop();
            updatedState.x = obj.x;
            updatedState.y = obj.x;
            updatedState.goalX = obj.goalx;
            updatedState.goalY = obj.goaly;
            updatedState.score = obj.score;
            updatedState.prevPosArr = upadatedArr;
            this.setState((prevState)=>({
                ...updatedState,
            }));

            if(this.state.prevPosArr.length ===0){
                let arr = [];
                arr.push(obj);
                sessionStorage.setItem("prevPosArr",JSON.stringify(arr));
            }else{
                sessionStorage.setItem("prevPosArr",JSON.stringify(this.state.prevPosArr));
            }
           
        }
    }

    // draw function to draw both rect player and goal;
    drawBothRectangle = () =>{
        let ctx = this.canvasRef.current.getContext('2d');
        // clearing anything drawn on canvas
        ctx.clearRect(0,0,630, 490);
        //Drawing rectangle player         
        this.drawRectPlayer(ctx,this.state.x,this.state.y,this.state.wid,this.state.hei); 
        //Drawing rectangle on goal
        this.drawRectGoal(ctx,this.state.goalX,this.state.goalY,this.state.wid,this.state.hei); 
    }

    drawRectPlayer(ctx,x,y,wid,hei) {
        ctx.fillStyle = '#ffffff'; // Fill color of rectangle drawn
        ctx.fillRect(x, y, wid, hei); //This will draw a rectangle of 20x20
        this.drawTextBG(ctx,'Player',x,y);
    }

    drawRectGoal=(ctx,x,y,wid,hei)=>{
        ctx.fillStyle = '#15ff00'; // Fill color of rectangle drawn
        ctx.fillRect(x, y, wid, hei); //This will draw a rectangle of 40x40
        this.drawTextBG(ctx,'Goal',x,y);
    }

    // function to check if player made to the goal
    collaspse=()=> {
        if(this.state.x===this.state.goalX  && this.state.y===this.state.goalY){
            this.setState((prevState)=>({
                ...prevState,
                x:0,
                y:0,
                goalX:this.getRandomInt(70,560),
                goalY:this.getRandomInt(70,420),
                score: prevState.score + 1,
            }));
            // store new random genarted path;
            this.prevPostion();
        };               
    };

    // function to store prev state
    prevPostion = () =>{
        let updateState = {
            ...this.state,
        }
        let upadatedArr = updateState.prevPosArr;
        let l = upadatedArr.length;
        let obj={
            x: updateState.x,
            y: updateState.y,
            goalx: updateState.goalX,
            goaly: updateState.goalY,
            score: updateState.score,
        };
        if(l<5){
            upadatedArr.push(obj);
        }else{
            upadatedArr.shift(); 
            upadatedArr.push(obj);
        }
        updateState.prevPosArr = upadatedArr;
        this.setState((prevState)=>({
            ...updateState,
        }));
        if(this.state.prevPosArr !==[]){
            sessionStorage.setItem("prevPosArr",JSON.stringify(this.state.prevPosArr));
        }
        
    }

    escFunction =(event)=>{
        var keyPr = event.keyCode; //Key code of key pressed
        if(keyPr === 39 && this.state.x<560){ 
            //right arrow add 70 from current
            this.setState((prevState)=>({
                ...prevState,
                x: prevState.x+70,
            }))
        }
        else if(keyPr === 37 && this.state.x>0){
            //left arrow subtract 70 from current
            this.setState((prevState)=>({
                ...prevState,
                x: prevState.x-70,
            }))
        }
        else if(keyPr === 38 && this.state.y>0) {
            //top arrow subtract 70 from current
            this.setState((prevState)=>({
                ...prevState,
                y: prevState.y-70,
            }))
        }
        else if(keyPr === 40 && this.state.y<420){
            //bottom arrow add 70 from current
            this.setState((prevState)=>({
                ...prevState,
                y: prevState.y+70,
            }))
        }
        //Drawing rectangles at new position
        this.drawBothRectangle();
        setTimeout(() => {
            this.collaspse();    
        },100);
        this.prevPostion();
    };

    // to add text on rectangle as player and goal;
    drawTextBG=(ctx, txt, x, y)=>{
        let font = 'normal 20px Arial';
       
        //lets save current state as we make a lot of changes        
        ctx.save();
       
        // set font
        ctx.font = font;
       
        //draw text from top - makes life easier at the moment
        ctx.textBaseline = 'top';  
        //color for background
       
        ctx.fillStyle = '#f50';
       
        //get width of text
        var width = ctx.measureText(txt).width;
        let leftOfwidth= (70-width)/2; 
       
        //draw background rect assuming height of font
        ctx.fillRect(x, y, width, parseInt('font', 10));
       
        // text color
        ctx.fillStyle = '#000';
       
        // draw text on top
        ctx.fillText(txt, x+leftOfwidth, y+25);
       
        //restore original state
        ctx.restore();
    }

    render() {
        return (
            <div className="main-wrapper">
                <div className="score-undo-wrapp">
                    <button type="button" onClick={this.undo}>undo</button>
                    <span>Score : <span className="score-style">{this.state.score}</span></span>
                </div>
                <canvas id="svs" width="630" height="490" ref={this.canvasRef} className="canvas-style"></canvas>
                <div>
                    <button>&uarr;</button> Move Up
                    <button>&darr;</button> Move Down
                    <button>&larr;</button> Move Left
                    <button>&rarr;</button> Move Right
                </div>
            </div>
        )
    }
}
export default Game;

