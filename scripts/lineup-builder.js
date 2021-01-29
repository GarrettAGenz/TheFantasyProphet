/* Global Variables */
let allPlayers;
let availablePlayers;
let selectedPlayers = [];
const avail_positions = ['PG', 'SG', 'SF', 'PF', 'C', 'G', 'F', 'Util'];
let current_position = avail_positions[0];
let remaining_salary = 50000;

//TODO
// Fix allPlayers model from using strings for numeric data and remove ParseInt()
// Fix AddPlayer button from using the DOM elements at all. Need to pull all data from allPlayers

/* Main flow */
populateLineup();

function populateLineup() {
    
    // Populate initial data
    initialPopulateAvailablePlayers();
    initialPopulateSelectedPlayers();

    buildLineupTable();
    buildTabs();
    handleGenerateLineupButton();
}

/* Helper functions */

// Only allow number and decimals inputs into lineup min and points per min inputs
function isNumberKey(evt) {
    const charCode = (evt.which) ? evt.which : evt.keyCode
    return !(charCode > 31 && (charCode != 46 &&(charCode < 48 || charCode > 57)));
    }

async function getProjections(league) {
    const res = await fetch(`./getProjections.php?league=${league}`);
    const jsonData = await res.json();
    console.log(jsonData);
    return jsonData;
    }

// Build the html containing all of the player's projections
function buildAvailablePlayerTableRow(element) {
    const lineupTable = document.querySelector('.player-rows');
    const row = `<tr data-playerid = '${element.playerid}' class='player-row'>
                    <td class="player-pos">${element.position}</td>
                    <td class="player-name">${element.name}</td>
                    <td class="player-team">${element.team}</td>
                    <td class="player-opp">${element.opp}</td>
                    <td>
                        <div class=\"field\">
                            <div class=\"control\">
                                <input class=\"input is-small min\" type=\"text\" value=\"${element.projMin}\" onkeypress=\"return isNumberKey(event)\">
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class=\"control\">
                            <input class=\"input is-small ptsPerMin\" type=\"text\" value=\"${element.projPtsPerMin}\" onkeypress=\"return isNumberKey(event)\">
                        </div>
                    </td>
                    <td class="proj">${element.projPts}</td>
                    <td class="player-salary">${element.salary}</td>
                    <td>
                        <a><span class=\"icon has-text-primary add-player\">
                            <i class=\"fas fa-2x fa-plus-circle\"></i>
                        </span></a>
                    </td>
                </tr>`;
    lineupTable.innerHTML += row;

}

function buildAvailablePlayerTable(players) {
    // Blank out current players
    document.querySelector('.player-rows').innerHTML = '';

    players.forEach(buildAvailablePlayerTableRow);

    // Add listeners to the available players
    inputListeners();
    addButtonListener();
}

function updateAvailablePlayerTable(availPlayers) {
    const displayedPlayers = document.querySelectorAll('.player-row');

    // Create array of playerIds that should be displayed
    displayedPlayerIds = availPlayers.map(player => player.playerid);

    displayedPlayers.forEach(function(player) {
        // Check if player is in availPlayers
        // If not set display:none
        if (displayedPlayerIds.includes(player.dataset.playerid)) 
            player.style.display = '';
        else 
            player.style.display = 'none';
    })
}

function buildLineupTableRow(player) {
    const lineupTable = document.querySelector('.selected-rows');

    //TODO do not output remove button if row is blank
    const row = `<tr class='selected-player-row'>
                    <td class="player-pos">${player.position}</td>
                    <td>${player.name}</td>
                    <td>${player.team}</td>
                    <td>${player.opp}</td>
                    <td>${player.proj}</td>
                    <td>${player.salary}</td>
                    <td><a><span class="icon has-text-danger remove-player">
                        <i class="fas fa-2x fa-times-circle"></i>
                    </span></a></td>
                </tr>`;
    lineupTable.innerHTML += row;

}

function buildLineupTable() {
    document.querySelector('.selected-rows').innerHTML = '';
    selectedPlayers.forEach(buildLineupTableRow);

    // Add listeners
    removeButtonListener();

    updateSalary();
}

function updatePlayerProj(pid, min, pts_per_min) {
    updated_player = allPlayers.find(player => player.playerid == pid);
    updated_player.projPtsPerMin = pts_per_min;
    updated_player.projMin = min;
    updated_player.projPts = pts_per_min * min;
}

/* When proj min or proj pts per min are updated */
function handleInputUpdate(input) {
    input.addEventListener('change', function() {
        playerRow = input.closest('tr');
        const min = playerRow.querySelector('.min').value;
        const ptsPerMin = playerRow.querySelector('.ptsPerMin').value;
        const projPts = min * ptsPerMin;
        playerRow.querySelector('.proj').innerHTML = projPts.toFixed(2);

        // Update data model
        updatePlayerProj(playerRow.dataset.playerid, min, ptsPerMin);
    });
}

