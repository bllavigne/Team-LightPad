<?php

	$file = "/home/moorbria/public_html/lights.xml";

	$xml = simplexml_load_file($file);


	$light = $_GET["light"];

	foreach ($xml->children() as $c) {
    	$c[0] = $light;
		echo $c;
	}

	
	$xml->asXML($file);
?>
