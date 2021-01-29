<?php

include './lib/config.php';
header('Content-Type: application/json');

$nbadb_conn = pg_connect("host=" . $GLOBALS['endpoint'] . " dbname=" .
$GLOBALS['nba_database'] . " user=" . $GLOBALS['nba_user'] . " password=" . $GLOBALS['nba_password']);

// Store query results in this array
$array = [];

if (htmlspecialchars($_GET["league"]) == 'NBA') {
    // Query to grab players from database
    $result = pg_query($GLOBALS['nbadb_conn'],
    'SELECT	draftkings.position AS "position", player_name AS "name", team_abbrev AS "team", to_char(min, \'90D00\') AS "projMin", 
            to_char(pts_per_min, \'90D00\') AS "projPtsPerMin", to_char(proj_pts, \'90D00\') AS "projPts", draftkings.salary AS "salary", playerprojections.playerid AS "playerid",
            case when team_abbrev = home_team then away_team else home_team end as "opp" 
    FROM	draftkings JOIN playerprojections ON (clean_name(draftkings.name) = clean_name(player_name) AND upper(draftkings.team) = team_abbrev AND draftkings.game_date = playerprojections.game_date)
                       JOIN games on (games.gameid = playerprojections.gameid and (team_abbrev = games.home_team or team_abbrev = games.away_team))
    where playerprojections.game_date = current_date
    order by proj_pts DESC');

    while ($row = pg_fetch_object($result)) {
        $array[] = $row;
    }
}

$returnJSON = json_encode($array);

echo $returnJSON;

