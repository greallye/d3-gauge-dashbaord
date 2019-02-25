var data = [ {
    team_name: "Team 1",
    team_score: 12
},{
    team_name: "Team 2",
    team_score: 23
},{
    team_name: "Team 3",
    team_score: 68
},{
    team_name: "Team 4",
    team_score: 55
},{
    team_name: "Team 5",
    team_score: 34
},{
    team_name: "Team 6",
    team_score: 6
},{
    team_name: "Team 7",
    team_score: 0
} ]

function createTeamScoring(){
    var ordered_array;
    var divId = 'chart';
    var counter = 0;
    for(key in data){
        var idName = divId + counter++;
        add(idName, data[key]['team_name'], data[key]['team_score'], 'block');
    }
}

function $() {
    var el = '.special';
    return document.querySelector(el);
}
  
function add(idName, teaName, score, showHide) {
    var useForId = teaName.replace(" " , "");
    var eachTeamScore = score;
    if(isNaN(eachTeamScore)){
        eachTeamScore = 0;
    }

    $('.special').innerHTML +=  '<div class="col-3 col-6-medium col-12-small boxyy">\
                                    <section class="box card-1">\
                                        <header>\
                                            <h3>'+ teaName +'</h3>\
                                            <h4>Score ' + eachTeamScore + '</h4>\
                                        </header>\
                                        <div class="chart" id="'+ idName +'"></div>\
                                    </section>\
                                </div>'

    setTimeout(function(){ createIndividualChart(idName, eachTeamScore, 250, 200, 35, 8, '30px'); }, 10);
}

function createIndividualChart(chartId, element, height, width, tickness, needlewidth, fontSize){
    
    if(element <= 70){
        chartValue = element;
    }else{
        chartValue = 70;
    }

    var powerGauge = gauge('#'+chartId, {
        size: height,
        ringWidth: tickness,
        pointerWidth: needlewidth
    });

    powerGauge.render();
    powerGauge.update(chartValue, null, getLabel(chartValue), height, width, fontSize);

    function getLabel(v){
        var text = '';
        if(v <= 10){
            text = 'Excellent';
        }else if(v >= 10 && v <= 20){
            text = 'Very Good';
        }else if(v >= 20 && v <= 30){
            text = 'Good';
        }else if(v >= 30 && v <= 40){
            text = 'Average';
        }else if(v >= 40 && v <= 50){
            text = 'Concern';
        }else if(v >= 50 && v <= 70){
            text = 'Action Required';
        }
        return text;
    }
    
}

createTeamScoring();






