var currentStep = 0;
var totalSteps = 4;
var currentScore = 0;
var maxScore = 100;
var startTime = null;
var endTime = null;
var stepsData = [
    { name: "Крок 1: Кросворд", score: 30, completed: false },
    { name: "Крок 2: Підбір сервісів", score: 35, completed: false },
    { name: "Крок 3: Провайдери", score: 35, completed: false },
    { name: "Результати", score: 0, completed: false }
];

$(document).ready(function() {
    initTrainer();
});

function initTrainer() {
    startTime = new Date();
    updateBreadcrumb();
    updateProgress();
    loadStep(0);
    
    $('#nextController').off('click').on('click', function() {
        if (currentStep < totalSteps - 1) {
            currentStep++;
            loadStep(currentStep);
            updateBreadcrumb();
            updateProgress();
            updateNavButtons();
        }
    });
    
    $('#prevController').off('click').on('click', function() {
        if (currentStep > 0) {
            currentStep--;
            loadStep(currentStep);
            updateBreadcrumb();
            updateProgress();
            updateNavButtons();
        }
    });
    
    $('#langSelector').off('change').on('change', function() {
        changeLanguage($(this).val());
    });
    
    updateNavButtons();
}

function loadStep(stepIndex) {
    var stepFiles = ['step1.html', 'step2.html', 'step3.html', 'results.html'];
    
    $.ajax({
        url: 'trainer/' + stepFiles[stepIndex],
        success: function(html) {
            $('.stepspace').html(html);
            
            if (stepIndex === 0) {
                setTimeout(initStep1, 100);
            } else if (stepIndex === 1) {
                setTimeout(initStep2, 100);
            } else if (stepIndex === 2) {
                setTimeout(initStep3, 100);
            } else if (stepIndex === 3) {
                setTimeout(showResults, 100);
            }
        },
        error: function() {
            $('.stepspace').html('<div class="alert alert-danger"><h3>Помилка завантаження кроку</h3><p>Перевірте, що всі файли на місці</p></div>');
        }
    });
}

function updateBreadcrumb() {
    var html = '';
    for (var i = 0; i < stepsData.length; i++) {
        if (i === currentStep) {
            html += '<li class="active">' + stepsData[i].name + '</li>';
        } else if (i < currentStep) {
            html += '<li><a href="#" onclick="goToStep(' + i + '); return false;">' + stepsData[i].name + '</a></li>';
        } else {
            html += '<li class="text-muted">' + stepsData[i].name + '</li>';
        }
    }
    $('.bc-steps').html(html);
}

function updateProgress() {
    var percent = Math.round((currentScore / maxScore) * 100);
    $('.progress-bar').css('width', percent + '%');
    $('.progress-text').text(percent + '%');
}

function updateNavButtons() {
    $('#prevController').prop('disabled', currentStep === 0);
    
    if (currentStep === totalSteps - 1) {
        $('#nextController').hide();
    } else {
        $('#nextController').show();
    }
}

function goToStep(stepIndex) {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
        currentStep = stepIndex;
        loadStep(currentStep);
        updateBreadcrumb();
        updateProgress();
        updateNavButtons();
    }
}

function addScore(points) {
    currentScore += points;
    if (currentScore > maxScore) currentScore = maxScore;
    updateProgress();
}

function showSuccess() {
    $('.validation-alert-success').fadeIn();
    setTimeout(function() {
        $('.validation-alert-success').fadeOut();
    }, 3000);
}

function showError() {
    $('.validation-alert-danger').fadeIn();
    setTimeout(function() {
        $('.validation-alert-danger').fadeOut();
    }, 3000);
}

function enableNextStep() {
    stepsData[currentStep].completed = true;
    $('#nextController').prop('disabled', false).removeClass('btn-primary').addClass('btn-success');
    setTimeout(function() {
        $('#nextController').removeClass('btn-success').addClass('btn-primary');
    }, 2000);
}

function changeLanguage(lang) {
    console.log('Зміна мови на: ' + lang);
}

function endTrainerNow() {
    $('#endModal').modal('hide');
    currentStep = 3;
    loadStep(currentStep);
    updateBreadcrumb();
    updateNavButtons();
}

function initStep1() {
    generateCrossword();
}

function generateCrossword() {
    var grid = $('#crosswordGrid');
    if (grid.length === 0) {
        console.error('Crossword grid not found');
        return;
    }
    
    var gridSize = 9;
    var layout = [
        [0,0,0,1,1,1,1,0,0],
        [0,0,0,1,0,1,0,0,0],
        [0,0,0,1,0,1,0,0,0],
        [1,1,1,1,1,1,1,1,1],
        [0,0,0,1,0,1,0,0,0],
        [0,0,0,1,0,0,0,0,0],
        [0,0,0,1,1,1,1,0,0],
        [0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0]
    ];

    grid.css({
        'grid-template-columns': 'repeat(' + gridSize + ', 40px)',
        'grid-template-rows': 'repeat(' + gridSize + ', 40px)'
    });

    var html = '';
    for (var row = 0; row < gridSize; row++) {
        for (var col = 0; col < gridSize; col++) {
            if (layout[row][col] === 0) {
                html += '<div class="crossword-cell blocked"></div>';
            } else {
                var number = '';
                if (row === 0 && col === 3) number = '<span class="number">1</span>';
                if (row === 3 && col === 0) number = '<span class="number">2</span>';
                if (row === 6 && col === 3) number = '<span class="number">3</span>';
                if (row === 0 && col === 5) number = '<span class="number">4</span>';
                if (row === 1 && col === 3) number = '<span class="number">5</span>';
                
                html += '<div class="crossword-cell">' + number + 
                        '<input type="text" maxlength="1" data-row="' + row + '" data-col="' + col + '"></div>';
            }
        }
    }
    grid.html(html);
}

