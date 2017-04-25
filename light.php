<?php

	$file = "/home/lavigneb/public_html/lights.xml";

	$xml = simplexml_load_file($file);


	$light = $_GET["light"];
	$position = intval($_GET["position"]);

    $p = "two";

	switch ($position) {
    	case 1:
	        $p = "one";
	        break;
	    case 2:
	        $p = "two";
	        break;
	    case 3:
	        $p = "three";
	        break;
	    case 4:
	        $p = "four";
	        break;
	    case 5:
	        $p = "five";
	        break;
	    case 6:
	        $p = "six";
	        break;
	    case 7:
	        $p = "seven";
	        break;
	    case 8:
	        $p = "eight";
	        break;
	    case 9:
	        $p = "nine";
	        break;
	}


	$xml->$p = $light;
	
	$xml->asXML($file);
?>
