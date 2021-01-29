<!DOCTYPE html>
<html lang="en" xml:lang="en" xmlns= "http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>The Fantasy Prophet</title>
    <link rel="stylesheet" href="mybulma\css\mystyles.css">
    <script src="https://kit.fontawesome.com/4aea8779ab.js" crossorigin="anonymous"></script>
  </head>
  <?php 
  include 'lib/config.php';
  ?>
  <body class="has-navbar-fixed-top">
  <nav class="navbar is-fixed-top is-family-secondary bolder-text" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
        <a class="navbar-item" href="index.php">
            <img src="assets\images\logo.png" height="100">
        </a>

        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        </a>
    </div>

    <div id="mainNavbar" class="navbar-menu">
        <div class="navbar-start">
            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link is-arrowless is-size-5">
                NBA
                </a>

                <div class="navbar-dropdown">
                <a class="navbar-item">
                    Projections
                </a>
                <a class="navbar-item">
                    DK Lineup Builder
                </a>
                <a class="navbar-item">
                    DK Retrospective
                </a>
                </div>
            </div>

            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link is-arrowless is-size-5">
                NFL
                </a>

                <div class="navbar-dropdown">
                <a class="navbar-item">
                    Projections
                </a>
                <a class="navbar-item">
                    DK Lineup Builder
                </a>
                <a class="navbar-item">
                    DK Retrospective
                </a>
                </div>
            </div>

            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link is-arrowless is-size-5">
                WNBA
                </a>

                <div class="navbar-dropdown">
                <a class="navbar-item">
                    Projections
                </a>
                <a class="navbar-item">
                    DK Lineup Builder
                </a>
                <a class="navbar-item">
                    DK Retrospective
                </a>
                </div>
            </div>

            <div class="navbar-item has-dropdown is-hoverable">
                <a class="navbar-link is-arrowless is-size-5">
                CFL
                </a>

                <div class="navbar-dropdown">
                <a class="navbar-item">
                    Projections
                </a>
                <a class="navbar-item">
                    DK Lineup Builder
                </a>
                <a class="navbar-item">
                    DK Retrospective
                </a>
                </div>
            </div>
        </div>

        <div class="navbar-end">
        <div class="navbar-item">
            <div class="buttons">
            <a class="button is-primary">
                <strong>Sign up</strong>
            </a>
            <a class="button is-light">
                Log in
            </a>
            </div>
        </div>
        </div>
    </div>
    </nav>
    <section class="hero is-primary stroke-text">
        <div class="hero-body">
            <div class="container">
            <h1 class="title">
            NBA DRAFTKINGS LINEUP BUILDER
            </h1>
            <h2 class="subtitle">
                11/20/2020
            </h2>
            </div>
        </div>
    </section>
    <section class="hero lineup-section">
        <div class="hero-body">
            <div class="columns">
                <div class="column is-three-fifths"> 
                    <div class="tabs is-large is-fullwidth">
                        <ul>
                            
                        </ul>
                    </div>
                </div>
                <div class="column is-two-fifths"> 
                    <h4 class="title is-4">
                        Lineup Avg Remaining/Player 
                    </h4>
                    <h4 class="title is-4">
                        Remaining Salary: $<span class="rem-salary"></span>
                    </h4>
                </div>
            </div>
            <div class="columns">
                <div class="column is-three-fifths"> 
                    <div class="table-container has-background-white lineup-table">
                        <table class="table">
                            <thead>
                                <tr>
                                <th>Pos</th>
                                <th>Player</th>
                                <th>Team</th>
                                <th>Opp</th>
                                <th>Min</th>
                                <th>PPM</th>
                                <th>Proj</th>
                                <th>Salary</th>
                                <th>&nbsp;</th>
                                </tr>
                            </thead>
                            <tbody class="is-family-secondary is-size-7 player-rows">
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="column is-two-fifths"> 
                    <div class="table-container has-background-white lineup-table">
                    <table class="table">
                            <thead>
                                <tr>
                                <th>Pos</th>
                                <th>Player</th>
                                <th>Team</th>
                                <th>Opp</th>
                                <th>Proj</th>
                                <th>Salary</th>
                                <th>&nbsp;</th>
                                </tr>
                            </thead>
                            <tbody class="is-family-secondary is-size-7 selected-rows">
                            </tbody>
                        </table>
                        </div>
                    
                        <button class="button is-primary is-family-secondary bolder-text mt-4 gen-lineup">
                            <strong>GENERATE LINEUP</strong>
                        </button>
                </div>
            </div>
        </div>
    </section>
    <footer class="footer has-background-grey-darker">
        <div class="content has-text-centered has-text-white-ter">
            <p>
            Garrett Genz © 2020
            </p>
        </div>
    </footer>
    <script src="./scripts/lineup-builder.js">
    </script>
  </body>
</html>