function validateStep1() {
    var answers = {
        '0-3': 'I', '0-4': 'A', '0-5': 'A', '0-6': 'S',
        '3-0': 'S', '3-1': 'T', '3-2': 'O', '3-3': 'R', '3-4': 'A', '3-5': 'G', '3-6': 'E', '3-7': ' ', '3-8': ' ',
        '6-3': 'P', '6-4': 'A', '6-5': 'A', '6-6': 'S',
        '1-5': 'A', '2-5': 'A', '4-5': 'S',
        '1-3': 'L', '2-3': 'O', '4-3': 'U', '5-3': 'D'
    };

    var allCorrect = true;
    var inputs = $('.crossword-cell input');
    
    inputs.each(function() {
        var row = $(this).data('row');
        var col = $(this).data('col');
        var key = row + '-' + col;
        var value = $(this).val().toUpperCase();
        var expected = answers[key];
        
        if (expected && expected !== ' ') {
            if (value === expected) {
                $(this).parent().css('border-color', '#28a745');
            } else {
                $(this).parent().css('border-color', '#dc3545');
                allCorrect = false;
            }
        }
    });

    if (allCorrect) {
        addScore(30);
        enableNextStep();
        showSuccess();
    } else {
        showError();
    }
}

function initStep2() {
    $('.draggable').draggable({
        revert: 'invalid',
        helper: 'clone',
        cursor: 'move',
        zIndex: 1000
    });
    
    $('.scenario-card').droppable({
        accept: '.draggable',
        hoverClass: 'ui-droppable-hover',
        drop: function(event, ui) {
            var droppedValue = ui.draggable.attr('data-value');
            
            $(this).find('.draggable').remove();
            
            var clone = ui.draggable.clone();
            clone.css({
                position: 'static',
                left: 'auto',
                top: 'auto',
                margin: '10px 0 0 0'
            });
            clone.removeClass('ui-draggable ui-draggable-handle');
            clone.appendTo(this);
            
            $(this).attr('data-value', droppedValue);
            $(this).addClass('filled');
        }
    });
}

function validateStep2() {
    var correct = 0;
    var total = 4;
    
    var correctAnswers = {
        'scenario1': 's3',
        'scenario2': 'ec2',
        'scenario3': 'rds',
        'scenario4': 'lambda'
    };
    
    $('.scenario-card').each(function() {
        var name = $(this).attr('name');
        var value = $(this).attr('data-value');
        
        if (value === correctAnswers[name]) {
            $(this).css('border-color', '#28a745');
            correct++;
        } else {
            $(this).css('border-color', '#dc3545');
        }
    });
    
    if (correct === total) {
        addScore(35);
        enableNextStep();
        showSuccess();
    } else {
        showError();
    }
}

function initStep3() {
    console.log('Step 3 initialized');
}

function validateStep3() {
    var correct = 0;
    var total = 3;
    
    var correctAnswers = {
        'service1': 'aws',
        'service2': 'gcp',
        'service3': 'azure'
    };
    
    for (var service in correctAnswers) {
        var selected = $('input[name="' + service + '"]:checked').val();
        var group = $('input[name="' + service + '"]').closest('.form-group');
        
        if (selected === correctAnswers[service]) {
            group.find('label').css({
                'background': 'transparent',
                'border-color': '#ddd',
                'color': '#333'
            });
            group.find('label:has(input:checked)').css({
                'background': '#28a745',
                'border-color': '#28a745',
                'color': 'white'
            });
            correct++;
        } else {
            group.find('label').css({
                'background': 'transparent',
                'border-color': '#ddd',
                'color': '#333'
            });
            group.find('label:has(input:checked)').css({
                'background': '#dc3545',
                'border-color': '#dc3545',
                'color': 'white'
            });
        }
    }
    
    if (correct === total) {
        addScore(35);
        enableNextStep();
        showSuccess();
    } else {
        showError();
    }
}

function showResults() {
    endTime = new Date();
    var timeDiff = Math.round((endTime - startTime) / 1000);
    var percent = Math.round((currentScore / maxScore) * 100);
    
    $('#finalScore').text(percent);
    $('#startTime').text(formatTime(startTime));
    $('#endTime').text(formatTime(endTime));
    $('#timeDiff').text(timeDiff);
    $('#totalPoints').text(currentScore);
    $('#maxPoints').text(maxScore);
    
    var scoreElement = $('.results-score');
    scoreElement.removeClass('excellent good poor');
    if (percent >= 80) {
        scoreElement.addClass('excellent');
    } else if (percent >= 60) {
        scoreElement.addClass('good');
    } else {
        scoreElement.addClass('poor');
    }
}

function formatTime(date) {
    var hours = date.getHours().toString();
    var minutes = date.getMinutes().toString();
    var seconds = date.getSeconds().toString();
    
    if (hours.length < 2) hours = '0' + hours;
    if (minutes.length < 2) minutes = '0' + minutes;
    if (seconds.length < 2) seconds = '0' + seconds;
    
    return hours + ':' + minutes + ':' + seconds;
}