function inputListeners() {
    const inputs = document.querySelectorAll('.input');

    inputs.forEach(handleInputUpdate);   
}

// Model
function addPlayer(pid, pos) {
    // Find player object in list of all players
    player_to_add = allPlayers.find(element => element.playerid === pid.toString());
    console.log(player_to_add);
    // Add player data to the correct row in the selected players array
    let addedPlayer = selectedPlayers.find(element => element.position === pos);
    
    addedPlayer.name = player_to_add.name;
    addedPlayer.team = player_to_add.team;
    addedPlayer.opp = player_to_add.opp;
    addedPlayer.proj = player_to_add.projPts;
    addedPlayer.salary = player_to_add.salary;
    addedPlayer.playerid = pid;

    // Update Salary
    remaining_salary -= addedPlayer.salary;

    // Hide row in available player list
    document.querySelector(`[data-playerid='${pid}']`).classList.add('selected');
}

/* When add button clicked */
function handleAddButton(button) {
    button.addEventListener('click', function() {
        const playerRow = button.closest('.player-row');

        addPlayer(playerRow.dataset.playerid, current_position)

        // Rebuild the lineup table
        buildLineupTable();

        // Increment current position
        incrementPosition(current_position);
    })
}

function addButtonListener() {
    const adds = document.querySelectorAll('.add-player');

    adds.forEach(handleAddButton);
}

function handleRemoveButton(button) {
    button.addEventListener('click', function() {
        const posToRemove = button.closest('.selected-player-row').querySelector('.player-pos').innerHTML;
        
        let removedPlayer = selectedPlayers.find(element => element.position === posToRemove)

        // Update Salary before blanking out fields
        remaining_salary += parseInt(removedPlayer.salary, 10);

        // Update array to remove player information
        removedPlayer.name = '';
        removedPlayer.team = '';
        removedPlayer.opp = '';
        removedPlayer.proj = '';
        removedPlayer.salary = '';

        //Add player back to pool
        document.querySelector(`[data-playerid="${removedPlayer.playerid}"]`).classList.remove('selected');

        // Remove data attribute after adding player back to pool
        removedPlayer.playerid = '';

        buildLineupTable();

    })
}

function removeButtonListener() {
   const removes = document.querySelectorAll('.remove-player');

   removes.forEach(handleRemoveButton);
}

function isBlankPlayer (acc, cur) {
    if (cur.name === '')
        return acc + 1;
    else 
        return acc + 0;
}

function checkNextPosition(i) {
    // Once we hit the end of the array start over
    if (i === avail_positions.length - 1)
        i = 0;
    else
        i = i + 1;
    console.log(selectedPlayers[i]);
    console.log(selectedPlayers);
    console.log(i);
    // Check if next position is empty. If not run same function on the next position
    if (selectedPlayers[i].name === '')
        return i;
    else 
        return checkNextPosition(i);
}

function incrementPosition(curPos) {
    // Get index of current position
    let curPosIndex = avail_positions.findIndex(pos => pos === curPos);

    // If a blank spot exists
    if (selectedPlayers.reduce(isBlankPlayer, 0) !== 0) {
        // Update current position to it
        current_position = avail_positions[checkNextPosition(curPosIndex)];
    }

    unselectTabs();

    // Select the correct tab
    document.querySelectorAll('.tabs ul li').forEach(function(tab) {
        if (tab.innerText === current_position) {
            tab.classList.add('is-active');
        }
    });

    if (current_position === 'Util') {
        availablePlayers = allPlayers;
    }
    else {
        availablePlayers = allPlayers.filter(player => player.position.includes(current_position));
    }

    updateAvailablePlayerTable(availablePlayers);
}

async function initialPopulateAvailablePlayers() {
    allPlayers = await getProjections('NBA');

    availablePlayers = allPlayers.filter(player => player.position.includes(current_position));
    buildAvailablePlayerTable(allPlayers);
    updateAvailablePlayerTable(availablePlayers);
}

// Populate initial selected players for lineup
function initialPopulateSelectedPlayers() {
    avail_positions.forEach(function(player) {
        selectedPlayers.push({'position': player,
                                'playerid' : '',
                                'name' : '',
                                'team' : '',
                                'opp' : '',
                                'proj' :'',
                                'salary' : '' });
    });
}

// Model
// View
// Controller


function handleTabClick(tab) {
    tab.addEventListener('click', function() {
        unselectTabs();
        tab.classList.add('is-active');

        current_position = tab.innerText;
        if (current_position === 'Util') {
            availablePlayers = allPlayers;
        }
        else {
            availablePlayers = allPlayers.filter(player => player.position.includes(current_position));
        }

        updateAvailablePlayerTable(availablePlayers);

    })
}

