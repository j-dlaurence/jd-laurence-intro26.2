
// const API_KEY = 'YOUR_API_KEY';
// For security I would prefer to not hardcode the API key but I am including it here
//  so it can be tested easily when submitted
const API_KEY = '048b5c31b4aea4e297918c6a6f7fa452';
const BASE_URL = 'https://v3.football.api-sports.io';

let selectedTeamId = null;

const loadTeamsBtn = document.querySelector('#load-teams-btn');
loadTeamsBtn.addEventListener('click', function() {
    loadTeams();
});

const loadResultsBtn = document.querySelector('#load-results-btn');
loadResultsBtn.addEventListener('click', function () {
    if (selectedTeamId === null) {
        document.querySelector('#fixture-container').innerHTML =
            '<p class="placeholder">Please select a team first.</p>';
        return;
    }
    getResults(selectedTeamId);
});


function loadTeams() {
    const teamsContainer = document.querySelector('#teams-container');
    teamsContainer.innerHTML = '<p class="placeholder">Loading teams...</p>';

    selectedTeamId = null;
    document.querySelector('#fixture-container').innerHTML = '';

    fetch(`${BASE_URL}/teams?league=1&season=2022`, {
        headers: {
            'x-apisports-key': API_KEY
        }
    })
        .then(response => response.json())
        .then(data => {
            const teams = data.response;
            // this api has limitations on the free plan
            if (!teams || teams.length === 0) {
                teamsContainer.innerHTML = '<p class="error-message">No teams found. The data may not be available on the free plan.</p>';
                return;
            }
            teams.sort((a,b) => a.team.name.localeCompare(b.team.name));
            teamsContainer.innerHTML = '';

            const select = document.createElement('select');
            select.id = 'team-select';

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.innerText = '- Select a team -';
            select.appendChild(defaultOption);

            for (let i = 0; i < teams.length; i++) {
                const option = document.createElement('option');
                option.value = teams[i].team.id;
                option.innerText = teams[i].team.name;
                select.appendChild(option);
            }

            teamsContainer.appendChild(select);
            teamsLoaded = true;

            select.addEventListener('change', function (event) {
                selectedTeamId = event.target.value !== '' ? event.target.value : null;
 
            });
        })
        .catch(error => {
            console.log('Error loading teams: ', error);
            teamsContainer.innerHTML = '<p class="placeholder">Error loading teams. Check API key.</p>';
        });    

}

function getResults(teamId) {
    const fixtureContainer = document.querySelector('#fixture-container');
    fixtureContainer.innerHTML = '<p class="placeholder">Loading...</p>';
 
    // A status of FT means completed.
    fetch(`${BASE_URL}/fixtures?league=1&season=2022&team=${teamId}`, {
        headers: {
            'x-apisports-key': API_KEY
        }
    })
        .then(response => response.json())
        .then(data => {
            const fixtures = data.response;
 
            if (fixtures.length === 0) {
                fixtureContainer.innerHTML = '<p class="placeholder">No results found for this team.</p>';
                return;
            }
 
            // sort chronologically
            fixtures.sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));
 
            fixtureContainer.innerHTML = '';
 
            for (let i = 0; i < fixtures.length; i++) {
                const match = fixtures[i];
                const home = match.teams.home.name;
                const away = match.teams.away.name;
                const homeGoals = match.goals.home;
                const awayGoals = match.goals.away;
                const round = match.league.round;
                const date = new Date(match.fixture.date).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                });
 
                
                const teamIsHome = match.teams.home.id == teamId;
                const teamWon = teamIsHome ? match.teams.home.winner : match.teams.away.winner;
                let resultLabel, resultClass;
                if (teamWon === true) {
                    resultLabel = 'W';
                    resultClass = 'result-w';
                } else if (teamWon === false) {
                    resultLabel = 'L';
                    resultClass = 'result-l';
                } else {
                    resultLabel = 'D';
                    resultClass = 'result-d';
                }
 
                const card = document.createElement('div');
                card.classList.add('fixture-card');
                card.innerHTML = `
                    <div class="card-top">
                        <span class="match-round">${round}</span>
                        <span class="result-badge ${resultClass}">${resultLabel}</span>
                    </div>
                    <p class="match-teams">${home} ${homeGoals} - ${awayGoals} ${away}</p>
                    <p class="match-detail">📅 ${date}</p>
                `;
 
                fixtureContainer.appendChild(card);
            }
        })
        .catch(error => {
            console.log('Error loading results:', error);
            fixtureContainer.innerHTML = '<p class="error-message">Could not load results. Please try again.</p>';
        });
}