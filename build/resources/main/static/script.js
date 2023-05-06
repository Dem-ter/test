let numberDates = 4;
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

console.log(output.innerHTML);
slider.oninput = function() {
  output.innerHTML = this.value;
  numberDates = slider.value;
}

$(function() {
    $('#reloadButton').click(function(){
    'use strict';
    fetch('http://localhost:8080/returnListDate',{
        method: 'POST',
        body: numberDates.toString(),
    })
       .then(response => response.json())
       .then(data =>{

                    let columnLeftNamesInSequence = [],
                    columnRightNamesInSequence = [];
                    //Заполнение массиввов датами и событиями
                    for(let i = 0; i < data.length; i++) {
                        if (i != (data.length-1))
                            columnRightNamesInSequence[i] = data[i].date;
                        columnLeftNamesInSequence[i] = data[i].event;
                    }

                    let canvasBackgroundColor = "rgb(250, 250, 210)",
                    lineWidth = 5,
                    columnLeftIndexesInSequence = [],
                    columnLeftIndexesShuffled = [],
                    columnRightIndexesInSequence = [],
                    columnRightIndexesShuffled = [],
                    answeredIdsArray = [],
                    wrongAnsweredIdsArray = [],
                    allAnswersX = [],
                    allAnswersY = [],
                    allAnswersBool = [],
                    pairSelectedAnswers = [],
                    myIndex,
                    canvas,
                    context,
                    i,
                    x1,
                    y1,
                    x2,
                    y2,
                    offsetX = 0,
                    offsetY = 0,
                    windowHeight,
                    windowWidth,
                    titleSection,
                    clickButtonIdPrevious,
                    clickButtonIdCurrent,
                    clickColumnIdPrevious,
                    clickColumnIdCurrent,
                    previousColButton,
                    currentColButton,
                    leftAnswersIdArray = [],
                    rightAnswersIdArray = [],
                    isCurrentLeft = false;


                let click1 = false, click2 = false, clickId, clickColumn, lastColumn, clickButtonIndex, buttonLeftIndex, buttonRightIndex, notTwoClick = false;

                windowHeight = window.innerHeight;
                windowWidth = window.innerWidth;

                canvas = document.getElementById('canvas');
                canvas.height = windowHeight;
                canvas.width = windowWidth;
                canvas.style.backgroundColor = canvasBackgroundColor;

                titleSection = document.getElementById('title');
                offsetY = titleSection.offsetHeight;

                context = canvas.getContext('2d');

                // Случайные данные столбца

                for (i = 0; i < columnLeftNamesInSequence.length; i++) {
                    if (i != (columnLeftNamesInSequence.length-1)){
                        columnRightIndexesInSequence[i] = i;
                        columnRightIndexesShuffled[i] = i;
                    }
                    columnLeftIndexesInSequence[i] = i;
                    columnLeftIndexesShuffled[i] = i;
                }
                mixing(columnLeftIndexesShuffled);
                mixing(columnRightIndexesShuffled);

                // Генерация левого столбца
                $(".column-left").each(function (index) {
                $(this).html("");
                    for(i = 0; i < columnLeftIndexesInSequence.length; ++i) {

                        $(this).append(
                            '<div class="col-lg-12 left-button">' +
                                '<button id="btn-left-'+columnLeftIndexesShuffled[i]+'" type="button" class="button-column btn btn-primary btn-lg">'+columnLeftNamesInSequence[columnLeftIndexesShuffled[i]]+'</button>' +
                            '</div>'
                        );
                    }
                });
                // Генерация правого столбца
                $(".column-right").each(function (index) {
                $(this).html("");
                    for(i = 0; i < columnRightIndexesInSequence.length; ++i) {
                        $(this).append(
                            '<div class="col-lg-12 right-button">' +
                                '<button id="btn-right-'+columnRightIndexesShuffled[i]+'" type="button" class="button-column btn btn-primary btn-lg">'+columnRightNamesInSequence[columnRightIndexesShuffled[i]]+'</button>' +
                            '</div>'
                        );
                    }
                });



                function GetStartPoints() {
                  // Начальные точки
                    x1 = event.clientX;
                    y1 = event.clientY;
                }
                function GetEndPoints() {
                  // Конечные точки
                    x2 = event.clientX;
                    y2 = event.clientY;
                }
                // Отрисовка линии
                function drawLine() {
                    context.beginPath();
                    context.moveTo(x1, y1);
                    context.lineTo(x2, y2);
                    context.stroke();
                }
                document.querySelector("#checkButton").onclick = function(){
                    if (allAnswersBool.length==numberDates-1){
                        context.lineWidth = lineWidth+2;
                        for(let i = 0;i<allAnswersX.length;i+=2){
                            context.beginPath();
                            context.moveTo(allAnswersX[i], allAnswersY[i] - offsetY);
                            context.lineTo(allAnswersX[i+1], allAnswersY[i+1] - offsetY);
                            if(allAnswersBool[i/2]==0){
                                context.strokeStyle = 'red';
                            }else{
                                context.strokeStyle = 'green';
                            }
                            context.stroke();
                        }
                    }
                }


                document.onclick= function(event) {
                    if (event===undefined) event= window.event;
                    var target= 'target' in event? event.target : event.srcElement;
                    console.log(click1,click2);
                    if (target.id == undefined || target.id == 'title' || target.id == 'reloadButton' || target.id == 'checkButton' || target.id == 'demo' || target.id == 'myRange') {
                        return false;
                    }
                    if(target.id == '' || target.id == 'canvas'){
                        click1 = false
                        click2 = false
                        return false
                    }
                    if (click1 == false && click2 == false) {
                        clickId = target.id;
                        clickColumn = clickId.split('-')[1];
                        clickButtonIndex = clickId.split('-')[2];

                        clickColumnIdCurrent = clickColumn;
                        clickButtonIdCurrent = clickButtonIndex;

                        clickColumnIdPrevious = clickColumnIdCurrent;
                        clickButtonIdPrevious = clickButtonIdCurrent;

                        previousColButton = clickColumn + '-' + clickButtonIndex;

                        // Координаты щелчка
                        GetStartPoints();

                        if (clickColumn == 'left') {
                            buttonLeftIndex = clickButtonIndex;
                            lastColumn = clickColumn;
                            // Записываем в x1 позицию клика в левой колонкесмещенную
                            x1 = document.querySelector("#" + clickId).getBoundingClientRect().right;

                        } else if (clickColumn == 'right') {
                            buttonRightIndex = clickButtonIndex;
                            lastColumn = clickColumn;
                            // Записываем в x1 позицию клика в правой колонке смещенную
                            x1 = document.querySelector("#" + clickId).getBoundingClientRect().left;

                        }
                        click1 = true;

                    } else if (click2 == false) {
                        clickId = target.id;
                        clickColumn = clickId.split('-')[1];
                        clickButtonIndex = clickId.split('-')[2];

                        clickColumnIdCurrent = clickColumn;
                        clickButtonIdCurrent = clickButtonIndex;
                        currentColButton = clickColumn + '-' + clickButtonIndex;

                        if ((lastColumn != clickColumn) && jQuery.inArray(currentColButton, leftAnswersIdArray) == -1 &&
                                jQuery.inArray(currentColButton, rightAnswersIdArray)  == -1 &&
                                    jQuery.inArray(previousColButton, rightAnswersIdArray) == -1 &&
                                        jQuery.inArray(previousColButton, leftAnswersIdArray) == -1){
                                        console.log('lkj');

                           // console.log(currentColButton);
                           // console.log('ono'  + leftAnswersIdArray);
                           // console.log(jQuery.inArray(currentColButton, leftAnswersIdArray));
                           // console.log(leftAnswersIdArray);

                            if (clickColumn == 'left') {
                                buttonLeftIndex = clickButtonIndex;
                                leftAnswersIdArray.push(currentColButton);
                                rightAnswersIdArray.push(previousColButton);

                            } else if (clickColumn == 'right') {
                                buttonRightIndex = clickButtonIndex;
                                leftAnswersIdArray.push(previousColButton);
                                rightAnswersIdArray.push(currentColButton);
                            }

                            // Получаем конечные значения
                            GetEndPoints();

                            // Записываем в x2 позицию клика в правой колонке смещенную
                            if (clickColumn == 'left') {
                                x2 = document.querySelector("#" + clickId).getBoundingClientRect().right;

                            } else if (clickColumn == 'right') {
                                x2 = document.querySelector("#" + clickId).getBoundingClientRect().left;
                            }

                            context.beginPath();
                            context.moveTo(x1, y1 - offsetY);
                            context.lineTo(x2, y2 - offsetY);
                            context.lineWidth = lineWidth;
                            allAnswersX.push(x1,x2);
                            allAnswersY.push(y1,y2);
                            pairSelectedAnswers.push(previousColButton,currentColButton);

                            if (clickButtonIdCurrent == clickButtonIdPrevious) {
                                // Ответ правильный
                                allAnswersBool.push(1);
                                context.strokeStyle = 'black';
                                answeredIdsArray.push(clickButtonIdCurrent);
                                context.stroke();
                            } else {
                                // Ответ неправильный
                                allAnswersBool.push(0);
                                context.strokeStyle = 'black';
                                context.stroke();
                            }
                            click1 = false;
                            click2 = false;
                            notTwoClick = true;
                        }else{
                        console.log('gfr');
                            //Уборка неправильных ответов
                            GetEndPoints();
                            for(let i = 0;i<allAnswersX.length;i+=2){
                                if(((Math.abs(y1-allAnswersY[i])<= 50 && Math.abs(y2-allAnswersY[i+1])<= 50) ||
                                    (Math.abs(y2-allAnswersY[i])<= 50 && Math.abs(y1-allAnswersY[i+1])<= 50)) &&
                                        ((pairSelectedAnswers[i] == previousColButton && pairSelectedAnswers[i+1] == currentColButton) ||
                                            (pairSelectedAnswers[i+1] == previousColButton && pairSelectedAnswers[i] == currentColButton))){

                                                context.beginPath();
                                                context.moveTo(allAnswersX[i], allAnswersY[i] - offsetY);
                                                context.lineTo(allAnswersX[i+1], allAnswersY[i+1] - offsetY);
                                                context.lineWidth = lineWidth+5;
                                                context.strokeStyle = 'rgb(250, 250, 210)';
                                                context.stroke();

                                                pairSelectedAnswers.splice(pairSelectedAnswers.indexOf(previousColButton),1);
                                                pairSelectedAnswers.splice(pairSelectedAnswers.indexOf(currentColButton),1);

                                                myIndex = leftAnswersIdArray.indexOf(currentColButton);
                                                if (myIndex !== -1) {
                                                    leftAnswersIdArray.splice(myIndex, 1);
                                                }
                                                myIndex = leftAnswersIdArray.indexOf(previousColButton);
                                                if (myIndex !== -1) {
                                                    leftAnswersIdArray.splice(myIndex, 1);
                                                }

                                                myIndex = rightAnswersIdArray.indexOf(currentColButton);
                                                if (myIndex !== -1) {
                                                    rightAnswersIdArray.splice(myIndex, 1);
                                                }
                                                myIndex = rightAnswersIdArray.indexOf(previousColButton);
                                                if (myIndex !== -1) {
                                                    rightAnswersIdArray.splice(myIndex, 1);
                                                }

                                                allAnswersY.splice(i,2);
                                                allAnswersX.splice(i,2);
                                                allAnswersBool.splice(i/2,1);
                                                //Новая отрисовка линий после удаления одной пользователем
                                                context.lineWidth = lineWidth;
                                                for(let i = 0;i<allAnswersX.length;i+=2){
                                                    context.beginPath();
                                                    context.moveTo(allAnswersX[i], allAnswersY[i] - offsetY);
                                                    context.lineTo(allAnswersX[i+1], allAnswersY[i+1] - offsetY);
                                                    context.strokeStyle = 'black';
                                                    context.stroke();
                                                }
                                                click1 = false;
                                                click2 = false;
                                                notTwoClick = true;
                                                break;
                                }
                            }
                        }if(notTwoClick==false){
                            clickId = target.id;
                            clickColumn = clickId.split('-')[1];
                            clickButtonIndex = clickId.split('-')[2];

                            clickColumnIdCurrent = clickColumn;
                            clickButtonIdCurrent = clickButtonIndex;

                            clickColumnIdPrevious = clickColumnIdCurrent;
                            clickButtonIdPrevious = clickButtonIdCurrent;

                            previousColButton = clickColumn + '-' + clickButtonIndex;

                            // Координаты щелчка
                            GetStartPoints();

                            if (clickColumn == 'left') {
                                buttonLeftIndex = clickButtonIndex;
                                lastColumn = clickColumn;
                                // Записываем в x1 позицию клика в левой колонкесмещенную
                                x1 = document.querySelector("#" + clickId).getBoundingClientRect().right;

                            } else if (clickColumn == 'right') {
                                buttonRightIndex = clickButtonIndex;
                                lastColumn = clickColumn;
                                // Записываем в x1 позицию клика в правой колонке смещенную
                                x1 = document.querySelector("#" + clickId).getBoundingClientRect().left;

                            }
                            notTwoClick = false;
                            click1 = true;
                            click2 = false;
                        }
                        notTwoClick = false;
                    }
                };
                // Перемешка
                function mixing(a) {
                var j, x, i;
                for (i = a.length; i; i--) {
                        j = Math.floor(Math.random() * i);
                        x = a[i - 1];
                        a[i - 1] = a[j];
                        a[j] = x;
                    }
                }
        }); });
       })