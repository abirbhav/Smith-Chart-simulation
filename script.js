    
 <script>
    var button = document.getElementById("button");
    
    var plot=false;
    var sketchProc = function(processingInstance) {
     with (processingInstance) {
        size(400, 400); 
        frameRate(30);
        
        // ProgramCodeGoesHere
        
        resetMatrix();
        translate(height/2,width/2);
        
        var r,x,l,f,c=3*pow(10,8);    //input value
        var flag=1;//can only be 1 or -1
        
        // Calculating real k
        var calcKr=function(r,x){
            var mag1=sq(r)+sq(x)-1;
            var mag2=sq(r+1)+sq(x);
            return mag1/mag2;
        };
        //Calculating imaginary k
        var calcKi=function(r,x){
            var mag1=2*x;
            var mag2=sq(r+1)+sq(x);
            return mag1/mag2;
        };
        
        
        //Calculating VSWR
        var calcS=function(){
            var s=(1+magK)/(1-magK);
            return s;
        };
        
        // resistance value
        var zReal = function(ax,by){
            var num = 1 - sq(ax) - sq(by);
            var den = sq(1-ax) + sq(by);
            return (num / den);
        };
        
        // reactance value
        var zImag = function(ax,by){
            var num = 2 * by;
            var den = sq(1-ax) + sq(by);
            return (num / den);
        };
        var kr,ki,magK,theta1=0,theta,theta2,a,b,rout,xout;
        var lambda;
        
        var calculate = function(){
            lambda=c/f;
            kr=calcKr(r,x);
            ki=calcKi(r,x);
            magK=sqrt(sq(kr)+sq(ki));
            
            //calculating amount to move in the s circle
            
            
            if((kr>=0 && ki>=0)||(kr>=0 && ki<0)){
            theta1=atan(ki/kr);
            }
            else if((kr<0 && ki>0)||(kr<0 && ki<0)){
                theta1=atan(ki/kr)+3.14159;
            }
            theta=4*3.1416*(l/lambda);
            theta2=-theta1+flag*theta;
            
            a=magK*cos(theta2);
            b=magK*sin(theta2);
                    
            rout=zReal(a,-b);
            xout=zImag(a,-b);
            
        }
                
        var drawSmithChart=function(){
            background(26, 3, 26);
            fill(221, 202, 230);
            stroke(5, 7, 26);
            ellipse(0,0,width,height);
            noFill();
            stroke(26, 3, 26);
            strokeWeight(0.2);
            //line(-200,0,200,0);
            for(var r=0.125;r<=8;r*=4){
                ellipse(200*r/(1+r),0,400/(1+r),400/(1+r));
            }
            for(var x=0.125;x<=8;x*=4){
                ellipse(200,-200/x,400/x,400/x);
            }
            for(var x=-0.125;x>=-8;x*=4){
                ellipse(200,-200/x,400/abs(x),400/abs(x));
            }
            strokeWeight(2);
            noFill(); 
        };
        calculate();
        var rtemp=0,xtemp=0,magKtemp=0,thetatemp=theta1,routtemp=0,xouttemp=0;
        
        var restartAnimation = function(){
            rtemp=0,xtemp=0,magKtemp=0,routtemp=0,xouttemp=0;
            drawSmithChart();
        }
        var onButtonClick = function(){
                var r0Val = document.getElementById("r0").value;
                var rVal = document.getElementById("r").value;
                var xVal = document.getElementById("x").value;
                var lVal = document.getElementById("l").value;
                var fVal = document.getElementById("f").value;
                var flagVal = document.getElementById("flag").value;
                
                plot=true;
                restartAnimation();
                
                r=parseFloat(rVal)/parseFloat(r0Val);
                x=parseFloat(xVal)/parseFloat(r0Val);
                l=parseFloat(lVal);
                f=parseFloat(fVal)*pow(10,6);
                flag=parseFloat(flagVal);
                calculate();
                thetatemp=theta1
                var answer=document.getElementById("answer");
                answer.innerHTML="<p> s:"+ calcS().toFixed(2) +"</p>";
                answer.innerHTML+="<p> K:"+ magK.toFixed(2) +" L"+(theta1*(180/3.14159)).toFixed(2)+" = "+kr.toFixed(2)+"+"+ki.toFixed(2)+"j"+"</p>"
                answer.innerHTML+="<p> Z:"+(rout*r0Val).toFixed(2)+"+"+(xout*r0Val).toFixed(2)+"j"+"</p>"
                //answer.innerHTML="Hi";
        }
        button.addEventListener("click", onButtonClick);
        var draw1=function(){
            
            drawSmithChart();
            
            //Plotting r circle
            stroke(232, 221, 21);
            ellipse(200*rtemp/(1+rtemp),0,400/(1+rtemp),400/(1+rtemp));
            if(rtemp<r){
            rtemp+=0.01;
            }
            if(rtemp>=r){
                rtemp=r;
            }
            stroke(26, 3, 26);
            
            //Plotting x circle
            if(abs(xtemp)<0.05){
                line(200,0,-200,0);
                //xtemp=x;
            }
            else{
                ellipse(200,-200/xtemp,400/abs(xtemp),400/abs(xtemp));
            }
            if(x<0){
                if(xtemp>x){
                    xtemp-=0.01;
                }
                else{
                    xtemp=x;
                }
            }
            else{
                if(xtemp<x){
                    xtemp+=0.01;
                }
                else{
                    xtemp=x;
                }
            }
            if(xtemp===x && rtemp===r){
                //Plotting s circle
                stroke(28, 145, 10);
                ellipse(0,0,400*magKtemp,400*magKtemp);
                if(magKtemp<magK){
                    magKtemp+=0.01;
                }
                if(magKtemp>magK){
                    magKtemp=magK;
                }
            }
        };
        var draw2=function(){
            //Plotting rout circle
            noFill();
            stroke(8, 48, 209);
                
            ellipse(200*routtemp/(1+routtemp),0,400/(1+routtemp),400/(1+routtemp));
            if(routtemp<rout){
            routtemp+=0.01;
            }
            if(routtemp>=rout){
                routtemp=rout;
            }
            //Plotting xout circle
            stroke(26,3,26);
            if(abs(xouttemp)<=0.04){
                line(200,0,-200,0);
            }  
            else{
            ellipse(200,-200/xouttemp,400/abs(xouttemp),400/abs(xouttemp));
            }
            if(xout<0){
                if(xouttemp>xout){
                    xouttemp-=0.01;
                }
                else{
                    xouttemp=xout;
                }
            }
            else{
                if(xouttemp<xout){
                    xouttemp+=0.01;
                }
                else{
                    xouttemp=xout;
                }
            }
        };
//main draw function        
        draw= function() {
            if(plot===false){
                drawSmithChart();
            }
            else{
            if(magKtemp!==magK){
                draw1();
            }
            
            if(magKtemp===magK){
                
                //Plotting point z
                fill(255, 0, 0);
                stroke(232, 221, 21);
                ellipse(kr*200,-ki*200,15,15);
                
                noStroke();
                var xrot=200*magK*cos(thetatemp);
                var yrot=-200*magK*sin(thetatemp);
                ellipse(xrot,yrot,5,5);
                if(-thetatemp<flag*theta2){
                    thetatemp-=flag*0.03;
                }
                
                if(-thetatemp<=theta2 && flag===-1){
                    thetatemp=-theta2;
                }
                else if(-thetatemp>=theta2 && flag===1){
                    thetatemp=-theta2;
                }
                
            }
            
            if(thetatemp===-theta2){
                
                draw1();
                draw2();
                strokeWeight(5);
                stroke(255, 0, 0);
                if(flag===1){
                arc(0,0,400*magK,400*magK,-theta1,theta2);
                }
                else{
                arc(0,0,400*magK,400*magK,theta2,-theta1);
                }
                strokeWeight(2);
                fill(255, 0, 0);
                stroke(232, 221, 21);
                ellipse(kr*200,-ki*200,15,15);
                
                strokeWeight(2);
                fill(255, 0, 0);
                stroke(37, 74, 222);
                ellipse(a*200,b*200,15,15);
                
            }
            /*
            if(xouttemp===xout && routtemp===rout){
                noLoop();
            }
            */
            }
        };

    }};

    // Get the canvas that Processing-js will use
    var canvas = document.getElementById("mycanvas"); 
    // Pass the function sketchProc (defined in myCode.js) to Processing's constructor.
    var processingInstance = new Processing(canvas, sketchProc); 
 </script>
