$(function() {
    $('#reloadButton').click(function() {
    'use strict';
    fetch('http://localhost:8080/returnListDate')
       .then(response => response.json())
       .then(data =>{
            let columnLeftNamesInSequence = [data[0].event, data[1].event, data[2].event, data[3].event],
            columnRightNamesInSequence = [data[0].date, data[1].date, data[2].date, data[3].date],
            canvasBackgroundColor = "rgb(250, 250, 210)",
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

                let click1 = false, click2 = false, clickId, clickColumn, lastColumn, clickButtonIndex, buttonLeftIndex, buttonRightIndex;

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
                    columnLeftIndexesInSequence[i] = i;
                    columnLeftIndexesShuffled[i] = i;
                    columnRightIndexesInSequence[i] = i;
                    columnRightIndexesShuffled[i] = i;
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
                    if (allAnswersBool.length==4){
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
                if (target.id == undefined || target.id == 'title' || target.id == '' || target.id == 'canvas') {
                    return false;
                }
                if (click1 == false && click2 == false) {
                    clickId = target.id;
                    console.log(clickId);
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

                    if (clickColumn == 'left') {
                        isCurrentLeft = true;

                    } else if (clickColumn == 'right') {
                        isCurrentLeft = false;
                    }
                    if (lastColumn != clickColumn) {
                        if (isCurrentLeft == true) {
                        console.log('do' + leftAnswersIdArray);

                            if (jQuery.inArray(currentColButton, leftAnswersIdArray) == -1
                                && jQuery.inArray(previousColButton, rightAnswersIdArray) == -1) {
                               console.log(currentColButton);
                               console.log('ono'  + leftAnswersIdArray);
                               console.log(jQuery.inArray(currentColButton, leftAnswersIdArray));
                               console.log(leftAnswersIdArray);
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
                                x2 = document.querySelector("#" + clickId).getBoundingClientRect().right;

                                context.beginPath();
                                context.moveTo(x1, y1 - offsetY);
                                context.lineTo(x2, y2 - offsetY);
                                context.lineWidth = lineWidth;
                                allAnswersX.push(x1,x2);
                                allAnswersY.push(y1,y2);

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

                            }
                            isCurrentLeft = false;

                        } else if (isCurrentLeft == false) {

                            if (jQuery.inArray(currentColButton, rightAnswersIdArray) == -1
                                && jQuery.inArray(previousColButton, leftAnswersIdArray) == -1) {
                                if (clickColumn == 'left') {
                                    buttonLeftIndex = clickButtonIndex;

                                    leftAnswersIdArray.push(currentColButton);
                                    rightAnswersIdArray.push(previousColButton);

                                } else if (clickColumn == 'right') {
                                    buttonRightIndex = clickButtonIndex;
                                    leftAnswersIdArray.push(previousColButton);
                                    rightAnswersIdArray.push(currentColButton);
                                }

                                // Получаем координаты второго клика
                                GetEndPoints();

                                // Записываем в x2 позицию клика в правой колонке смещенную
                                x2 = document.querySelector("#" + clickId).getBoundingClientRect().left;
                                context.beginPath();
                                context.moveTo(x1, y1 - offsetY);
                                context.lineTo(x2, y2 - offsetY);
                                context.lineWidth = lineWidth;
                                allAnswersX.push(x1,x2);
                                allAnswersY.push(y1,y2);

                                if (clickButtonIdCurrent == clickButtonIdPrevious) {
                                    // Правильный ответ
                                    allAnswersBool.push(1);
                                    context.strokeStyle = 'black';
                                    answeredIdsArray.push(clickButtonIdCurrent);
                                    context.stroke();
                                } else {
                                    // Неправильный ответ
                                    allAnswersBool.push(0);
                                    context.strokeStyle = 'black';
                                    context.stroke();
                                }

                            }
                        }
                    }
                    click1 = false;
                    click2 = false;
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