// True Helper Functions
function tabClick() {
    document.querySelectorAll('.tabs ul li').forEach(handleTabClick);
}

function unselectTabs() {
    document.querySelectorAll('.tabs ul li').forEach(function(tab) {
        tab.classList.remove('is-active');
    });
}

function buildTabs() {
    tabContainer = document.querySelector('.tabs ul');

    avail_positions.forEach(function(pos) {
        tabContainer.innerHTML += `<li><a>${pos}</a></li>`;
    })

    // Set first one to active
    tabContainer.querySelector('li').classList.add('is-active');

    // Set tab listeners
    tabClick();
}

function updateSalary() {
    let rem_salary = document.querySelector('.rem-salary');

    rem_salary.textContent = remaining_salary;
}

function handleGenerateLineupButton() {
    const getLineupButton = document.querySelector('.gen-lineup');

    getLineupButton.addEventListener('click', function() {
        // Create array of empty positions
        const emptyPositions = selectedPlayers.filter(player => !player.playerid)
                                                .map(x => x.position);

        // Build array of all the possible players at the various open positions
        let playerPool = [];

        // Populate playerPool with players for each position
        emptyPositions.forEach(function(value, i) {
            // Create array to store potential players
            playerPool[i] = [];

            // Build array of selected player IDs
            const selectedPlayerIds = selectedPlayers.filter(player => player.playerid !== "").map(player => player.playerid);
            
            // Build list of potential players at the current position in order by value
            const posPlayers = allPlayers
                                .filter(player => player.position.includes(value) || value == 'Util')
                                .filter(player => !selectedPlayerIds.includes(player.playerid)) // Remove selected players
                                .sort(function(a, b) {return (b.projMin * b.projPtsPerMin)/ b.salary - (a.projMin * a.projPtsPerMin) / a.salary});

            //console.log(value);
            //console.log(posPlayers);

            // Create three different salary groups
            low_salary = posPlayers.filter(player => player.salary < 4500);
            med_salary = posPlayers.filter(player => player.salary >= 4500 && player.salary < 7000);
            high_salary = posPlayers.filter(player => player.salary >= 7000);

            console.log(low_salary);
            console.log(med_salary);
            console.log(high_salary);

            // Add four of each to the possible players available
            low_salary.forEach(function(p_val, p_i) {
                // Only select top five sorted by value for each position
                if (p_i < 4) {
                    playerPool[i].push({playerid:p_val.playerid, salary:p_val.salary, proj_pts:p_val.projPts, pos:value});
                }
            });

            med_salary.forEach(function(p_val, p_i) {
                // Only select top five sorted by value for each position
                if (p_i < 4) {
                    playerPool[i].push({playerid:p_val.playerid, salary:p_val.salary, proj_pts:p_val.projPts, pos:value});
                }
            });

            high_salary.forEach(function(p_val, p_i) {
                // Only select top five sorted by value for each position
                if (p_i < 4) {
                    playerPool[i].push({playerid:p_val.playerid, salary:p_val.salary, proj_pts:p_val.projPts, pos:value});
                }
            });

        });

        let combos = cartesian.apply(null, playerPool);

        //console.log(playerPool);
        //console.log(remaining_salary);
        //console.log(combos);

        // Combination validation
		combos = combos
        .filter(value => {
            let total_salary = 0;

            value.forEach(row => total_salary += parseInt(row.salary));

            return total_salary <= remaining_salary;
        }) 
        .filter(value => {
			//	Store already selected players here to check for dups
			let selected_players = [];
			let dup_found = false;

            value.forEach(row => {
                //console.log(selected_players.indexOf(p_val.playerid) > -1);
                if (selected_players.indexOf(row.playerid) > -1) {
                    // Stop checking if player is in the combinations twice
                    dup_found = true;
                } else {
                    selected_players.push(row.playerid);
                }	
            });
            
            // If the code gets to this point it is a valid combination
            return dup_found == false;
        });
        
        bestCombination = combos.sort(compare_combinations)[0];
        //console.log(bestCombination);
        
        // Add players to lineup
        bestCombination.forEach(row => addPlayer(row.playerid, row.pos));

        // Rebuild the lineup table
        buildLineupTable();
    })
}

// Function found to create combinations of multiple arrays
function cartesian() {
    var r = [], arg = arguments, max = arg.length-1;
    function helper(arr, i) {
        for (var j=0, l=arg[i].length; j<l; j++) {
            var a = arr.slice(0); // clone arr
            a.push(arg[i][j]);
            if (i==max)
                r.push(a);
            else
                helper(a, i+1);
        }
    }
    helper([], 0);
    return r;
    }

// Helper for compare_combinations
const addProjPoints = (acc, cur) => acc + parseFloat(cur.proj_pts);

function compare_combinations(a, b) {
    return (b.reduce(addProjPoints, 0) - a.reduce(addProjPoints, 0));
}