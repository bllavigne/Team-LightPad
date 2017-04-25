<?php

	$file = "/home/lavigneb/public_html/lightpad/lights.xml";

	$xml = simplexml_load_file($file);


	$light = $_GET["light"];

	foreach ($xml->children() as $c) {
    	$c[0] = $light;
		echo $c;
	}

	
	$xml->asXML($file);
?>
