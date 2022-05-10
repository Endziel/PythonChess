<!DOCTYPE html>

<head>
    <link rel="stylesheet" type="text/css" href="public/css/LoginStyle.css">
    <title>LOGIN PAGE</title>
</head>

<body>
    <div class="container">
        <div class="logo">

        </div>
        <div class="login-container">
            <form class="login" action="login" method="POST">
                <div class="messages">
                    <?php
                        if(isset($messages)){
                            foreach($messages as $message) {
                                echo $message;
                            }
                        }
                    ?>
                </div>
                <input name="email" type="text" placeholder="email@email.com">
                <input name="password" type="password" placeholder="password">
                <button type="submit">LOGIN</button>

                <?php 
                    $string = 'Example String\n'; 
                    $pyout = exec('python print("Hello")');
                    echo $pyout;
                    echo "\n";
                ?>
            </form>
            <!-- <script type="text/javascript" src = "./public/js/hamMenu.js">  </script> -->

            
            <script src="./public/js/three.js"></script>
		<script src="./public/js/test.js"></script>

        </div>
    </div>
</body>